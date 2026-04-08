import MobileSidebar from "@/components/dashboard/mobile-sidebar";
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
      {/* Sidebar Desktop */}
      <Sidebar userName={user.name} />

      {/* Header Mobile*/}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-app-background">
          <MobileSidebar userName={user.name} />
          <div className="container max-w-full px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
