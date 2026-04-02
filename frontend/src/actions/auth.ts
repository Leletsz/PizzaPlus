"use server"

import { apiClient } from "@/lib/api";

export async function registerAction(prevState:{sucess: boolean; error?: string; redirectTo: string} | null,
    formData: FormData
) {
    try {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

    const data = {
        name: name,
        email: email,
        password: password,
    }
        await apiClient("/users", {
            method: "POST",
           body: JSON.stringify(data),
        })
        return{sucess: true, error:"", redirectTo:"/login"}
    } catch (error) {
        return { sucess: false, error: error instanceof Error ? error.message : "Erro ao cadastrar usuário", redirectTo: "" }
    }
}