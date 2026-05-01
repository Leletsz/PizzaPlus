import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Category, Product } from "@/types";
import api from "@/services/api";
import { colors, fontSize, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Select } from "@/components/Select";
import { QuantityControl } from "@/components/QuatityControl";
import Button from "@/components/button";

export default function Order() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { order_id, table } = useLocalSearchParams<{
    order_id: string;
    table: string;
  }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedproducts, setSelectedProducts] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function loadDataCategories() {
      await loadCategories();
    }
    loadDataCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadProducts(selectedCategory);
    } else {
      setProducts([]);
      setSelectedCategory("");
    }
  }, [selectedCategory]);

  async function loadCategories() {
    try {
      const response = await api.get<Category[]>("/category");
      setCategories(response.data);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Falha ao carregar as categorias, tente mais tarde." + error,
      );
    } finally {
      setLoadingCategories(false);
    }
  }

  async function loadProducts(categoryId: string) {
    try {
      setLoadingProducts(true);

      const response = await api.get<Product[]>("/category/product", {
        params: { category_id: categoryId },
      });
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProducts(false);
    }
  }

  if (loadingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color={colors.brand} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mesa: {table}</Text>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="trash" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.scrollContent}>
        <Select
          label="Categorias"
          placeholder="Selecione a categoria"
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))}
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
        />

        {loadingProducts ? (
          <ActivityIndicator size={"small"} color={colors.brand} />
        ) : (
          selectedCategory && (
            <Select
              placeholder="Selecione um produto"
              options={products.map((product) => ({
                label: product.name,
                value: product.id,
              }))}
              selectedValue={selectedproducts}
              onValueChange={setSelectedProducts}
            />
          )
        )}
        {selectedproducts && (
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantidade</Text>
            <QuantityControl
              quantity={quantity}
              onIncrement={() => setQuantity((quantity) => quantity + 1)}
              onDecrement={() => {
                if (quantity <= 1) {
                  setQuantity(1);
                  return;
                }
                setQuantity((quantity) => quantity - 1);
              }}
            />
          </View>
        )}

        {selectedproducts && (
          <Button title="Adicionar" onPress={() => {}} variant="secondary" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: fontSize.xl,
    color: colors.primary,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: colors.red,
    padding: spacing.sm,
    borderRadius: 8,
  },
  scrollContent: { padding: spacing.lg },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  quantityLabel: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
});
