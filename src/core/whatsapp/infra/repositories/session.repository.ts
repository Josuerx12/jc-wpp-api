import { ISessionRepository } from "../../domain/contracts/session.interface";
import { SessionModel } from "../models/session.model";

export class SessionRepository implements ISessionRepository {
  private sessionModel = SessionModel;

  async getById(id: string): Promise<any> {
    const session = await this.sessionModel.findOne({
      sessionId: id,
    });

    return session;
  }

  async getAll(): Promise<any[]> {
    const sessions = await this.sessionModel.find();

    return sessions;
  }

  async createOrUpdate(entity: any): Promise<any> {
    const session = await this.sessionModel.findOneAndUpdate(
      { sessionId: entity.sessionId },
      {
        userId: entity.userId,
        sessionId: entity.sessionId,
        authPath: entity.authPath,
      },
      { upsert: true, new: true }
    );

    return session;
  }
}
