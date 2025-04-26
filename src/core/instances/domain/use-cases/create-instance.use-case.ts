import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import QRCode from "qrcode";
import { v4 } from "uuid";
import fs from "fs";
import {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import makeWASocket, { DisconnectReason } from "baileys";
import { Boom } from "@hapi/boom";
import { IInstanceRepository } from "../contracts/instance.interface";

export class CreateInstanceUseCase
  implements UseCase<CreateConnectionWppInput, ConnectionWppOutput>
{
  constructor(private readonly repository: IInstanceRepository) {}

  async execute(input: CreateConnectionWppInput): Promise<ConnectionWppOutput> {
    const instanceId = input.instanceId ?? v4();

    const instance = await this.repository.getById(instanceId);

    let authPath: string;

    if (!instance) {
      authPath = `auth/${instanceId}`;
      fs.mkdirSync(authPath, { recursive: true });
    } else {
      authPath = instance?.authPath;
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
            resolve({ qrCode: qrCodeBase64, instanceId });
          } catch (error) {
            reject(new Error("Erro ao gerar QR Code"));
          }
        }

        if (connection === "open" && !resolved) {
          console.log(`✅ Conexão estabelecida para instancia ${instanceId}`);
          try {
            if (!instance) {
              await this.repository.createOrUpdate({
                userId: input.userId,
                instanceId,
                authPath,
              });
            }

            await this.repository.createOrUpdate({
              ...instance,
            });

            resolved = true;

            resolve({ instanceId });
          } catch (error) {
            console.log(error);
            reject(new Error("Erro ao salvar instancia no banco de dados"));
          }
        }

        if (connection === "close") {
          const statusCode = (lastDisconnect.error as Boom)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            console.log(`🔄 Tentando reconectar instancia ${instanceId}...`);
            setTimeout(() => this.execute({ ...input, instanceId }), 3000);
          } else {
            console.log(
              `⚠️ Instancia ${instanceId} deslogada. Requer novo QR Code.`
            );
            if (!resolved) {
              resolved = true;
              reject(new Error("Instancia deslogada. Requer novo QR Code."));
            }
          }
        }
      });

      sock.ev.on("creds.update", saveCreds);
    });
  }
}

export type CreateConnectionWppInput = {
  userId: string;
  instanceId?: string;
};

export type ConnectionWppOutput = {
  instanceId: string;
  qrCode?: string;
};
