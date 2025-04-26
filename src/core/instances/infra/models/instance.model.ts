import { model, Schema } from "mongoose";

export interface IInstance extends Document {
  instanceId: string;
  userId: string;
  authPath: string;
}

const InstanceSchema = new Schema(
  {
    instanceId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    authPath: { type: String },
  },
  { timestamps: true }
);

export const InstanceModel = model("Instance", InstanceSchema);
