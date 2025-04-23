'use client'
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { BarChart3, PieChart } from "lucide-react";
import SalesMonth from "./SalesMonth";
import DateProduct from "./DateProduct";
import PofitLosData from "./PofitLosdata";


export default function Reports() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">التقارير</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إجمالي المبيعات اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,230 ر.س</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">عدد المبيعات اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">متوسط قيمة الفاتورة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">227 ر.س</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList>
            <TabsTrigger value="sales">تقارير المبيعات</TabsTrigger>
            <TabsTrigger value="inventory">تقارير المخزون</TabsTrigger>
            <TabsTrigger value="profit">الأرباح والخسائر</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>المبيعات الشهرية</CardTitle>
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
                <CardTitle>حركة المخزون</CardTitle>
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
                <CardTitle>الأرباح والخسائر</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed">
                <div className="text-muted-foreground">رسم بياني الأرباح</div>
                <PofitLosData/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
