import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { registerClient, registerBarbershop } from "../services/auth.service";
import colors from "../theme/colors";
import typography from "../theme/typography";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }: any) {
  const [role, setRole] = useState<"client" | "barbershop">("client");

  // Campos comunes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cliente
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  // Barbería
  const [barberName, setBarberName] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async () => {
    if (role === "client") {
      if (!firstName || !lastName || !city || !email || !password) {
        Alert.alert("Campos requeridos", "Completa todos los campos obligatorios.");
        return;
      }
    } else {
      if (!barberName || !address || !city || !email || !password) {
        Alert.alert("Campos requeridos", "Completa todos los campos obligatorios.");
        return;
      }
    }

    try {
      setLoading(true);
      if (role === "client") {
        await registerClient({ firstName, lastName, city, email, password, phone });
      } else {
        await registerBarbershop({
          name: barberName,
          address,
          city,
          email,
          password,
        });
      }
      Alert.alert("Registro exitoso", "Ya puedes iniciar sesión.");
      navigation.navigate("Login");
    } catch (e: any) {
      console.log("REGISTER ERROR:", e?.response?.status, e?.response?.data || e?.message);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Ocurrió un error durante el registro.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.card}>
        <Text style={[typography.title, styles.title]}>
          Registro de {role === "client" ? "cliente" : "barbería"}
        </Text>

        {/* Selector de rol */}
        <Text style={styles.label}>Rol</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={role} onValueChange={(value) => setRole(value)}>
            <Picker.Item label="Cliente" value="client" />
            <Picker.Item label="Barbería" value="barbershop" />
          </Picker>
        </View>

        {role === "client" ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Ciudad"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono (opcional)"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la barbería"
              value={barberName}
              onChangeText={setBarberName}
            />
            <TextInput
              style={styles.input}
              placeholder="Ciudad"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.input}
              placeholder="Dirección de la barbería"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </>
        )}

        {/* Contraseña */}
        <View style={styles.passWrap}>
          <TextInput
            style={[styles.input, { paddingRight: 44 }]}
            placeholder="Contraseña"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? "eye-off" : "eye"} size={22} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Botón principal */}
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "REGISTRANDO..." : "REGISTRARME"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 14 }}>
          <Text style={styles.linkText}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: colors.backgroundSoft,
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#FFFDF9",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  title: { textAlign: "center", marginBottom: 18, color: colors.text },
  label: { color: colors.text, fontWeight: "600", marginBottom: 6 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
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
