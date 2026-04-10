"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createProductAction } from "@/actions/products";
import { Category } from "@/lib/types";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCreateProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    // Garante que category_id do select controlado está no FormData
    if (categoryId) {
      formData.set("category_id", categoryId);
    }

    const result = await createProductAction(formData);

    if (result.success) {
      setOpen(false);
      setCategoryId("");
      router.refresh();
      return;
    }

    setError(result.error);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setCategoryId("");
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-brand-primary hover:bg-brand-primary">
          <Plus className="h-5 w-5" />
          Novo Produto
        </Button>
      </DialogTrigger>

      <DialogContent className="p-6 bg-app-card text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados do produto e faça upload da imagem.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleCreateProduct}>
          {/* Nome */}
          <div>
            <Label htmlFor="product-name" className="mb-2">
              Nome do produto
            </Label>
            <Input
              id="product-name"
              name="name"
              required
              placeholder="Ex: Pizza Margherita"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          {/* Preço */}
          <div>
            <Label htmlFor="product-price" className="mb-2">
              Preço (em centavos)
            </Label>
            <Input
              id="product-price"
              name="price"
              required
              type="number"
              min="1"
              placeholder="Ex: 3590 → R$ 35,90"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="product-description" className="mb-2">
              Descrição
            </Label>
            <Textarea
              id="product-description"
              name="description"
              required
              placeholder="Descreva o produto..."
              className="border-app-border bg-app-background text-white resize-none"
              rows={3}
            />
          </div>

          {/* Categoria */}
          <div>
            <Label htmlFor="product-category" className="mb-2">
              Categoria
            </Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              required
            >
              <SelectTrigger
                id="product-category"
                className="border-app-border bg-app-background text-white"
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-app-card text-white border-app-border">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Imagem */}
          <div>
            <Label htmlFor="product-file" className="mb-2">
              Imagem do produto
            </Label>
            <Input
              id="product-file"
              name="file"
              type="file"
              required
              accept="image/*"
              className="border-app-border bg-app-background text-white file:text-white file:bg-transparent"
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            Criar produto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
