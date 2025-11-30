import { Event } from "./Event";

export type DeviceType = "Phone" | "Cam" | "Tablet";

export interface Airport {
  id: string;
  type: DeviceType;
  macAdress: string;
  serialNumber: string;
  model: string;
  events: Event;
}