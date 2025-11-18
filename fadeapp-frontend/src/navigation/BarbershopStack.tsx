// ✅ src/navigation/BarbershopStack.tsx — versión sin pestañas inferiores
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeBarbershopScreen from "../screens/HomeBarbershopScreen";

const Stack = createNativeStackNavigator();

type Props = {
  token: string;
  barbershopId: number;
};

export default function BarbershopStack({ token, barbershopId }: Props) {
  console.log("[BarbershopStack] Recibido:", { token: token ? "OK" : "NO", barbershopId });

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // sin encabezado superior
      }}
    >
      <Stack.Screen
        name="HomeBarbershop"
        options={{ title: "Panel Barbería" }}
        children={() => (
          <HomeBarbershopScreen token={token} barbershopId={barbershopId} />
        )}
      />
    </Stack.Navigator>
  );
}
