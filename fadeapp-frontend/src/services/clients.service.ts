import axios from "../api/interceptor";
import { Client } from "../types/client.types";

const BASE_URL = "/clients";

export const getAllClients = async (): Promise<Client[]> => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getClientById = async (id: number): Promise<Client> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const updateClient = async (id: number, data: Partial<Client>): Promise<Client> => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
