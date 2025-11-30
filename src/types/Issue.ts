import type { Coordinates } from "./Coordinates";
import type { Flight } from "./Flight";
import type { IssuePassenger } from "./IssuePassenger";
import type { POI } from "./POI";

export interface Issue {
  id: string;
  origin: POI;
  destiny: POI;
  requestedAt: string | null;
  flight: Flight;
  dtStart?: string | null;
  dtEnd?: string | null;
  createdAt: string;
  passengerName: string;
  shift: "T1" | "T2" | "T3" | "T4";
  status: "pending" | "in_attendance" | "attended";
  serviceType?: string;
  serviceTypes: Array<IssuePassenger["serviceType"]>;
  workerCoordinatesWhenRequested: Coordinates;
}
