import type { Issue } from "./Issue";
import type { Vehicle } from "./Vehicle";

export interface Checkin {
    dtStart: string;
    dtEnd?: string | null;
    description?: string | null;
    vehicle: Vehicle;
    issue: Issue;
}
