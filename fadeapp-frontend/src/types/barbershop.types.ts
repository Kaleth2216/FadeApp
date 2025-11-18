// src/types/barbershop.types.ts
export interface Barbershop {
  id: number;
  name: string;
  address: string;
  city: string;
  email?: string;
  password?: string;
  openingTime?: string;
  closingTime?: string;
  imageUrl?: string;
  status?: boolean;
  role?: string;
  rating?: number; // campo visual (puedes calcularlo si luego hay reseñas)
}
