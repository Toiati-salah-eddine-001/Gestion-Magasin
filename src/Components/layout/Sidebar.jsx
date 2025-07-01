import { Home, Package, ShoppingCart, Users, BarChart3, Settings, Shield, User as UserIcon, LogOut } from "lucide-react";
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
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";

export function Sidebar() {
  const [user, setUser] = useState(undefined); // undefined means loading, null means not logged in

  useEffect(() => {
    authAPI.getUser().then(res => {
      if (res && res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    }).catch(() => setUser(null));
  }, []);

  // console.log(user)
  // Only show Users, Reports, Settings if admin, and only after user is loaded
  const filteredMenuItems = [
    { icon: ShoppingCart, label: "Point de vente", href: "/Pvente" },
    ...(user && user.is_admin === true ? [
      { icon: Package, label: "Stocks", href: "/Inventory" },
      { icon: Home, label: "Tableau de bord", href: "/Index" },
      { icon: Users, label: "Utilisateurs", href: "/Users" },
      { icon: BarChart3, label: "Rapports", href: "/Reports" },
      { icon: Settings, label: "Paramètres", href: "/Settings" },
    ] : [])
  ];

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore errors
    }
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  console.log(user)
  return (
    <SidebarContainer>
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-xl font-bold">Système de Gestion de Magasin</h1>
          {user !== undefined && user !== null && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              {user.is_admin ? (
                <><Shield className="h-4 w-4 text-blue-600" /><span>Admin</span></>
              ) : (
                <><UserIcon className="h-4 w-4 text-gray-600" /><span>{user.name || "Utilisateur"}</span></>
              )}
            </div>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 mt-4 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
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
