export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  createdAt?: string; // ISO LocalDateTime
}
