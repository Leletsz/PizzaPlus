"use server"

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Product } from "@/lib/types";
import { error } from "console";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
    try {
        const token = await getToken();
        if (!token) {
            return { success: false, error: "Não autenticado" };
        }

        // Envia como multipart/form-data (o apiClient detecta FormData e não seta Content-Type)
        await apiClient<Product>("/product", {
            method: "POST",
            body: formData,
            token: token,
        });

        revalidatePath("/dashboard/products");

        return { success: true, error: "" };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Erro ao criar produto" };
    }
}

export async function deleteProductAction(productId: string) {
    try{
    if(!productId){
        return{success: false, error: "falha ao deletar produto"}
    }
    const token = await getToken();
    if(!token){
        return{success: false, error: "Erro carregar o token "}
    }

    await apiClient(`/product?product_id=${productId}`,{
        method: "DELETE",
        token: token
    })

    revalidatePath("/dashboard/products")
    return{success: true, error:""}
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Erro ao deletar produto" };
    }
}