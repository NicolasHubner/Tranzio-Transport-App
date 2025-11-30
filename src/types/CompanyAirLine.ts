import { AirLine } from "./AirLine";
import { Company } from "./Company";

export interface CompanyAirLine {
  id: string;
  company: Company;
  airline: AirLine;
}
