import { model, Schema } from "mongoose";

export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
  SUPER = "super",
}

export interface IUser extends Document {
  userId: string;
  name: string;
  document: string;
  email: string;
  password: string;
  isTempPass: boolean;
  code?: string;
  role?: UserRoles;
}

const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    document: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isTempPass: { type: Boolean, required: true, default: false },
    code: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      required: true,
      default: UserRoles.USER,
    },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
