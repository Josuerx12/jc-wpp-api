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
import { instanceEvents } from "../../../../shared/infra/events/sse-event.emitter";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { IInstanceRepository } from "../../domain/contracts/instance.interface";
import { InstanceEntity } from "../../domain/entities/instance.entity";

export class ConnectInstanceUseCase
  implements UseCase<ConnectConnectionWppInput, ConnectionWppOutput>
{
  constructor(private readonly repository: IInstanceRepository) {}

  async execute(
    input: ConnectConnectionWppInput
  ): Promise<ConnectionWppOutput> {
    const sessionId = input.sessionId ?? v4();
    const { id } = authStorage.get().user();

    const instance = await this.repository.getBySessionId(sessionId);

    let authPath: string;

    if (!instance) {
      authPath = `auth/${sessionId}`;
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
      let connected = false;

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && !resolved) {
          try {
            const qrCodeBase64 = await QRCode.toDataURL(qr);
            resolved = true;
            resolve({
              qrCode: qrCodeBase64,
              sessionId,
              message:
                "Foi criada uma nova conexão para a instancia, conecte-se via qr-code.",
            });
          } catch (error) {
            reject(new Error("Erro ao gerar QR Code"));
          }
        }

        if (connection === "open" && !resolved) {
          console.log(`✅ Conexão estabelecida para instancia ${sessionId}`);
          try {
            if (!instance) {
              await this.repository.createOrUpdate(
                new InstanceEntity({ userId: id, sessionId, authPath })
              );

              instanceEvents.emit("instance_connected", { sessionId });
            } else {
              await this.repository.createOrUpdate({
                ...instance,
              });
            }

            // Obter o jid do usuário conectado
            const profile = sock.user;

            // Obter informações do perfil
            const bussinessProfile =
              profile.id && (await sock.getBusinessProfile(profile.id));

            // Obter URL do avatar (foto de perfil)
            const avatarUrl =
              profile.id &&
              (await sock.profilePictureUrl(profile.id, "preview"));

            connected = true;

            resolve({
              sessionId,
              message: "Instancia já conectada!",
              profile,
              bussinessProfile,
              avatarUrl,
            });
            if (connected) {
              setTimeout(() => {
                sock.end(null);
              }, 3000);
            }
          } catch (error) {
            console.log(error);
            reject(new Error("Erro ao salvar instancia no banco de dados"));
          }
        }

        if (connection === "close" && !connected) {
          const statusCode = (lastDisconnect.error as Boom)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            console.log(`🔄 Tentando reconectar instancia ${sessionId}...`);
            setTimeout(() => this.execute({ ...input, sessionId }), 3000);
          } else {
            console.log(
              `⚠️ Instancia ${sessionId} deslogada. Recriando sessão...`
            );

            try {
              fs.rmSync(authPath, { recursive: true, force: true });
              console.log(`🗑️ Sessão removida para ${sessionId}`);
            } catch (err) {
              console.error("Erro ao remover authPath:", err);
            }

            this.execute({ sessionId }).then(resolve).catch(reject);

            resolved = true;
          }
        }
      });

      sock.ev.on("creds.update", saveCreds);
    });
  }
}

export type ConnectConnectionWppInput = {
  sessionId?: string;
};

export type ConnectionWppOutput = {
  sessionId: string;
  message: string;
  qrCode?: string;
  profile?: any;
  bussinessProfile?: any;
  avatarUrl?: string;
};
