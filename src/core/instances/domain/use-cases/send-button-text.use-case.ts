import {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import makeWASocket, { DisconnectReason, proto } from "baileys";
import { Boom } from "@hapi/boom";
import { IInstanceRepository } from "../contracts/instance.interface";

export class SendButtonTextUseCase
  implements UseCase<SendButtonTextInput, void>
{
  constructor(private readonly repository: IInstanceRepository) {}

  async execute(input: SendButtonTextInput): Promise<void> {
    const session = await this.repository.getById(input.sessionId);

    if (!session) {
      throw new Error("Não foi possível encontrar a sessão.");
    }

    const authPath = session.authPath;

    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    return new Promise<void>((resolve, reject) => {
      const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
      });

      let messageSent = false;

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open" && !messageSent) {
          console.log(`✅ Sessão ${input.sessionId} conectada com sucesso.`);

          const jid = `${input.to}@s.whatsapp.net`;
          const payload = this.buildInteractiveMessage(input);
          try {
            await sock.sendMessage(jid, payload as any);
            messageSent = true;

            console.log("📨 Mensagem enviada com sucesso.");

            setTimeout(() => {
              sock.end(null);
              resolve();
            }, 3000);
            resolve();
          } catch (err) {
            sock.end(null);
            reject(new Error(`Erro ao enviar mensagem: ${err}`));
          }
        }

        if (connection === "close" && !messageSent) {
          const statusCode = (lastDisconnect?.error as Boom)?.output
            ?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            console.log(`🔄 Tentando reconectar sessão ${input.sessionId}...`);
            setTimeout(
              () => this.execute(input).then(resolve).catch(reject),
              3000
            );
          } else {
            reject(new Error("Sessão deslogada. Requer novo QR Code."));
          }
        }
      });

      sock.ev.on("creds.update", saveCreds);
    });
  }

  private buildInteractiveMessage(input: SendButtonTextInput) {
    const buttons = input.buttons.map((btn) => {
      switch (btn.type) {
        case "reply":
          return {
            type: "reply",
            reply: {
              id: btn.id,
              title: btn.title,
            },
          };
        case "url":
          return {
            type: "url",
            url: {
              displayText: btn.displayText,
              url: btn.url,
            },
          };
        case "copy":
          return {
            type: "copy",
            copy: {
              displayText: btn.displayText,
              text: btn.text,
            },
          };
      }
    });

    return {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: input.message },
            footer: input.footer ? { text: input.footer } : undefined,
            header: input.header
              ? { type: "TEXT", text: input.header }
              : undefined,
            nativeFlowMessage: {
              buttons,
            },
          },
        },
      },
    };
  }
}

export type ButtonOption =
  | {
      type: "reply";
      id: string;
      title: string;
    }
  | {
      type: "url";
      displayText: string;
      url: string;
    }
  | {
      type: "copy";
      displayText: string;
      text: string;
    };

export type SendButtonTextInput = {
  sessionId: string;
  message: string;
  to: string;
  buttons: ButtonOption[];
  header?: string;
  footer?: string;
};
