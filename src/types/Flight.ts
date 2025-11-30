export interface Flight {
  id: string;
  STA: string;
  flightNumber: string;
  actionType: "Arrival" | "Match";
  route: "Local" | "Connection";
  flightOrigin: string;
  flightDestiny: string;
  isInternational: boolean | null;
  flightDate: string;
  prefix: string;
}
