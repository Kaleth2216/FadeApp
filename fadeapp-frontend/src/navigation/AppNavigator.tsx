import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import AuthNavigator from "./AuthNavigator";
import ClientNavigator from "./ClientNavigator";
import BarberStack from "./BarberStack";
import BarbershopStack from "./BarbershopStack";

export default function AppNavigator() {
  const { token, role, userId } = useContext(AuthContext);

  return (
    <NavigationContainer key={token ? "auth" : "guest"}>
      {!token && <AuthNavigator />}
      {token && role === "CLIENT" && <ClientNavigator />}
      {token && role === "BARBER" && <BarberStack />}
      {token && role === "BARBERSHOP" && (
        <BarbershopStack token={token} barbershopId={userId} />
      )}
    </NavigationContainer>
  );
}
