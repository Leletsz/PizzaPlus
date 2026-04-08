"use server"

import { apiClient } from "@/lib/api";
import { removeToken, setToken } from "@/lib/auth";
import { AuthResponse, User } from "@/lib/types";
import { redirect } from "next/navigation";

export async function registerAction(prevState:{success: boolean; error?: string; redirectTo: string} | null, formData: FormData) {
    try {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

    const data = {
        name: name,
        email: email,
        password: password,
    }
       await apiClient<User>("/users", {
            method: "POST",
           body: JSON.stringify(data),
        })
        return{success: true, error:"", redirectTo:"/login"}
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Erro ao cadastrar usuário", redirectTo: "" }
    }
}

export async function LoginAction(prevState:{success: boolean; error?: string; redirectTo: string} | null, formData: FormData) {
    try{
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const data ={
            email: email,
            password: password,
        }
        
        const response = await apiClient<AuthResponse>("/session",{
            method: "POST",
            body: JSON.stringify(data),
        })

        await setToken(response.token)
    return{ success: true, error: "", redirectTo: "/dashboard"}
    }catch(error){
        return{ success: false, error: error instanceof Error ? error.message : "Erro ao fazer o login", redirectTo: ""}
    }
}

export async function logoutAction() {
    await removeToken();
    redirect("login")
}