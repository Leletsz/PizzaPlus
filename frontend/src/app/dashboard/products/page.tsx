import { ProductForm } from "@/components/dashboard/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { Package } from "lucide-react";
import Image from "next/image";

export default async function Products() {
  const token = await getToken();

  const [products, categories] = await Promise.all([
    apiClient<Product[]>("/products", { token: token! }),
    apiClient<Category[]>("/category", { token: token! }),
  ]);

  // Converte centavos → reais formatado
  function formatPrice(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-center sm:text-3xl font-bold text-white">
            Produtos
          </h1>
        </div>
        <ProductForm categories={categories} />
      </div>

      {products.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-app-border transition-shadow hover:shadow-md text-white overflow-hidden"
            >
              {product.banner && (
                <div className="relative w-full h-48">
                  <Image
                    src={product.banner}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="gap-2 flex items-center text-base md:text-lg">
                  <Package className="w-5 h-5 shrink-0" />
                  <span className="truncate">{product.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-brand-primary font-semibold">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Package className="w-12 h-12" />
          <p className="text-lg">Nenhum produto cadastrado ainda.</p>
        </div>
      )}
    </div>
  );
}
