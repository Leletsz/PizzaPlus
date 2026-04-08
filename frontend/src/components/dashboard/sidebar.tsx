"use client";
import { cn } from "@/lib/utils";
import { LogOutIcon, Package, ShoppingCart, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/auth";

interface SidebarProps {
  userName: string;
}

const menuItems = [
  {
    title: "Pedidos",
    href: "/dashboard",
    icon: ShoppingCart,
  },
  {
    title: "Produtos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/dashboard/categories",
    icon: Tags,
  },
];
export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-app-border bg-app-sidebar">
      {/* Header */}
      <div className="border-b border-app-border p-6">
        <h2 className="text-xl font-bold text-white">
          Pizza<span className="text-brand-primary font-semibold ">Plus</span>
        </h2>
        <p className="text-sm text-gray-300 mt-1">Olá, {userName}</p>
      </div>
      {/* Menu */}
      <nav className="flex-1 p-4 space-y-4">
        {menuItems.map((menu) => {
          const Icon = menu.icon;
          const isActive = pathname === menu.href;
          return (
            <Link
              href={menu.href}
              key={menu.title}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300",
                isActive ? "bg-brand-primary text-white" : "hover:bg-gray-400",
              )}
            >
              <Icon className="w-5 h-5" />
              {menu.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 border-app-border">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant={"ghost"}
            className="w-full justify-start gap-3 text-white hover:text-white hover:bg-transparent cursor-pointer"
          >
            <LogOutIcon className="w-5 h-5" />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  );
}
