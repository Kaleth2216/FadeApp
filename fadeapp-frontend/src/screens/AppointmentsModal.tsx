// ✅ src/screens/AppointmentsModal.tsx — Popup elegante para ver citas del cliente
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMyAppointments, deleteAppointment } from "../services/appointments.service";
import { AuthContext } from "../auth/AuthContext";
import colors from "../theme/colors";
import typography from "../theme/typography";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AppointmentsModal({ visible, onClose }: Props) {
  const { token } = useContext(AuthContext) as any;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Cargar citas al abrir el modal
  const fetchAppointments = async () => {
    try {
      if (!token) {
        Alert.alert("Sesión no encontrada", "Inicia sesión para ver tus citas.");
        setLoading(false);
        return;
      }

      const res = await getMyAppointments(token);
      setAppointments(res || []);
    } catch (err: any) {
      console.error("[AppointmentsModal] Error al cargar citas:", err.message);
      Alert.alert("Error", "No se pudieron cargar tus citas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setLoading(true);
      fetchAppointments();
    }
  }, [visible]);

  const handleCancel = (appointmentId: number) => {
    Alert.alert("Cancelar cita", "¿Seguro que deseas cancelar esta cita?", [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAppointment(appointmentId, token);
            Alert.alert("Cita cancelada", "Tu cita ha sido cancelada correctamente.");
            setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
          } catch {
            Alert.alert("Error", "No se pudo cancelar la cita. Intenta nuevamente.");
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Mis Citas</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Contenido */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : appointments.length === 0 ? (
            <View style={styles.center}>
              <Ionicons name="calendar-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyText}>Aún no tienes citas programadas</Text>
            </View>
          ) : (
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => {
                const fecha = item.date ? item.date.replace("T", " ").slice(0, 16) : "Sin fecha";
                const serviceName = item.service?.name || "Sin servicio";
                const barberName = item.barber?.name || "Sin barbero";

                return (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{serviceName}</Text>
                      <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.cancelBtn}>
                        <Ionicons name="close-circle-outline" size={22} color="#b91c1c" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cardDetail}>Barbero: {barberName}</Text>
                    <Text style={styles.cardDetail}>Fecha: {fecha}</Text>
                    <Text style={styles.cardStatus}>Estado: {item.status || "Desconocido"}</Text>
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "85%",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6EA",
    marginBottom: 10,
  },
  title: { ...typography.title, color: colors.textPrimary },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  emptyText: { ...typography.small, color: colors.muted, marginTop: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { ...typography.body, fontWeight: "700", color: colors.primary },
  cardDetail: { ...typography.small, color: colors.textPrimary, marginTop: 4 },
  cardStatus: {
    ...typography.small,
    color: colors.muted,
    marginTop: 8,
    fontWeight: "600",
  },
  cancelBtn: { padding: 4 },
});
