import { MaterialRequest } from "./MaterialRequest";
import { Product } from "./Product";

export interface Device {
  id: string;
  material_request: MaterialRequest;
  product: Product;
  internalCode: string;
  productDescription: string;
  qtd: number;
}