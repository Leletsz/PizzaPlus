"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { registerAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.sucess && state?.redirectTo) {
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
            <Label htmlFor="name" className="text-white">
              Nome
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Digite seu nome"
              required
              minLength={3}
              className="text-white bg-app-card border border-app-border"
            ></Input>
          </div>
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
            {isPending ? "Criando conta..." : "Criar Conta"}
          </Button>
          <p className="text-center text-sm text-gray-100">
            Já possui uma conta?{" "}
            <Link className="text-brand-primary font-semibold" href={"/login"}>
              Faça o login{" "}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
