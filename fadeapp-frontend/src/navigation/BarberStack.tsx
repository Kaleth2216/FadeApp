import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppointmentsListScreen from "../screens/AppointmentsListScreen";
import SchedulesScreen from "../screens/SchedulesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeBarberScreen from "../screens/HomeBarberScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function BarberStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";
          if (route.name === "Home") iconName = "home";
          if (route.name === "Appointments") iconName = "calendar";
          if (route.name === "Schedules") iconName = "time";
          if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeBarberScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="Appointments" component={AppointmentsListScreen} options={{ title: "Citas" }} />
      <Tab.Screen name="Schedules" component={SchedulesScreen} options={{ title: "Horarios" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}
