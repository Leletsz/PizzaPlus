import { ShieldX, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccessDenied() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-app-background min-h-screen flex items-center justify-center px-4">
      <div className="bg-app-card border border-app-border rounded-2xl p-10 max-w-md w-full flex flex-col items-center gap-6 shadow-2xl">
        {/* Ícone */}
        <div className="bg-brand-primary/10 rounded-full p-5">
          <ShieldX className="text-brand-primary w-12 h-12" strokeWidth={1.5} />
        </div>

        {/* Texto */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Acesso Negado
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Você não tem permissão para acessar esta página. Apenas
            administradores podem visualizar o painel.
          </p>
        </div>

        {/* Divisor */}
        <div className="w-full border-t border-app-border" />

        {/* Botão de logout */}
        <form action={logoutAction} className="w-full">
          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </Button>
        </form>
      </div>
    </div>
  );
}
