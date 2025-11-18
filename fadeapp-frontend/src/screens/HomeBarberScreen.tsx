import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function HomeBarberScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={[typography.title, { color: "#fff" }]}>Agenda del día</Text>
        <Text style={{ color: "#E0ECFF" }}>Revisa tus turnos y horarios</Text>
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ color: colors.muted }}>Aquí puedes mostrar KPIs: próximas citas, total del día, etc.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.backgroundSoft },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
});
