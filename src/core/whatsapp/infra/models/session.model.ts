import { model, Schema } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  userId: string;
  authPath: string;
}

const SessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    authPath: { type: String },
  },
  { timestamps: true }
);

export const SessionModel = model("Session", SessionSchema);
