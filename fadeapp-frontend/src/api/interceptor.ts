import axiosInstance from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PUBLIC_PATHS = ["/barbershops", "/auth", "/clients/register"];

axiosInstance.interceptors.request.use(async (config) => {
  const isPublic = PUBLIC_PATHS.some((p) => config.url?.includes(p));
  if (!isPublic) {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
