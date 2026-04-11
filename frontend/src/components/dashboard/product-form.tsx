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
import { Plus, Upload } from "lucide-react";
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
import Image from "next/image";

interface ProductFormProps {
  categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [priceValue, setPriceValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>();

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

  function formatToBrl(value: string) {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";

    const amount = parseInt(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatToBrl(e.target.value);
    setPriceValue(formatted);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
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
            <Label htmlFor="name" className="mb-2">
              Nome do produto
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Ex: Pizza Margherita"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          {/* Preço */}
          <div>
            <Label htmlFor="price" className="mb-2">
              Preço
            </Label>
            <Input
              id="price"
              name="price"
              required
              min="1"
              value={priceValue}
              onChange={handlePriceChange}
              placeholder="Ex: 3590 → R$ 35,90"
              className="border-app-border bg-app-background text-white"
            />
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description" className="mb-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Descreva o produto..."
              className="border-app-border bg-app-background text-white resize-none"
              rows={3}
            />
          </div>

          {/* Categoria */}
          <div>
            <Label htmlFor="category" className="mb-2">
              Categoria
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger
                id="category"
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
          <div className="space-y-2">
            <Label htmlFor="file" className="mb-2">
              Imagem do produto
            </Label>
            {imagePreview ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="preview da imagem"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={clearImage}
                  className="absolute top-2 right-2 z-20 text-white bg-brand-primary"
                >
                  Excluir
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <Label htmlFor="file">Clique para selecionar uma imagem</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Erro */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

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
