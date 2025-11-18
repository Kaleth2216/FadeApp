// ✅ src/screens/AppointmentCreateScreen.tsx — UI/UX mejorado con la misma paleta y fix 403
import React, { useMemo, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createAppointment } from "../services/appointments.service";
import { AuthContext } from "../auth/AuthContext";
import colors from "../theme/colors";
import typography from "../theme/typography";

// 🔹 Convierte un Date a formato YYYY-MM-DD
const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// 🔹 Combina fecha y hora en un Date completo
const combineDateTime = (dateStr: string, timeStr: string) =>
  new Date(`${dateStr}T${timeStr}:00`);

type RouteParams = {
  barbershopId: number;
  serviceId: number;
  barberId: number;
};

export default function AppointmentCreateScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { barbershopId, serviceId, barberId } = (route.params || {}) as RouteParams;

  // 🔹 Extraemos también userId (necesario para enviar como clientId)
  const { token, userId } = useContext(AuthContext) as any;

  const [selectedDate, setSelectedDate] = useState<string>(toYMD(new Date()));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Logs iniciales ---
  console.log("[AppointmentCreateScreen] route.params =", route.params);
  console.log(
    "[AppointmentCreateScreen] token len / preview =",
    token ? token.length : 0,
    token ? token.slice(0, 12) + "..." : "(no token)"
  );

  // 🔹 Generar próximos 14 días
  const days = useMemo(() => {
    const arr: { key: string; labelTop: string; labelBottom: string }[] = [];
    const opts: Intl.DateTimeFormatOptions = { weekday: "short" };
    const monthOpts: Intl.DateTimeFormatOptions = { month: "short" };
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dayNum = `${d.getDate()}`.padStart(2, "0");
      const wd = new Intl.DateTimeFormat("es-ES", opts).format(d);
      const mo = new Intl.DateTimeFormat("es-ES", monthOpts).format(d);
      arr.push({ key: toYMD(d), labelTop: wd.toUpperCase(), labelBottom: `${dayNum} ${mo}` });
    }
    return arr;
  }, []);

  // 🔹 Intervalos de tiempo (cada 30 min)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    let hour = 9,
      minute = 0;
    while (hour < 19 || (hour === 19 && minute === 0)) {
      slots.push(`${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}`);
      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour += 1;
      }
    }
    return slots;
  }, []);

  // 🔹 Envío de cita
  const handleSubmit = async () => {
    if (!barbershopId || !serviceId || !barberId) {
      Alert.alert("Falta información", "Vuelve y elige barbería, servicio y barbero.");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Hora requerida", "Elige una hora para continuar.");
      return;
    }

    const when = combineDateTime(selectedDate, selectedTime);
    const iso = when.toISOString();

    const args = {
      token,
      barbershopId: Number(barbershopId),
      barberId: Number(barberId),
      serviceId: Number(serviceId),
      clientId: Number(userId), // ✅ agregado para evitar 403
      appointmentDate: iso,
    };

    console.log("[AppointmentCreateScreen] submit →", args);

    try {
      setSubmitting(true);
      const resp = await createAppointment(args as any);
      console.log("[AppointmentCreateScreen] createAppointment OK =", resp);

      // ✅ Nueva navegación hacia HomeClient con el popup de citas abierto
      Alert.alert("¡Listo!", "Tu cita fue creada correctamente.", [
        {
          text: "Ver mis citas",
          onPress: () =>
            navigation.navigate("HomeClient", {
              openAppointments: true, // ⬅️ indicamos que el popup se abra automáticamente
            }),
        },
      ]);
    } catch (e: any) {
      console.error("[AppointmentCreateScreen] createAppointment ERROR =", {
        message: e?.message,
      });
      Alert.alert("No se pudo crear la cita", e?.message || "Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 Render principal
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroCapsule}>
          <Text style={styles.heroTitle}>Elige fecha y hora</Text>
        </View>
        <Text style={styles.heroSubtitle}>Programa tu visita en pocos pasos</Text>
      </View>

      {/* Sección Fecha */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Elige una fecha</Text>
          <View style={styles.sectionHintPill}>
            <Text style={styles.sectionHintPillText}>2 semanas</Text>
          </View>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={days}
          keyExtractor={(it) => it.key}
          contentContainerStyle={{ gap: 10, paddingVertical: 2 }}
          renderItem={({ item }) => {
            const active = item.key === selectedDate;
            return (
              <TouchableOpacity
                onPress={() => setSelectedDate(item.key)}
                style={[styles.dateChip, active && styles.dateChipActive]}
              >
                <Text style={[styles.dateChipTop, active && styles.dateChipTopActive]}>
                  {item.labelTop}
                </Text>
                <Text style={[styles.dateChipBottom, active && styles.dateChipBottomActive]}>
                  {item.labelBottom}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Sección Hora */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Elige una hora</Text>
          {!!selectedTime && (
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{selectedTime}</Text>
            </View>
          )}
        </View>

        <View style={styles.grid}>
          {timeSlots.map((t) => {
            const active = t === selectedTime;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setSelectedTime(t)}
                style={[styles.slot, active && styles.slotActive]}
              >
                <Text style={[styles.slotText, active && styles.slotTextActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Botón principal */}
      <TouchableOpacity
        disabled={submitting || !selectedTime}
        onPress={handleSubmit}
        style={[styles.primaryBtn, (submitting || !selectedTime) && { opacity: 0.5 }]}
      >
        <Text style={styles.primaryBtnText}>
          {submitting ? "Agendando..." : "Agendar cita"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSoft, paddingHorizontal: 16 },
  hero: { paddingVertical: 18, alignItems: "center" },
  heroCapsule: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  heroTitle: { ...typography.title, color: "#fff" },
  heroSubtitle: { marginTop: 8, ...typography.small, color: colors.muted },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFF3",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { ...typography.subtitle, color: colors.textPrimary },
  sectionHintPill: {
    backgroundColor: "#F3F5FF",
    borderColor: "#E6E8FB",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sectionHintPillText: { ...typography.small, color: colors.primary, fontWeight: "700" },
  dateChip: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6EA",
    minWidth: 96,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  dateChipActive: {
    borderColor: colors.primary,
    backgroundColor: "#F3F5FF",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  dateChipTop: { ...typography.small, color: colors.muted },
  dateChipTopActive: { color: colors.primary, fontWeight: "700" },
  dateChipBottom: { marginTop: 4, ...typography.body, color: colors.textPrimary, fontWeight: "700" },
  dateChipBottomActive: { color: colors.primary },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slot: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6EA",
    minWidth: 84,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  slotActive: {
    borderColor: colors.primary,
    backgroundColor: "#F7F8FF",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  slotText: { ...typography.body, color: colors.textPrimary, fontWeight: "600" },
  slotTextActive: { color: colors.primary, fontWeight: "800" },
  primaryBtn: {
    marginTop: 22,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
