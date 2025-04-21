import { Home, Package, ShoppingCart, Users, BarChart3, Settings } from "lucide-react";
import Link from "next/link"; // Ensure Link is imported correctly
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
  { icon: Home, label: "لوحة التحكم", href: "/Index" },
  { icon: ShoppingCart, label: "Point de vente", href: "/Pvente" },
  { icon: Package, label: "المخزون", href: "/Inventory" },
  { icon: Users, label: "المستخدمين", href: "/Users" },
  { icon: BarChart3, label: "التقارير", href: "/Reports" },
  { icon: Settings, label: "Settings", href: "/Settings" }, // Fixed href
];

export function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-xl font-bold">نظام إدارة المتجر</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة</SidebarGroupLabel>
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
                  {console.log("Navigating to:", item.href)}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
}
