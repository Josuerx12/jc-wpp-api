import { model, Schema } from "mongoose";

export interface IUserSecret extends Document {
  userSecretId: string;
  userId: string;
  secret: string;
}

const UserSecretSchema = new Schema(
  {
    userSecretId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserSecretModel = model("UserSecret", UserSecretSchema);
