import { Barbershop } from "./barbershop.types";

export interface Barber {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialty?: string;
  active: boolean;
  barbershop: Barbershop;
}

