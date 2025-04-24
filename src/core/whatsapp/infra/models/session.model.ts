import { model, Schema } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  name: string;
  cpf: string;
  authPath: string;
}

const SessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    name: { type: String },
    cpf: { type: String },
    authPath: { type: String },
  },
  { timestamps: true }
);

export const SessionModel = model("Session", SessionSchema);
