import axios from "../api/interceptor";
import { Barbershop } from "../types/barbershop.types";

const BASE_URL = "/barbershops";

/**
 * 🔹 Normaliza "Neiva - Huila" → "Neiva"
 */
function normalizeCity(input?: string): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  return trimmed.includes(" - ") ? trimmed.split(" - ")[0].trim() : trimmed;
}

/**
 * 🔹 Obtiene todas las barberías sin filtro.
 */
export const getAllBarbershops = async (): Promise<Barbershop[]> => {
  try {
    const res = await axios.get(BASE_URL);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.warn("⚠️ Error al obtener todas las barberías:", err);
    return [];
  }
};

/**
 * 🔹 Filtra barberías por ciudad, evitando enviar parámetros vacíos.
 */
export const getBarbershopsByCity = async (city: string): Promise<Barbershop[]> => {
  const cityParam = normalizeCity(city);
  const params: any = {};
  if (cityParam) params.city = cityParam; // ← evita enviar city=""
  try {
    console.log("📡 Solicitando barberías para ciudad:", cityParam);
    const res = await axios.get(BASE_URL, { params });
    const data = res.data;

    if (Array.isArray(data) && data.length > 0) {
      console.log(`✅ ${data.length} barberías encontradas para ${cityParam}`);
      return data;
    } else {
      console.warn(`⚠️ No se encontraron barberías para ${cityParam}`);
      return [];
    }
  } catch (err) {
    console.warn("⚠️ Error al obtener barberías por ciudad:", err);
    return [];
  }
};

/**
 * 🔹 Búsqueda avanzada con fallback.
 */
export const searchBarbershops = async (q: string, city?: string): Promise<Barbershop[]> => {
  const params: Record<string, string> = {};
  const query = q?.trim();
  const cityParam = normalizeCity(city);

  if (query) params.q = query;
  if (cityParam) params.city = cityParam;

  try {
    const res = await axios.get(`${BASE_URL}/search`, { params });
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    try {
      const res = await axios.get(BASE_URL, { params });
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.warn("⚠️ Falla total en búsqueda de barberías:", err);
      return [];
    }
  }
};

/**
 * 🔹 Obtiene una barbería por ID.
 */
export const getBarbershopById = async (id: number): Promise<Barbershop> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

/**
 * 🔹 Crea una nueva barbería.
 */
export const createBarbershop = async (data: Barbershop): Promise<Barbershop> => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

/**
 * 🔹 Actualiza una barbería existente.
 */
export const updateBarbershop = async (
  id: number,
  data: Partial<Barbershop>
): Promise<Barbershop> => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

/**
 * 🔹 Elimina una barbería.
 */
export const deleteBarbershop = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
