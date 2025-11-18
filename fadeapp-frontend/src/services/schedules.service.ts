import axios from "../api/interceptor";
import { Schedule } from "../types/schedule.types";

const BASE_URL = "/schedules";

export const getSchedulesByBarber = async (barberId: number): Promise<Schedule[]> => {
  const res = await axios.get(`${BASE_URL}/barber/${barberId}`);
  return res.data;
};

export const createSchedule = async (data: Schedule): Promise<Schedule> => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

export const updateSchedule = async (id: number, data: Partial<Schedule>): Promise<Schedule> => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteSchedule = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
