import Sidebar from "@/components/dashboard/sidebar";
import { requiredAdmin } from "@/lib/auth";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requiredAdmin();
  return (
    <div className="flex h-screen overflow-hidden text-white">
      <Sidebar userName={user.name} />
      {children}
    </div>
  );
}
