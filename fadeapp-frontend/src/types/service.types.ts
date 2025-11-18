import { Barbershop } from "./barbershop.types";

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  barbershop: Barbershop;
  active: boolean;
}
