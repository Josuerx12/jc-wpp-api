import { model, Schema } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  document: string;
  email: string;
  password: string;
  code?: string;
}

const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    document: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    code: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
