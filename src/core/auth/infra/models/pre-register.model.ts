import { model, Schema } from "mongoose";

export interface IPreRegister extends Document {
  preRegisterId: string;
  name: string;
  document: string;
  email: string;
  phone: string;
}

const PreRegisterSchema = new Schema(
  {
    preRegisterId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    document: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const PreRegisterModel = model("PreRegister", PreRegisterSchema);
