"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(LoginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state, router]);

  return (
    <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
          Pizza
          <span className="text-brand-primary font-semibold ">Plus</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu Email"
              required
              className="text-white bg-app-card border border-app-border"
            ></Input>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua Senha"
              required
              className="text-white bg-app-card border border-app-border"
            ></Input>
          </div>
          <Button
            type="submit"
            className="w-full bg-brand-primary cursor-pointer"
          >
            {isPending ? "Acessando conta..." : "Acessar Conta"}
          </Button>
          {state?.error && (
            <div className="text-sm text-red-500 bg-red-50 rounded-md p-3">
              Email ou senha inválido
            </div>
          )}

          <p className="text-center text-sm text-gray-100">
            Ainda não possui uma conta?{" "}
            <Link
              className="text-brand-primary font-semibold"
              href={"/register"}
            >
              Cadastre-se{" "}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
