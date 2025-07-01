'use client'
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";

export default function Settings() {
    // ________________this page about the print 
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
        <h1 className="text-2xl font-bold">Paramètres</h1>

        <Tabs defaultValue="printing" className="w-full">
          <TabsList>
            <TabsTrigger value="store">Informations du magasin</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base du magasin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nom du magasin</Label>
                  <Input id="storeName" placeholder="Entrez le nom du magasin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Adresse du magasin</Label>
                  <Textarea id="storeAddress" placeholder="Entrez l'adresse du magasin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input id="phone" placeholder="Entrez le numéro de téléphone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Entrez l'adresse email" />
                </div>
                <Button>Enregistrer les modifications</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
