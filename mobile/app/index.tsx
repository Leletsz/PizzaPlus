import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

export default function Index() {
  const { loading, signed } = useAuth();
  //retorna um array com os segmentos da URL atual
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(authenticated)";

    if (!signed && inAuthGroup) {
      router.replace("/login");
    } else if (signed && !inAuthGroup) {
      router.replace("/(authenticated)/dashboard");
    } else if (!signed) {
      router.replace("/login");
    }
  }, [loading, signed, router, segments]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color={colors.brand} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={colors.brand} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
