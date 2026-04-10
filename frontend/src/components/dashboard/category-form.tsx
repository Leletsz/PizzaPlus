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
import { createCategoryAction } from "@/actions/categories";
import { useRouter } from "next/navigation";

export function CategoryForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleCreateCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createCategoryAction(formData);

    if (result.success) {
      setOpen(false);
      router.refresh();
      return;
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-primary hover:bg-brand-primary">
          <Plus className="h-5 w-5 " />
          Nova Categoria
        </Button>
      </DialogTrigger>

      <DialogContent className="p-6 bg-app-card text-white">
        <DialogHeader>
          <DialogTitle>Categoria</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleCreateCategory}>
          <div>
            <Label htmlFor="category" className="mb-2">
              Nome da categoria
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Digite o nome da categoria"
              className="border-app-border bg-app-background text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            Criar nova categoria
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
