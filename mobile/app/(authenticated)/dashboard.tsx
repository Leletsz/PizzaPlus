import { useAuth } from "@/contexts/AuthContext";
import { View, Text, Button } from "react-native";

export default function Dashboard() {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Pagina Dashboard</Text>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
}
