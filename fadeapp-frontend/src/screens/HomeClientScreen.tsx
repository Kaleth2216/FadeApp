// ✅ src/screens/HomeClientScreen.tsx — abre el popup de citas sin navegar
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native"; // ✅ agregado
import { getBarbershopsByCity } from "../services/barbershops.service";
import colors from "../theme/colors";
import typography from "../theme/typography";
import { useAuth } from "../auth/useAuth";
import { Barbershop } from "../types/barbershop.types";
import AppointmentsModal from "./AppointmentsModal"; // ✅ corregido: ahora busca en screens

const PALETTE = {
  cream: "#F7EFE7",
  creamLight: "#FBF6F1",
  cardBorder: "#EDEAE6",
  mutedText: "#6B7280",
  star: "#F59E0B",
};

export default function HomeClientScreen({ navigation }: any) {
  const route = useRoute<any>(); // ✅ usado para recibir parámetros
  const { logout } = useAuth();
  const [city, setCity] = useState<string>("Neiva");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false); // ⬅️ estado del modal

  // ✅ Detectar si venimos de "Ver mis citas" y abrir popup automáticamente
  useEffect(() => {
    if (route.params?.openAppointments) {
      console.log("📅 Abriendo automáticamente modal de citas...");
      setAppointmentsOpen(true);
      navigation.setParams({ openAppointments: false }); // limpia el flag
    }
  }, [route.params]);

  // 🔹 Cargar barberías por ciudad
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        console.log("🌍 Iniciando carga de barberías...");
        console.log("📍 Ciudad actual:", city);

        const data = await getBarbershopsByCity(city);
        console.log("📦 Barberías obtenidas del backend:", data);



        setBarbershops(data || []);
      } catch (e) {
        console.error("❌ Error al cargar barberías:", e);
        setBarbershops([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [city]);

  // 🔍 Filtro de búsqueda
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return barbershops;
    return barbershops.filter((b) => b.name?.toLowerCase().includes(q));
  }, [search, barbershops]);

  // 🔐 Cerrar sesión
  const handleLogout = async () => {
    try {
      if (typeof logout === "function") await logout();
      else navigation.navigate("Login");
    } catch {
      navigation.navigate("Login");
    }
  };

  // 🔄 Cambiar ciudad (demo)
  const onCityPress = () => {
    setCity((prev) => (prev === "Neiva" ? "Bogotá" : "Neiva"));
  };

  // 🧩 Render de barbería
  const renderItem = ({ item }: { item: Barbershop }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("BarbershopDetail", { id: item.id })}
    >
      <View style={styles.cardLeft}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Ionicons name="image-outline" size={28} color={PALETTE.mutedText} />
          </View>
        )}
      </View>

      <View style={styles.cardRight}>
        <View style={styles.cardRowTop}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {item.name}
          </Text>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={14} color={PALETTE.star} />
            <Text style={styles.ratingText}>
              {typeof item.rating === "number" ? item.rating.toFixed(1) : "4.5"}
            </Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={PALETTE.mutedText} />
          <Text numberOfLines={1} style={styles.addressText}>
            {item.address || "Dirección no disponible"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 🧠 Render principal
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.9}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Buscador */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={PALETTE.mutedText} style={{ marginLeft: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar barberías..."
            placeholderTextColor={PALETTE.mutedText}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>

        {/* Selector de ciudad */}
        <TouchableOpacity style={styles.cityPicker} onPress={onCityPress} activeOpacity={0.9}>
          <Text style={styles.cityText}>{city}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.text} />
        </TouchableOpacity>

        {/* Botón “Mis citas” → abre modal */}
        <TouchableOpacity
          style={styles.myAppointmentsBtn}
          onPress={() => setAppointmentsOpen(true)}
          activeOpacity={0.9}
        >
          <Ionicons name="calendar" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.myAppointmentsText}>Mis citas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de barberías */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>
          Barberías en {city.split(" - ")[0]} ({filtered.length})
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay barberías disponibles.</Text>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>

      {/* 🧩 Modal de citas (popup) */}
      <AppointmentsModal visible={appointmentsOpen} onClose={() => setAppointmentsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETTE.creamLight },
  header: {
    backgroundColor: PALETTE.cream,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  logoutBtn: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  logoutText: { color: "#fff", fontWeight: "700" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    paddingVertical: 10,
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: { flex: 1, paddingHorizontal: 10, color: colors.text },
  cityPicker: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cityText: { color: colors.text, marginRight: 8, fontWeight: "600" },
  myAppointmentsBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  myAppointmentsText: { color: "#fff", fontWeight: "700" },
  listContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: {
    ...typography?.subtitle,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  cardLeft: { marginRight: 12 },
  cardImage: { width: 54, height: 54, borderRadius: 8 },
  cardImagePlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  cardRight: { flex: 1 },
  cardRowTop: { flexDirection: "row", alignItems: "center" },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginRight: 8,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  ratingText: { marginLeft: 4, fontWeight: "700", color: PALETTE.star },
  addressRow: { marginTop: 6, flexDirection: "row", alignItems: "center" },
  addressText: { marginLeft: 4, color: PALETTE.mutedText },
  emptyText: { marginTop: 8, color: PALETTE.mutedText },
});
