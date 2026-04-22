import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthenticatedLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
