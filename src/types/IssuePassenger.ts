export interface IssuePassenger {
  name?: string ;
  serviceType:
    | "WCHR"
    | "WCHS"
    | "WCHC"
    | "WCBW"
    | "WCBD"
    | "WCLB"
    | "DPNA"
    | "WCBB"
    | "WCPW"
    //SEM QR
    | "WCMP"
    | "MAAS"
    | "UMNR"
    | "TEEN";
}
