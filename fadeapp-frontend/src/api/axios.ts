import axios from "axios";

// 🔹 Dirección base del backend (usa la IP de tu PC)
const baseURL = "http://192.168.2.4:8080/api";

// 🔹 Configuración de tiempo de espera y modo mock
const timeout = Number(process.env.EXPO_PUBLIC_API_TIMEOUT || 10000);
const mockEnabled =
  String(process.env.EXPO_PUBLIC_MOCK_API || "false").toLowerCase() === "true";

// ✅ Crear instancia principal
export const axiosInstance = axios.create({
  baseURL,
  timeout,
});

// ✅ Interceptor de solicitud (opcional, pero útil)
axiosInstance.interceptors.request.use(
  (config) => {
    // Si el token se guarda globalmente, podría inyectarse aquí:
    // const token = globalThis.authToken;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor de respuesta (logs y manejo básico de errores)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(
        `[AxiosError] ${error.response.status}:`,
        error.response.data || error.message
      );
    } else {
      console.log("[AxiosError] No response:", error.message);
    }
    return Promise.reject(error);
  }
);

// Export default por compatibilidad
export default axiosInstance;
