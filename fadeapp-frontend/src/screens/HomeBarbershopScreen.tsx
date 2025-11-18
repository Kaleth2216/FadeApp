// ✅ src/screens/HomeBarbershopScreen.tsx — con “Citas” y cierre de sesión simple vía AuthContext (sin perder funcionalidades)
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Animated,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../auth/useAuth";
import colors from "../theme/colors";
import typography from "../theme/typography";
import { axiosInstance } from "../api/axios";

type Props = {
  navigation: any;
  route?: { params?: { token?: string; barbershopId?: number } };
  token?: string;
  barbershopId?: number;
  onLogout?: () => Promise<void> | void;
};

type Barbershop = {
  id: number;
  name: string;
  city?: string;
  tagline?: string;
};

type Service = {
  id: number;
  name: string;
  price: number;
  duration: number;
  status?: string;
  barbershopId?: number;
};

type Barber = {
  id: number;
  name: string;
  phone?: string;
  status?: string | boolean;
  barbershopId?: number;
};

type ClientMini = {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
};

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | string;

type Appointment = {
  id: number;
  date: string; // ISO
  status: AppointmentStatus;
  service?: Partial<Service>;
  barber?: Partial<Barber>;
  client?: ClientMini;
  barbershop?: Partial<Barbershop>;
};

