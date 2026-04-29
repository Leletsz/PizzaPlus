import { View, Text, StyleSheet } from "react-native";

interface SelectOptions {
  label: string;
  value: string;
}
interface SelectProps {
  label?: string;
  options: SelectOptions[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function Select({
  onValueChange,
  placeholder = "Selecione..",
  selectedValue,
  options,
  label,
}: SelectProps) {
  return (
    <View>
      <Text>Select</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
