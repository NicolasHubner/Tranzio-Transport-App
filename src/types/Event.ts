import { Airport } from "./Airport";
import { Device } from "./Device";
import { Issue } from "./Issue";

export interface Event {
  id: string;
  latitude: string;
  longitude: string;
  airportId: Airport;
  deviceId: Device;
  issueId: Issue;
}