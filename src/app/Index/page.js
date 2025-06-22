"use client";

import { useEffect, useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { AlertTriangle, Package, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { dashboardAPI, productsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Index() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const statsData = await dashboardAPI.getStats();
        setStats(statsData.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, subtext, isLoading }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Ventes du jour"
            value={`${stats?.today_sales || 0} €`}
            subtext={`${stats?.sales_comparison_yesterday || 0}% par rapport à hier`}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            isLoading={loading}
          />
          <StatCard
            title="Stock faible"
            value={stats?.low_stock_products?.length || 0}
            subtext="produits à réapprovisionner"
            icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
            isLoading={loading}
          />
          <StatCard
            title="Commandes en attente"
            value={stats?.pending_orders || 0}
            subtext="en attente de traitement"
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            isLoading={loading}
          />
          <StatCard
            title="Total des produits"
            value={stats?.total_products || 0}
            subtext="en stock"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            isLoading={loading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/Pvente">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Point de vente</CardTitle>
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Créer des factures et traiter les ventes</p>
                <div className="flex justify-end mt-4">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/Inventory">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Gestion des stocks</CardTitle>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Gérer les produits et surveiller les stocks</p>
                <div className="flex justify-end mt-4">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/Reports">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Rapports</CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Rapports et statistiques des ventes et stocks</p>
                <div className="flex justify-end mt-4">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
