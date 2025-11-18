// ✅ src/screens/BarbershopDetailScreen.tsx — Detalle con UI mejorada (precio en su propia fila para evitar choques)
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import colors from "../theme/colors";
import typography from "../theme/typography";

// Tipos básicos (sin cambios funcionales)
type EntityService = {
  id: number;
  name: string;
  price: number;
  duration: number; // minutos
  status: boolean;
};

type Barber = {
  id: number;
  name: string;
  specialty?: string;
  status: boolean;
};

type Barbershop = {
  id: number;
  name: string;
  address: string;
  city: string;
  openingTime?: string | null;
  closingTime?: string | null;
  services: EntityService[];
  barbers: Barber[];
};

type RouteParams = {
  id: number;
};

export default function BarbershopDetailScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const { id } = route.params as RouteParams;

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);

  // Formateo de dinero en COP
  const money = useMemo(
    () =>
      (n: number) =>
        new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }).format(n || 0),
    []
  );

  // Utilidad: filtrar duplicados por id
  const uniqueById = <T extends { id: number }>(arr: T[]) =>
    arr.filter((item, idx, self) => idx === self.findIndex((i) => i.id === item.id));

  // Cargar datos
  useEffect(() => {
    const fetchBarbershop = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:8080/api/barbershops/${id}`);
        if (!response.ok) throw new Error("Error al obtener la barbería");
        const raw = (await response.json()) as Barbershop;

        const cleaned: Barbershop = {
          ...raw,
          services: raw.services ? uniqueById(raw.services).filter((s) => s.status) : [],
          barbers: raw.barbers ? uniqueById(raw.barbers).filter((b) => b.status) : [],
        };

        setBarbershop(cleaned);
      } catch (err: any) {
        setError(err?.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbershop();
  }, [id]);

  // Loading o error
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.muted }}>Cargando barbería...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!barbershop) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.textPrimary }}>No se encontró la barbería.</Text>
      </View>
    );
  }

  // === Ítems con diseño mejorado (solo UI) ===
  const renderService = ({ item }: { item: EntityService }) => {
    const isSelected = selectedService === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, styles.serviceCard, isSelected && styles.cardSelected]}
        onPress={() => setSelectedService(item.id)}
        activeOpacity={0.9}
      >
        {/* 1) Título ocupa toda la fila sin competir con el precio */}
        <View style={styles.cardHeaderTitleRow}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {item.name}
          </Text>
        </View>

        {/* 2) Precio aislado en su propia fila (alineado a la derecha) */}
        <View style={styles.priceRow}>
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>{money(item.price)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 3) Meta-información */}
        <View style={styles.metaRow}>
          <View style={styles.metaPillSoft}>
            <Text style={styles.metaPillSoftText}>Duración: {item.duration} min</Text>
          </View>
          <View style={styles.metaDot} />
          <Text style={styles.cardSubtitle}>Servicio activo</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBarber = ({ item }: { item: Barber }) => {
    const isSelected = selectedBarber === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, styles.barberCard, isSelected && styles.cardSelected]}
        onPress={() => setSelectedBarber(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{item.name?.charAt(0)?.toUpperCase() || "B"}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {item.name}
          </Text>
          {!!item.specialty && (
            <Text numberOfLines={1} style={styles.cardSubtitle}>
              {item.specialty}
            </Text>
          )}
        </View>

        <View style={styles.badgeSoft}>
          <Text style={styles.badgeSoftText}>Disponible</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const canContinue = Boolean(selectedService && selectedBarber);

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.headerCapsule}>
          <Text style={styles.title}>{barbershop.name}</Text>
        </View>
        <Text style={styles.subtitle}>{barbershop.address}</Text>
        <Text style={styles.subtitle}>{barbershop.city}</Text>
        <Text style={styles.schedule}>
          {barbershop.openingTime || "No definido"} — {barbershop.closingTime || "No definido"}
        </Text>
      </View>

      {/* Sección Servicios (tarjeta contenedora con grid 2 columnas) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Servicios disponibles</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{barbershop.services?.length ?? 0}</Text>
          </View>
        </View>

        {barbershop.services && barbershop.services.length > 0 ? (
          <FlatList
            data={barbershop.services}
            renderItem={renderService}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10 }}
          />
        ) : (
          <Text style={styles.emptyText}>No hay servicios disponibles.</Text>
        )}
      </View>

      {/* Sección Barberos (tarjeta contenedora con lista vertical) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Barberos</Text>
        </View>

        {barbershop.barbers && barbershop.barbers.length > 0 ? (
          <FlatList
            data={barbershop.barbers}
            renderItem={renderBarber}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        ) : (
          <Text style={styles.emptyText}>No hay barberos disponibles.</Text>
        )}
      </View>

      {/* Botón principal */}
      <TouchableOpacity
        style={[styles.button, !canContinue && styles.buttonDisabled]}
        disabled={!canContinue}
        onPress={() =>
          navigation.navigate("NewAppointment", {
            barbershopId: barbershop.id,
            serviceId: selectedService,
            barberId: selectedBarber,
          })
        }
        accessibilityLabel="Agendar cita"
        accessibilityHint="Continúa para seleccionar fecha y hora"
      >
        <Text style={styles.buttonText}>Agendar cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// === Estilos (solo UI; paleta y tipografías coherentes con Home) ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSoft,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundSoft,
  },
  error: {
    ...typography.body,
    color: "#E03131",
  },

  // Header mejorado
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerCapsule: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    marginBottom: 8,
  },
  title: {
    ...typography.title,
    color: "#fff",
  },
  subtitle: {
    ...typography.small,
    color: colors.muted,
    marginTop: 2,
  },
  schedule: {
    ...typography.small,
    color: colors.muted,
    marginTop: 4,
  },

  // Contenedor de secciones (tarjeta grande)
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
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  sectionBadge: {
    backgroundColor: "#F3F5FF",
    borderColor: "#E6E8FB",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionBadgeText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "700",
  },

  // Tarjetas genéricas
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EFEFF3",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    transform: [{ translateY: 0 }],
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#F7F8FF",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },

  // Tarjeta Servicio
  serviceCard: {
    minHeight: 120,
  },
  cardHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  priceRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  pricePill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pricePillText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ECECF4",
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  metaPillSoft: {
    backgroundColor: "#F3F5FF",
    borderColor: "#E6E8FB",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  metaPillSoftText: {
    ...typography.small,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#D9DCEF",
  },

  // Tarjeta Barbero
  barberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F5FF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E8FB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "800",
  },
  badgeSoft: {
    marginLeft: 6,
    backgroundColor: "#EAFCEF",
    borderColor: "#C6F1D3",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeSoftText: {
    ...typography.small,
    color: "#2E7D32",
    fontWeight: "700",
  },

  // Tipografías de tarjetas
  cardTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  cardSubtitle: {
    ...typography.small,
    color: colors.muted,
    marginTop: 2,
  },

  emptyText: {
    ...typography.small,
    color: colors.muted,
  },

  // Botón principal
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
