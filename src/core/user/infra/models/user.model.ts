import { model, Schema } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
}

const UserSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    name: { type: String },
    cpf: { type: String },
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
