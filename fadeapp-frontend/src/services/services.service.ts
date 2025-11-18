import { axiosInstance } from "../api/axios";

/**
 * ✅ Agregar servicio a una barbería (usa axiosInstance)
 */
export async function addService({
  token,
  barbershopId,
  name,
  price,
  duration,
}: {
  token: string;
  barbershopId: number;
  name: string;
  price: number;
  duration: number;
}) {
  const url = `/barbershops/${barbershopId}/services`;
  const body = { name, price, duration };

  console.log("[addService] URL:", axiosInstance.defaults.baseURL + url);
  console.log("[addService] Headers: Authorization?", !!token);
  console.log("[addService] Body:", JSON.stringify(body, null, 2));

  try {
    const { data, status } = await axiosInstance.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[addService] Status:", status);
    console.log("[addService] Response:", JSON.stringify(data, null, 2));

    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error al crear el servicio";

    console.log("[addService] Error:", message);
    throw new Error(message);
  }
}
