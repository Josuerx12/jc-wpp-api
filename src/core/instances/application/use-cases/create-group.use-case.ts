import {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import makeWASocket, { DisconnectReason } from "baileys";
import { Boom } from "@hapi/boom";
import { IInstanceRepository } from "../../domain/contracts/instance.interface";

export class CreateGroupUseCase
  implements UseCase<CreateGroupInput, { groupId?: string }>
{
  constructor(private readonly repository: IInstanceRepository) {}

  async execute(input: CreateGroupInput): Promise<{ groupId?: string }> {
    const session = await this.repository.getBySessionId(input.sessionId);

    if (!session) {
      throw new Error("Não foi possível encontrar a sessão.");
    }

    const authPath = session.authPath;

    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    return new Promise<{ groupId?: string }>((resolve, reject) => {
      const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
      });

      let groupCreated = false;

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open" && !groupCreated) {
          console.log(`✅ Sessão ${input.sessionId} conectada com sucesso.`);

          try {
            const res = await sock.groupCreate(
              input.subject,
              input.numbers.map((n) => `${n}@s.whatsapp.net`)
            );

            groupCreated = true;

            console.log("✅ Grupo criado com sucesso!.");

            setTimeout(() => {
              sock.end(null);
              resolve({});
            }, 3000);

            resolve({ groupId: res.id });
          } catch (err) {
            sock.end(null);
            reject(new Error(`Erro ao enviar mensagem: ${err}`));
          }
        }

        if (connection === "close" && !groupCreated) {
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

export type CreateGroupInput = {
  sessionId: string;
  subject: string;
  numbers: string[];
};
