// app/_layout.jsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="welcomepage"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
