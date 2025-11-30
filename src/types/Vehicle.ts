export interface Vehicle {
  id: string;
  code: string;
  type?: "Wheelchair" | "Car" | "Truck" | null;
  status?: "Available" | "Busy" | "OutOfService" | "Cleanup" | null;
}
