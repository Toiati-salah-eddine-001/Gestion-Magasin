'use client';
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../Components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductForm } from "@/Components/inventory/AddProductForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

export default function Inventory() {
  const [products, setProducts] = useState([
    { id: 1, name: "منتج 1", quantity: 50, price: 100, barcode: "123456789" },
    { id: 2, name: "منتج 2", quantity: 5, price: 200, barcode: "987654321" },
    { id: 3, name: "منتج 3", quantity: 75, price: 150, barcode: "456789123" },
  ]);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  let TotalQuantities=products.reduce((acc,x)=> acc+x.quantity,0);
  console.log(TotalQuantities)
  
  // TotalQuantities=1;
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">إدارة المخزون</h1>
          <AddProductForm/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إجمالي المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card className={`${TotalQuantities<5 ?"bg-yellow-50":""}`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5  ${TotalQuantities<5?"text-yellow-600":"visibility: hidden"}` }/>
                تنبيهات المخزون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold  ${TotalQuantities<5 ?"text-yellow-600":""}`}>{TotalQuantities}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">قيمة المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25,000 ر.س</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <Input placeholder="بحث عن منتج..." className="max-w-sm" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الباركود</TableHead>
                <TableHead>اسم المنتج</TableHead>
                <TableHead>الكمية</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.price} ر.س</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-[oklch(0.55_0.25_25)]"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المنتج {productToDelete?.name}؟
              لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
