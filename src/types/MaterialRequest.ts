import { Department } from "./Department";
import { Product } from "./Product";
import { PurchaseRequest } from "./PurchaseRequest";

export type MaterialRequestStatus =
  | "pending"
  | "inOpen"
  | "serviced"
  | "delivered"
  | "rejected";

export type MaterialRequestPriority = "important" | "critic" | "routine";

export interface MaterialRequest {
  id: string;
  department_id: Department;
  product_ids: Product;
  internalCode: string;
  productDescription: string;
  requestCode: string;
  ptm: string;
  qtd: number;
  codSection: string;
  codLocal: string;
  codWarehouse: number;
  status: MaterialRequestStatus;
  priority: MaterialRequestPriority;
  approver: string;
  purchase_request: PurchaseRequest;
}
