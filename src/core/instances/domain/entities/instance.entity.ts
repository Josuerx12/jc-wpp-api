import { v4 } from "uuid";

type EntityProps = {
  id?: string;
  userId: string;
  sessionId: string;
  authPath: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class InstanceEntity {
  id: string;
  userId: string;
  authPath: string;
  sessionId: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: EntityProps) {
    this.id = props.id || v4();
    this.userId = props.userId;
    this.sessionId = props.sessionId;
    this.authPath = props.authPath;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}