export default function HomeBarbershopScreen(props: Props) {
  const { logout } = useAuth();
  const navigation = props.navigation;
  const token = props.token ?? props.route?.params?.token ?? "";
  const barbershopId = props.barbershopId ?? props.route?.params?.barbershopId ?? 1;

  const [loading, setLoading] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const [addingService, setAddingService] = useState(false);
  const [addingBarber, setAddingBarber] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("");

  const [newBarberName, setNewBarberName] = useState("");
  const [newBarberPhone, setNewBarberPhone] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const authHeader = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const money = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n || 0);

  const formatDateTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // ============================
  // DATA (Axios)
  // ============================
  const fetchBarbershop = useCallback(async () => {
    try {
      const { data, status } = await axiosInstance.get(`/barbershops/${barbershopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[fetchBarbershop] Status:", status);
      setBarbershop(data);
    } catch (e: any) {
      console.log("[Barbershop] error:", e.response?.data || e.message);
    }
  }, [token, barbershopId]);

  const fetchServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      const { data, status } = await axiosInstance.get(`/barbershops/${barbershopId}/services/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[fetchServices] Status:", status);
      setServices(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.log("[Services] error:", e.response?.data || e.message);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, [token, barbershopId]);

  const fetchBarbers = useCallback(async () => {
    setLoadingBarbers(true);
    try {
      const { data, status } = await axiosInstance.get(`/barbershops/${barbershopId}/barbers/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[fetchBarbers] Status:", status);
      setBarbers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.log("[Barbers] error:", e.response?.data || e.message);
      setBarbers([]);
    } finally {
      setLoadingBarbers(false);
    }
  }, [token, barbershopId]);

  const fetchPendingAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const urls = [
        `/barbershops/${barbershopId}/appointments?status=PENDING`,
        `/appointments?barbershopId=${barbershopId}&status=PENDING`,
        `/appointments/pending?barbershopId=${barbershopId}`,
      ];

      let list: any[] = [];
      for (const path of urls) {
        try {
          const res = await axiosInstance.get(path, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status >= 200 && res.status < 300) {
            const json = res.data;
            list = Array.isArray(json) ? json : Array.isArray(json?.content) ? json.content : [];
            break;
          }
        } catch {
          // probar siguiente url
        }
      }
      setAppointments(Array.isArray(list) ? list : []);
    } catch (e: any) {
      console.log("[Appointments] error:", e.response?.data || e.message);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }, [token, barbershopId]);

  const hardReload = useCallback(async () => {
    await Promise.all([fetchBarbershop(), fetchServices(), fetchBarbers(), fetchPendingAppointments()]);
  }, [fetchBarbershop, fetchServices, fetchBarbers, fetchPendingAppointments]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await hardReload();
      if (mounted) {
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [hardReload]);

  const onPullRefresh = useCallback(async () => {
    setRefreshing(true);
    await hardReload();
    setRefreshing(false);
  }, [hardReload]);

  // ============================
  // ACCIONES (Axios)
  // ============================
  const handleAddService = async () => {
    if (!newServiceName || !newServicePrice || !newServiceDuration) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos.");
      return;
    }

    try {
      const body = {
        name: newServiceName,
        price: parseFloat(newServicePrice),
        duration: parseInt(newServiceDuration),
      };

      const { data, status } = await axiosInstance.post(
        `/barbershops/${barbershopId}/services`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("[handleAddService] Status:", status);
      setServices((prev) => [...prev, data]);
      setAddingService(false);
      setNewServiceName("");
      setNewServicePrice("");
      setNewServiceDuration("");
      Alert.alert("Éxito", "Servicio agregado correctamente.");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      Alert.alert("Error", msg);
    }
  };

  const handleAddBarber = async () => {
    if (!newBarberName || !newBarberPhone) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos.");
      return;
    }

    try {
      const body = {
        name: newBarberName,
        phone: newBarberPhone,
        status: true,
      };

      const { data, status } = await axiosInstance.post(
        `/barbershops/${barbershopId}/barbers`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("[handleAddBarber] Status:", status);
      setBarbers((prev) => [...prev, data]);
      setAddingBarber(false);
      setNewBarberName("");
      setNewBarberPhone("");
      Alert.alert("Éxito", "Barbero agregado correctamente.");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      Alert.alert("Error", msg);
    }
  };

  const handleDeleteService = (serviceId: number, name: string) => {
    Alert.alert("Confirmar eliminación", `¿Deseas eliminar el servicio "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const { status } = await axiosInstance.delete(
              `/barbershops/services/${serviceId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("[handleDeleteService] Status:", status);
            setServices((prev) => prev.filter((s) => s.id !== serviceId));
            Alert.alert("Eliminado", `El servicio "${name}" fue eliminado correctamente.`);
          } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message;
            Alert.alert("Error", msg);
          }
        },
      },
    ]);
  };

  const handleDeleteBarber = (barberId: number, name: string) => {
    Alert.alert("Confirmar eliminación", `¿Deseas eliminar al barbero "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const { status } = await axiosInstance.delete(
              `/barbershops/barbers/${barberId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("[handleDeleteBarber] Status:", status);
            setBarbers((prev) => prev.filter((b) => b.id !== barberId));
            Alert.alert("Eliminado", `El barbero "${name}" fue eliminado correctamente.`);
          } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message;
            Alert.alert("Error", msg || "No se pudo eliminar el barbero.");
          }
        },
      },
    ]);
  };

  // ============================
  // CERRAR SESIÓN
  // ============================
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (e) {
      console.log("[logout] error:", e);
    } finally {
      try {
        await Promise.resolve(props.onLogout?.());
      } catch (e) {
        console.log("[logout] onLogout extra error:", e);
      }
    }
  }, [logout, props.onLogout]);

  // ============================
  // UI
  // ============================
  const Header = () => (
    <View style={styles.header}>
      {/* Fila superior: título + cerrar sesión */}
      <View style={styles.headerTopRow}>
        <Text style={[typography.title, { color: "#fff", flex: 1 }]} numberOfLines={1}>
          {barbershop?.name ?? "Mi Barbería"}
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
          accessibilityLabel="Cerrar sesión"
          accessibilityHint="Cierra la sesión actual y vuelve a la pantalla de inicio de sesión"
        >
          <Ionicons name="log-out-outline" size={16} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Chips informativos */}
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        {barbershop?.city ? <Chip icon="location" label={barbershop.city} /> : null}
        <Chip icon="cut" label={`${barbers.length} barberos`} />
        <Chip icon="briefcase-outline" label={`${services.length} servicios`} />
      </View>
    </View>
  );

  const Chip = ({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) => (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color="#fff" style={{ marginRight: 6 }} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );

  const ServiceItem = ({ item }: { item: Service }) => (
    <Animated.View style={[styles.itemRow, { opacity: fadeAnim }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSub}>
          {money(item.price)} · {item.duration} min
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteService(item.id, item.name)}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const BarberItem = ({ item }: { item: Barber }) => (
    <Animated.View style={[styles.itemRow, { opacity: fadeAnim }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSub}>{item.phone || "Sin teléfono"}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteBarber(item.id, item.name)}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const AppointmentItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.service?.name ?? "Servicio"}</Text>
        <Text style={styles.itemSub}>
          <Ionicons name="time-outline" size={12} /> {formatDateTime(item.date)}
        </Text>
        {item.barber?.name ? <Text style={styles.itemSub}>Barbero: {item.barber.name}</Text> : null}
        {item.client?.name ? <Text style={styles.itemSub}>Cliente: {item.client.name}</Text> : null}
      </View>
      <View style={styles.badgeStatus}>
        <Text style={styles.badgeStatusText}>{item.status ?? "PENDING"}</Text>
      </View>
    </View>
  );

  const pendingCount = appointments.filter((a) => (a.status ?? "PENDING") === "PENDING").length;

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.muted }}>Cargando panel...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onPullRefresh} tintColor={colors.primary} />}
      >
        {/* Servicios */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {/* Botón Citas (top-left) */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.appointmentsBtn}
                onPress={() => {
                  setShowAppointments(true);
                  fetchPendingAppointments();
                }}
                accessibilityLabel="Ver citas pendientes"
              >
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                <Text style={styles.appointmentsBtnText}>Citas</Text>
                {pendingCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pendingCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>

              <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>Servicios ({services.length})</Text>
            </View>

            <TouchableOpacity onPress={() => setAddingService(true)}>
              <Ionicons name="add-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {loadingServices ? (
            <ActivityIndicator color={colors.primary} />
          ) : services.length === 0 ? (
            <Text style={styles.emptySubtitle}>Aún no has agregado servicios.</Text>
          ) : (
            <FlatList
              data={services}
              keyExtractor={(it) => String(it.id)}
              renderItem={({ item }) => <ServiceItem item={item} />}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          )}
        </View>

        {/* Barberos */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Barberos ({barbers.length})</Text>
            <TouchableOpacity onPress={() => setAddingBarber(true)}>
              <Ionicons name="person-add-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {loadingBarbers ? (
            <ActivityIndicator color={colors.primary} />
          ) : barbers.length === 0 ? (
            <Text style={styles.emptySubtitle}>Aún no has agregado barberos.</Text>
          ) : (
            <FlatList
              data={barbers}
              keyExtractor={(it) => String(it.id)}
              renderItem={({ item }) => <BarberItem item={item} />}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal Agregar Servicio */}
      <Modal visible={addingService} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[typography.subtitle, { marginBottom: 10 }]}>Nuevo Servicio</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={newServiceName} onChangeText={setNewServiceName} />
            <TextInput
              style={styles.input}
              placeholder="Precio (COP)"
              keyboardType="numeric"
              value={newServicePrice}
              onChangeText={setNewServicePrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Duración (min)"
              keyboardType="numeric"
              value={newServiceDuration}
              onChangeText={setNewServiceDuration}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleAddService}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#E6E6EA" }]} onPress={() => setAddingService(false)}>
                <Text style={{ color: colors.textPrimary }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Agregar Barbero */}
      <Modal visible={addingBarber} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[typography.subtitle, { marginBottom: 10 }]}>Nuevo Barbero</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={newBarberName} onChangeText={setNewBarberName} />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              value={newBarberPhone}
              onChangeText={setNewBarberPhone}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleAddBarber}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: "#E6E6EA" }]} onPress={() => setAddingBarber(false)}>
                <Text style={{ color: colors.textPrimary }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Citas Pendientes */}
      <Modal visible={showAppointments} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: "92%", maxHeight: "80%" }]}>
            <View style={[styles.cardHeader, { marginBottom: 12 }]}>
              <Text style={styles.sectionTitle}>Citas pendientes ({pendingCount})</Text>
              <TouchableOpacity onPress={() => setShowAppointments(false)}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {loadingAppointments ? (
              <ActivityIndicator color={colors.primary} />
            ) : appointments.length === 0 ? (
              <Text style={styles.emptySubtitle}>No hay citas pendientes por ahora.</Text>
            ) : (
              <FlatList
                data={appointments}
                keyExtractor={(it) => String(it.id)}
                renderItem={({ item }) => <AppointmentItem item={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              />
            )}

            <View style={[styles.modalActions, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={() => fetchPendingAppointments()}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#E6E6EA" }]}
                onPress={() => setShowAppointments(false)}
              >
                <Text style={{ color: colors.textPrimary }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundSoft },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.35)",
  },
  logoutText: { marginLeft: 6, color: "#fff", fontWeight: "700" },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  chipText: { ...typography.small, color: "#fff", fontWeight: "600" },
  content: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { ...typography.subtitle, color: colors.textPrimary },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFD",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFF3",
  },
  itemTitle: { ...typography.body, color: colors.textPrimary },
  itemSub: { ...typography.small, color: colors.muted },

  deleteText: { color: "#E03131", fontWeight: "bold", fontSize: 18 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: "85%", backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 5 },

  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 15,
    color: colors.textPrimary,
  },
  modalBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  emptySubtitle: { ...typography.small, color: colors.muted, textAlign: "center", marginVertical: 6 },

  appointmentsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F5FF",
    borderColor: "#E6E8FB",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  appointmentsBtnText: { marginLeft: 6, color: colors.primary, fontWeight: "600" },
  badge: {
    marginLeft: 6,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  appointmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFD",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFF3",
  },
  badgeStatus: {
    backgroundColor: "#FFF2E8",
    borderColor: "#FFD6BF",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  badgeStatusText: { color: "#E86D2B", fontWeight: "700", fontSize: 10 },
});
