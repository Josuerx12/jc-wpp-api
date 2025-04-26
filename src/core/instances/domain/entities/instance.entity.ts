import { IInstance } from "../../infra/models/instance.model";

export class InstanceEntity {
  instanceId: string;
  userId: string;
  authPath: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    props: Partial<IInstance> & { createdAt?: Date; updatedAt?: Date }
  ) {
    this.userId = props.userId;
    this.instanceId = props.instanceId;
    this.authPath = props.authPath;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}
