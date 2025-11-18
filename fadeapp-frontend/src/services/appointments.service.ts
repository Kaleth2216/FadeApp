import { axiosInstance } from "../api/axios";

/**
 * ✅ Crear cita (usa axiosInstance y mantiene los logs)
 */
export async function createAppointment({
  token,
  barbershopId,
  barberId,
  serviceId,
  clientId, // opcional
  appointmentDate, // ISO string
}: {
  token: string;
  barbershopId?: number;
  barberId: number;
  serviceId: number;
  clientId?: number;
  appointmentDate: string;
}) {
  const url = "/appointments";

  const body: any = {
    date: appointmentDate,
    status: "PENDING",
    barber: { id: barberId },
    service: { id: serviceId },
  };
  if (barbershopId) body.barbershop = { id: barbershopId };
  if (clientId) body.client = { id: clientId };

  console.log("[createAppointment] URL:", axiosInstance.defaults.baseURL + url);
  console.log("[createAppointment] Headers: Authorization?", !!token);
  console.log("[createAppointment] Body:", JSON.stringify(body, null, 2));

  try {
    const { data, status } = await axiosInstance.post(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("[createAppointment] Status:", status);
    console.log("[createAppointment] Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error creando la cita";
    console.log("[createAppointment] Error:", message);
    throw new Error(message);
  }
}

/**
 * ✅ Obtener las citas del cliente autenticado
 */
export async function getMyAppointments(token: string) {
  const url = "/appointments/me";
  console.log("[getMyAppointments] URL:", axiosInstance.defaults.baseURL + url);

  try {
    const { data, status } = await axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("[getMyAppointments] Status:", status);
    console.log("[getMyAppointments] Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error obteniendo las citas";
    console.log("[getMyAppointments] Error:", message);
    throw new Error(message);
  }
}

/**
 * ✅ Cancelar (eliminar) cita
 */
export async function deleteAppointment(id: number, token: string) {
  const url = `/appointments/${id}`;
  console.log("[deleteAppointment] URL:", axiosInstance.defaults.baseURL + url);

  try {
    const { status } = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("[deleteAppointment] Status:", status);
    return true;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error eliminando la cita";
    console.log("[deleteAppointment] Error:", message);
    throw new Error(message);
  }
}
