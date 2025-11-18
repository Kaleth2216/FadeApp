import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Schedule } from "../types/schedule.types";
import { getSchedulesByBarber } from "../services/schedules.service";

export default function SchedulesScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSchedulesByBarber(1); // demo
        setSchedules(res);
      } catch {
        console.error("Error al cargar horarios");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horarios del Barbero</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Día: {item.dayOfWeek}</Text>
            <Text>{item.startTime} - {item.endTime}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 22, marginBottom: 10 },
  card: { padding: 15, backgroundColor: "#fff", borderRadius: 10, marginVertical: 5, borderWidth: 1, borderColor: "#eee" },
});
