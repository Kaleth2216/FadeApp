import { Barber } from "./barber.types";

export interface Schedule {
  id: number;
  barber: Barber;
  dayOfWeek: string; // e.g. "MONDAY", "TUESDAY"
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  active: boolean;
}

