import { Client } from "./client.types";
import { Barber } from "./barber.types";
import { Service } from "./service.types";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface Appointment {
  id: number;
  client: Client;
  barber: Barber;
  service: Service;
  appointmentDate: string; // ISO LocalDateTime e.g. "2025-11-08T14:30:00"
  status: AppointmentStatus;
  notes?: string;
}
