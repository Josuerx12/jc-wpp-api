import { EventEmitter } from "events";

type InstanceChannels = {
  [instanceId: string]: EventEmitter;
};

export const instanceEmitters: InstanceChannels = {};

export function getEmitter(instanceId: string): EventEmitter {
  if (!instanceEmitters[instanceId]) {
    instanceEmitters[instanceId] = new EventEmitter();
  }
  return instanceEmitters[instanceId];
}
