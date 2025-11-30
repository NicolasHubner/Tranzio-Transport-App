import { Airport } from "./Airport";

export interface Terminal {
  id: string;
  number: number;
  name: string;
  airport_id: Airport;
}
