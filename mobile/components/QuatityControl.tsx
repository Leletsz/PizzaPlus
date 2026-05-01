import { colors, fontSize, spacing } from "@/constants/theme";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantityControl({
  onIncrement,
  onDecrement,
  quantity,
}: QuantityControlProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          quantity <= 1 && { backgroundColor: colors.gray },
        ]}
      >
        <Text style={styles.buttonText} onPress={onDecrement}>
          -
        </Text>
      </Pressable>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>{quantity}</Text>
      </View>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText} onPress={onIncrement}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  button: {
    backgroundColor: colors.red,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: "600",
  },
  quantityContainer: {
    alignSelf: "center",
  },
  quantityText: {
    color: colors.primary,
    fontSize: fontSize.xl,
  },
});
