import { Company } from "./Company";

export interface Department {
  id: string;
  name: string;
  company: Company;
  code: string;
}
