import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import fs from "fs";
import { IInstanceRepository } from "../../domain/contracts/instance.interface";
import { Boom } from "@hapi/boom";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "baileys";

export class DeleteInstanceUseCase
  implements UseCase<DeleteInstanceInput, void>
{
  constructor(private readonly repository: IInstanceRepository) {}

  async execute(input: DeleteInstanceInput): Promise<void> {
    const user = authStorage.get().user();
    const { sessionId } = input;

    let isConnected = false;
    let isLoggedOut = false;

    const instance = await this.repository.getBySessionId(sessionId);
    if (!instance) throw new Error("Instância não encontrada.");

    if (instance.userId !== user.id && !user.isAdmin() && !user.isSuper()) {
      throw new AppError(
        "Você não tem permissão para executar essa ação.",
        401
      );
    }

    const authPath = instance.authPath;

    if (fs.existsSync(authPath)) {
      try {
        const { state } = await useMultiFileAuthState(authPath);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
          version,
          auth: state,
          printQRInTerminal: false,
        });

        let attempts = 0;
        const maxAttempts = 8;

        sock.ev.on("connection.update", async (update) => {
          const { connection, lastDisconnect } = update;

          if (connection === "open" && !isLoggedOut) {
            try {
              await sock.logout();
              sock.end(null);
              isLoggedOut = true;
              console.log(
                `❌ Instância ${sessionId} desconectada com sucesso.`
              );
            } catch (err) {
              console.error("Erro ao deslogar:", err);
            }
          }

          if (connection === "close" && !isConnected) {
            const statusCode = (lastDisconnect?.error as Boom)?.output
              ?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect && attempts < maxAttempts) {
              attempts++;
              console.log(
                `🔄 Tentativa ${attempts} de reconexão para ${sessionId}...`
              );
              setTimeout(() => {
                sock.end(null);
              }, 3000);
            } else {
              isConnected = true;
            }
          }
        });
      } catch (error) {
        console.error("Erro ao tentar desconectar:", error);
      }

      fs.rmSync(authPath, { recursive: true, force: true });
      console.log(`🗑️ AuthPath removido: ${authPath}`);
    }

    await this.repository.delete(sessionId);
  }
}

export type DeleteInstanceInput = {
  sessionId: string;
};
