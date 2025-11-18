// ✅ src/navigation/ClientStack.tsx — versión sin pestañas inferiores
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeClientScreen from "../screens/HomeClientScreen";
import AppointmentsListScreen from "../screens/AppointmentsListScreen";
import AppointmentCreateScreen from "../screens/AppointmentCreateScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function ClientStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // ocultar encabezado superior
      }}
    >
      {/* 🏠 Pantalla principal del cliente */}
      <Stack.Screen name="HomeClient" component={HomeClientScreen} />

      {/* 📅 Mis citas */}
      <Stack.Screen name="AppointmentsList" component={AppointmentsListScreen} />

      {/* ✂️ Agendar cita */}
      <Stack.Screen name="NewAppointment" component={AppointmentCreateScreen} />

      {/* 👤 Perfil */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
