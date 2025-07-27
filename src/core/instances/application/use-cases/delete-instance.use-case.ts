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

    const instance = await this.repository.getBySessionId(sessionId);

    if (!instance) {
      throw new Error("Instância não encontrada.");
    }

    if (instance.userId != user.id && !user.isAdmin() && !user.isSuper()) {
      throw new AppError(
        "Você não tem permissão para executar essa ação.",
        401
      );
    }

    const authPath = instance.authPath;

    const { state } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    return new Promise<void>((resolve, reject) => {
      const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
      });

      let instanceDisconected = false;

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open" && !instanceDisconected) {
          console.log(`✅ Sessão ${input.sessionId} conectada com sucesso.`);

          try {
            await sock.logout();
            sock.end(null);

            if (fs.existsSync(authPath)) {
              fs.rmSync(authPath, { recursive: true, force: true });
              console.log(`🗑️ AuthPath removido: ${authPath}`);
            }

            await this.repository.delete(sessionId);

            console.log(`❌ Instância ${sessionId} removida com sucesso.`);

            resolve();
          } catch (err) {
            sock.end(null);
            reject(new Error(`Erro ao enviar mensagem: ${err}`));
          }
        }

        if (connection === "close" && !instanceDisconected) {
          const statusCode = (lastDisconnect?.error as Boom)?.output
            ?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            console.log(`🔄 Tentando reconectar sessão ${input.sessionId}...`);
            setTimeout(
              () => this.execute(input).then(resolve).catch(reject),
              3000
            );
          }
        }
      });
    });
  }
}

export type DeleteInstanceInput = {
  sessionId: string;
};
