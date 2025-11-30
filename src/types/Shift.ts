import { Airport } from "./Airport";
import { Company } from "./Company";

export interface Shift {
  id: string;
  company: Company;
  airport: Airport;
  sequence: number;
  startAt: string;
  endAt: string;
}