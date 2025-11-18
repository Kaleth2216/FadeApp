import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { login as loginService } from "../services/auth.service";
import { AuthContext } from "../auth/AuthContext";
import colors from "../theme/colors";
import typography from "../theme/typography";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }: any) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await loginService(email, password);
      await login(res.token, res.role, res.userId);
    } catch {
      Alert.alert("Error", "Credenciales inválidas o servidor no disponible");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={[typography.title, styles.title]}>FadeApp</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passWrap}>
          <TextInput
            style={[styles.input, { paddingRight: 44 }]}
            placeholder="Contraseña"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass((s) => !s)}>
            <Ionicons name={showPass ? "eye-off" : "eye"} size={22} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 14 }}>
          <Text style={styles.linkText}>¿No tienes cuenta? Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundSoft, paddingHorizontal: 20, justifyContent: "center" },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  title: { textAlign: "center", marginBottom: 18, color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
  },
  passWrap: { position: "relative" },
  eyeBtn: { position: "absolute", right: 12, top: 16 },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", letterSpacing: 0.5 },
  linkText: { color: colors.accent, textAlign: "center", fontWeight: "600" },
});
