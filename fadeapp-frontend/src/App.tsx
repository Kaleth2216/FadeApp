import "react-native-get-random-values";

import React from "react";
import { StatusBar } from "react-native";
import { AuthProvider } from "./auth/AuthContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AppNavigator />
    </AuthProvider>
  );
}
