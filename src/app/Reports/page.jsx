'use client'
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { BarChart3, PieChart } from "lucide-react";
import SalesMonth from "./SalesMonth";
import DateProduct from "./DateProduct";
import PofitLosData from "./PofitLosdata";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";

export default function Reports() {
  const [isAdmin, setIsAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    authAPI.getUser().then(res => {
      if (res && res.data && res.data.user) {
        setIsAdmin(res.data.user.is_admin);
        if (!res.data.user.is_admin) {
          router.replace("/Index");
        }
      }
    });
  }, [router]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Rapports</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total des ventes du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,230 €</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nombre de ventes du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Valeur moyenne des factures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">227 €</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList>
            <TabsTrigger value="sales">Rapports des ventes</TabsTrigger>
            <TabsTrigger value="inventory">Rapports de stock</TabsTrigger>
            <TabsTrigger value="profit">Profits et pertes</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventes mensuelles</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed">
                {/* <div className="text-muted-foreground">رسم بياني المبيعات</div> */}
                <SalesMonth/>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Mouvements de stock</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed">
                {/* <div className="text-muted-foreground">رسم بياني المخزون</div> */}
                <DateProduct/>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profit">
            <Card>
              <CardHeader>
                <CardTitle>Profits et pertes</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed">
                <div className="text-muted-foreground">Graphique des profits</div>
                <PofitLosData/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
