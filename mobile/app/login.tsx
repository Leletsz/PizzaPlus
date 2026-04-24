import Button from "@/components/button";
import Input from "@/components/Input";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const { signIn } = useAuth();
  const router = useRouter();
  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace("/(authenticated)/dashboard");
    } catch (err) {
      Alert.alert("Erro", "Erro ao fazer o login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            Pizza<Text style={styles.logoBrand}>Plus</Text>
          </Text>
          <Text style={styles.logoSubtitle}>Garçom app</Text>
        </View>
        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Digite seu email..."
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha..."
            placeholderTextColor={"gray"}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="Acessar"
            loading={false}
            variant="primary"
            onPress={handleLogin}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 45,
    fontWeight: "900",
    color: colors.primary,
  },
  logoBrand: {
    color: colors.brand,
  },
  logoSubtitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
  },
  formContainer: { gap: spacing.md },
});
