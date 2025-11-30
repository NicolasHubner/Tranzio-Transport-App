export interface Team {
  name?: string | null;
  level?: "Leader" | "Operator" | null;
  statusPress?: boolean | null;
  shift: "T1" | "T2" | "T3" | "T4";
}
