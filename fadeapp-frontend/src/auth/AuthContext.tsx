import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// =============================
// Tipado del contexto
// =============================
interface AuthContextType {
  token: string | null;
  role: string | null;
  userId: number | null;
  login: (token: string, role: string, userId: number) => Promise<void>;
  logout: () => Promise<void>;
}

// =============================
// Creación del contexto
// =============================
export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  userId: null,
  login: async () => {},
  logout: async () => {},
});

// =============================
// Proveedor global de autenticación
// =============================
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // 🔹 Cargar datos almacenados al iniciar la app
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.multiGet(["token", "role", "userId"]);
        const t = stored[0][1];
        const r = stored[1][1];
        const id = stored[2][1];
        if (t) setToken(t);
        if (r) setRole(r);
        if (id) setUserId(Number(id));
      } catch (err) {
        console.log("[AuthContext] Error cargando sesión:", err);
      }
    })();
  }, []);

  // 🔹 Guardar datos tras login
  const login = async (tk: string, rl: string, id: number) => {
    try {
      await AsyncStorage.multiSet([
        ["token", tk],
        ["role", rl],
        ["userId", id.toString()],
      ]);
      setToken(tk);
      setRole(rl);
      setUserId(id);
      console.log("[AuthContext] Sesión guardada:", { rl, id });
    } catch (err) {
      console.log("[AuthContext] Error al guardar sesión:", err);
    }
  };

  // 🔹 Eliminar datos al cerrar sesión
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "role", "userId"]);
      setToken(null);
      setRole(null);
      setUserId(null);
      console.log("[AuthContext] Sesión cerrada");
    } catch (err) {
      console.log("[AuthContext] Error al cerrar sesión:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
