"use server"

export async function registerAction(prevState:{sucess: boolean; error?: string} | null,
    formData: FormData
) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    return{ sucess: true}
}