import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
    // ________________this page about the print 
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">الإعدادات</h1>

        <Tabs defaultValue="store" className="w-full">
          <TabsList>
            <TabsTrigger value="store">معلومات المتجر</TabsTrigger>
            <TabsTrigger value="printing">إعدادات الطباعة</TabsTrigger>
            <TabsTrigger value="system">إعدادات النظام</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>معلومات المتجر الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">اسم المتجر</Label>
                  <Input id="storeName" placeholder="أدخل اسم المتجر" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">عنوان المتجر</Label>
                  <Textarea id="storeAddress" placeholder="أدخل عنوان المتجر" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" placeholder="أدخل رقم الهاتف" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" />
                </div>
                <Button>حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="printing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الطباعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="printerType">نوع الطابعة</Label>
                  <Input id="printerType" placeholder="حدد نوع الطابعة" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptHeader">ترويسة الفاتورة</Label>
                  <Textarea id="receiptHeader" placeholder="أدخل نص ترويسة الفاتورة" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptFooter">تذييل الفاتورة</Label>
                  <Textarea id="receiptFooter" placeholder="أدخل نص تذييل الفاتورة" />
                </div>
                <Button>حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النظام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">العملة</Label>
                  <Input id="currency" placeholder="ر.س" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Input id="timezone" placeholder="التوقيت" />
                </div>
                <Button>حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
