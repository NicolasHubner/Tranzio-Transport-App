import { Company } from "./Company";
import { Issue } from "./Issue";

export interface Area {
  id: string;
  name: string;
  code: string;
  company_id: Company;
  issues: Issue;
}
