import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientStack from "./ClientStack";
import BarbershopDetailScreen from "../screens/BarbershopDetailScreen";

const Stack = createNativeStackNavigator();

export default function ClientNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs" component={ClientStack} />
      <Stack.Screen name="BarbershopDetail" component={BarbershopDetailScreen} />
    </Stack.Navigator>
  );
}
