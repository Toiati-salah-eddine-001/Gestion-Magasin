"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Barcode, Trash2, Plus, Minus, Printer, CreditCard, Wallet, BanknoteIcon } from "lucide-react";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Mock product data
const mockProducts = [
  { id: 1, name: "كمبيوتر محمول", price: 1200, barcode: "1234567890" },
  { id: 2, name: "هاتف ذكي", price: 500, barcode: "0987654321" },
  { id: 3, name: "سماعات لاسلكية", price: 80, barcode: "5678901234" },
  { id: 4, name: "شاحن محمول", price: 25, barcode: "4321098765" },
  { id: 5, name: "حافظة للهاتف", price: 15, barcode: "9876543210" },
];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  const form = useForm();

  const handleSearch = () => {
    const product = mockProducts.find(p => 
      p.barcode === searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (product) {
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
      
      setSearchQuery("");
    }
  };

  const handleIncreaseQuantity = (id) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
    ));
  };

  const handleDecreaseQuantity = (id) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity - 1) } 
        : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const handleCompleteSale = () => {
    // Here you would save the sale to a database
    console.log("Sale completed", { cart, paymentMethod, total });
    // Reset the cart
    setCart([]);
    setDiscountPercent(0);
    setPaymentMethod("cash");
  };
// _______________________ ADD Forme feild for back end !!!! 
// ________________________also add code Facture .
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">نقطة البيع</h1>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Product Search */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">بحث عن المنتجات</CardTitle>
              <Barcode className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4 flex-row-reverse">
                <Button onClick={handleSearch}>بحث</Button>
                <Input 
                  className="flex-1" 
                  placeholder="ادخل اسم المنتج أو الباركود" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-right border-b">
                      <th className="py-2 px-4 font-medium">المنتج</th>
                      <th className="py-2 px-4 font-medium">السعر</th>
                      <th className="py-2 px-4 font-medium">الكمية</th>
                      <th className="py-2 px-4 font-medium">المجموع</th>
                      <th className="py-2 px-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-muted-foreground">
                          لا توجد منتجات في السلة
                        </td>
                      </tr>
                    ) : (
                      cart.map((item) => (
                        <tr key={item.id} className="border-b text-right">
                          <td className="py-2 px-4">{item.name}</td>
                          <td className="py-2 px-4">{item.price.toFixed(2)} ر.س</td>
                          <td className="py-2 px-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleDecreaseQuantity(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span>{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleIncreaseQuantity(item.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="py-2 px-4">{(item.price * item.quantity).toFixed(2)} ر.س</td>
                          <td className="py-2 px-4">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Right Column - Checkout */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">الفاتورة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي:</span>
                  <span>{subtotal.toFixed(2)} ر.س</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الخصم (%):</span>
                  <Input 
                    type="number" 
                    className="w-24" 
                    value={discountPercent} 
                    onChange={(e) => setDiscountPercent(Number(e.target.value))} 
                  />
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">المجموع:</span>
                  <span className="font-bold">{total.toFixed(2)} ر.س</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">طريقة الدفع</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant={paymentMethod === "cash" ? "default" : "outline"} 
                    onClick={() => setPaymentMethod("cash")}
                    className="flex-1"
                  >
                    <BanknoteIcon className="h-4 w-4 mr-2" />
                    نقدي
                  </Button>
                  <Button 
                    variant={paymentMethod === "card" ? "default" : "outline"} 
                    onClick={() => setPaymentMethod("card")}
                    className="flex-1"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    بطاقة
                  </Button>
                  <Button 
                    variant={paymentMethod === "transfer" ? "default" : "outline"} 
                    onClick={() => setPaymentMethod("transfer")}
                    className="flex-1"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    تحويل
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={cart.length === 0}
                  onClick={handleCompleteSale}
                >
                  تأكيد البيع
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled={cart.length === 0}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  طباعة الفاتورة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
