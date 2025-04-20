import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar"; // Ensure this matches the export in Sidebar.jsx

export function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
