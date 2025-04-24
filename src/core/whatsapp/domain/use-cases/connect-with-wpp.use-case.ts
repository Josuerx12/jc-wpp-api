import { UseCase } from "../../../../contracts/use-case.interface";
import { ISessionRepository } from "../contracts/session.interface";
import QRCode from "qrcode";
import { v4 } from "uuid";
import fs from "fs";
import {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import makeWASocket, { DisconnectReason } from "baileys";
import { Boom } from "@hapi/boom";

export class CreateConnectWithWppUseCase
  implements UseCase<CreateConnectionWppInput, ConnectionWppOutput>
{
  constructor(private readonly repository: ISessionRepository) {}

  async execute(input: CreateConnectionWppInput): Promise<ConnectionWppOutput> {
    const sessionId = input.sessionId ?? v4();

    const session = await this.repository.getById(sessionId);

    let authPath: string;

    if (!session) {
      authPath = `auth/${sessionId}`;
      fs.mkdirSync(authPath, { recursive: true });
    } else {
      authPath = session?.authPath;
    }

    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
    });

    return new Promise<ConnectionWppOutput>((resolve, reject) => {
      let resolved = false;

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && !resolved) {
          try {
            const qrCodeBase64 = await QRCode.toDataURL(qr);
            resolved = true;
            resolve({ qrCode: qrCodeBase64, sessionId });
          } catch (error) {
            reject(new Error("Erro ao gerar QR Code"));
          }
        }

        if (connection === "open" && !resolved) {
          console.log(`✅ Conexão estabelecida para sessão ${sessionId}`);
          try {
            if (!session) {
              await this.repository.createOrUpdate({
                cpf: input.cpf,
                name: input.name,
                sessionId,
                authPath,
              });
            }

            await this.repository.createOrUpdate({ ...session });

            resolved = true;

            sock.end(null);

            resolve({ sessionId });
          } catch (error) {
            sock.end(null);
            reject(new Error("Erro ao salvar sessão no banco de dados"));
          }
        }

        if (connection === "close") {
          const statusCode = (lastDisconnect.error as Boom)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            console.log(`🔄 Tentando reconectar sessão ${sessionId}...`);
            setTimeout(() => this.execute({ ...input, sessionId }), 3000);
          } else {
            console.log(
              `⚠️ Sessão ${sessionId} deslogada. Requer novo QR Code.`
            );
            if (!resolved) {
              resolved = true;
              reject(new Error("Sessão deslogada. Requer novo QR Code."));
            }
          }
        }
      });

      sock.ev.on("creds.update", saveCreds);
    });
  }
}

export type CreateConnectionWppInput = {
  cpf?: string;
  name?: string;
  sessionId?: string;
};

export type ConnectionWppOutput = {
  sessionId: string;
  qrCode?: string;
};
