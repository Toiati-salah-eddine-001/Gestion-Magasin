"use client";

import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import AuthProvider from "./AuthProvider";
import { api } from "@/lib/api";

export function MainLayout({ children }) {
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.setToken(token);
    }
  }, []);

  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
