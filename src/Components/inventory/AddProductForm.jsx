"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";

export function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    barcode: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-6">
        <SheetHeader className="mb-6">
          <SheetTitle>إضافة منتج جديد</SheetTitle>
          <SheetDescription>
            أدخل تفاصيل المنتج الجديد هنا. اضغط على حفظ عند الانتهاء.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name">اسم المنتج</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="quantity">الكمية</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="price">السعر</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="barcode">الباركود</Label>
            <Input
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-8">
            حفظ المنتج
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}