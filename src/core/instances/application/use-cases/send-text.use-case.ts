import {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import makeWASocket, { DisconnectReason } from "baileys";
import { Boom } from "@hapi/boom";
import { IInstanceRepository } from "../../domain/contracts/instance.interface";

export class SendTextUseCase implements UseCase<SendTextInput, void> {
  constructor(private readonly repository: IInstanceRepository) {}

  async execute(input: SendTextInput): Promise<void> {
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
          try {
            await sock.sendMessage(jid, { text: input.message });
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
}

export type SendTextInput = {
  sessionId: string;
  message: string;
  to: string;
};
