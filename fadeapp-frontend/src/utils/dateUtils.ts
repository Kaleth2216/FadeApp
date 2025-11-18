import dayjs from "dayjs";

/**
 * Convierte un objeto Date en formato ISO compatible con LocalDateTime de Spring Boot.
 * Ejemplo: "2025-11-08T15:30:00"
 */
export const toISO = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
};

/**
 * Convierte un string ISO a formato legible.
 * Ejemplo: "2025-11-08T15:30:00" → "08/11/2025 15:30"
 */
export const formatDateTime = (iso: string): string => {
  return dayjs(iso).format("DD/MM/YYYY HH:mm");
};
