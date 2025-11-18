import axios from "../api/interceptor";
import { Barber } from "../types/barber.types";

const BASE_URL = "/barbers";

export const getAllBarbers = async (): Promise<Barber[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getBarberById = async (id: number): Promise<Barber> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const getBarbersByBarbershop = async (barbershopId: number): Promise<Barber[]> => {
  const res = await axios.get(`${BASE_URL}/barbershop/${barbershopId}`);
  return res.data;
};

export const createBarber = async (data: Barber): Promise<Barber> => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

export const updateBarber = async (id: number, data: Partial<Barber>): Promise<Barber> => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteBarber = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
