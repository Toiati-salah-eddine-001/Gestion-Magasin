import { Home, Package, ShoppingCart, Users, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, label: "Tableau de bord", href: "/Index" },
  { icon: ShoppingCart, label: "Point de vente", href: "/Pvente" },
  { icon: Package, label: "Stocks", href: "/Inventory" },
  { icon: Users, label: "Utilisateurs", href: "/Users" },
  { icon: BarChart3, label: "Rapports", href: "/Reports" },
  { icon: Settings, label: "Paramètres", href: "/Settings" },
];

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-xl font-bold">Système de Gestion de Magasin</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
}
