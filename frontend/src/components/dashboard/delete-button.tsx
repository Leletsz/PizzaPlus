"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/actions/products";

interface DeleteButtonProps {
  productId: string;
}
export function DeleteButtonProduct({ productId }: DeleteButtonProps) {
  const router = useRouter();

  async function handleDeleteProduct() {
    const result = await deleteProductAction(productId);
    if (result.success) {
      router.refresh();
      return;
    }
  }
  return (
    <Button onClick={handleDeleteProduct}>
      <Trash className="w-5 h-5"></Trash>
    </Button>
  );
}
