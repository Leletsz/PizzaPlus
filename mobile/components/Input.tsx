import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
}

export default function Input({ label, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, style]} {...rest}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    color: colors.primary,
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
    marginLeft: 5,
  },
  input: {
    height: 50,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.borderColor,
    fontSize: fontSize.lg,
  },
});
