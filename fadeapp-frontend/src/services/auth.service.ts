import axios from "../api/interceptor";

export const login = async (email: string, password: string) => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
};

export const registerClient = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const res = await axios.post("/auth/register/client", data);
  return res.data;
};
export const registerBarbershop = async (data: {
  name: string;
  address: string;
  city: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post("/auth/register/barbershop", data);
  return res.data;
};


