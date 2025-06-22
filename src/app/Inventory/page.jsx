'use client';

import { MainLayout } from "@/components/layout/MainLayout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit, Trash2, AlertTriangle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import productsApi from "@/lib/api/products";


export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchError, setFetchError] = useState("");

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const response = await productsApi.getProducts({ search: searchQuery });
      // Defensive: ensure products is always an array
      const data = response?.data?.data || response?.data || [];
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(response?.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
      setLoading(false);
    } catch (error) {
      setProducts([]);
      setLoading(false);
      setFetchError(
        error?.message || error?.error || "فشل في جلب المنتجات. حاول مرة أخرى."
      );
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  // Toggle form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    barcode: ""
  });

  // Calculate dynamic values
  const totalProducts = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockProducts = products.filter(product => product.quantity <= 10).length;
  const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);

  // Add product function
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.quantity && newProduct.price && newProduct.barcode) {
      try {
        await productsApi.createProduct({
          name: newProduct.name,
          quantity: parseInt(newProduct.quantity),
          price: parseFloat(newProduct.price),
          barcode: newProduct.barcode,
          min_stock_level: 10
        });
        
        console.log("Product added successfully");
        
        fetchProducts();
        setNewProduct({ name: "", quantity: "", price: "", barcode: "" });
        setShowAddForm(false);
      } catch (error) {
        console.error(error.message || "Failed to add product");
      }
    }
  };

  // Toggle form function
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setNewProduct({ name: "", quantity: "", price: "", barcode: "" });
  };

  // Delete function
  const handleDelete = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await productsApi.deleteProduct(productId);
        console.log("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        console.error(error.message || "Failed to delete product");
      }
    }
  };

  // Edit function
  const handleEdit = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newName = prompt("Modifier le nom du produit :", product.name);
      const newQuantity = prompt("Modifier la quantité :", product.quantity);
      const newPrice = prompt("Modifier le prix :", product.price);
      const newBarcode = prompt("Modifier le code-barres :", product.barcode);

      if (newName && newQuantity && newPrice && newBarcode) {
        try {
          await productsApi.updateProduct(productId, {
            name: newName,
            quantity: parseInt(newQuantity),
            price: parseFloat(newPrice),
            barcode: newBarcode
          });
          
          console.log("Product updated successfully");
          
          fetchProducts();
        } catch (error) {
          console.error(error.message || "Failed to update product");

        }
      }
    }
  };
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des stocks</h1>
          <Button className="gap-2" onClick={toggleAddForm}>
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? "Annuler" : "Ajouter un nouveau produit"}
          </Button>
        </div>

        {/* Error message for fetching products */}
        {fetchError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            <span>خطأ: {fetchError}</span>
          </div>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un nouveau produit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Nom du produit</Label>
                    <Input
                      id="productName"
                      type="text"
                      placeholder="Entrez le nom du produit"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Code-barres</Label>
                    <Input
                      id="barcode"
                      type="text"
                      placeholder="Entrez le code-barres"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Entrez la quantité"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      required
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="Entrez le prix"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Ajouter le produit</Button>
                  <Button type="button" variant="outline" onClick={toggleAddForm}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total des produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Alertes de stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Valeur du stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalValue.toLocaleString()} €</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <Input 
              placeholder="بحث عن منتج..." 
              className="max-w-sm" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                <TableRow key={product.id} className={product.quantity <= 10 ? "bg-yellow-50" : ""}>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <span className={product.quantity <= 10 ? "text-yellow-600 font-semibold" : ""}>
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{product.price} ر.س</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(product.id)}
                        title="تعديل المنتج"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        title="حذف المنتج"
                        className="hover:bg-red-50 hover:text-red-600"
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
    </MainLayout>
  );
}
