<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        // Filter by low stock
        if ($request->get('low_stock') === 'true') {
            $query->lowStock();
        }

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->get('active') === 'true');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products,
            'meta' => [
                'total_products' => Product::active()->count(),
                'low_stock_count' => Product::lowStock()->active()->count(),
                'total_value' => Product::active()->get()->sum(function ($product) {
                    return $product->quantity * $product->price;
                }),
            ]
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'barcode' => 'required|string|unique:products,barcode',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'min_stock_level' => 'nullable|integer|min:0',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'barcode' => $request->barcode,
            'quantity' => $request->quantity,
            'price' => $request->price,
            'cost_price' => $request->cost_price,
            'description' => $request->description,
            'min_stock_level' => $request->min_stock_level ?? 10,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة المنتج بنجاح',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified product
     */
    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'barcode' => [
                'required',
                'string',
                Rule::unique('products', 'barcode')->ignore($product->id)
            ],
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'min_stock_level' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $product->update([
            'name' => $request->name,
            'barcode' => $request->barcode,
            'quantity' => $request->quantity,
            'price' => $request->price,
            'cost_price' => $request->cost_price,
            'description' => $request->description,
            'min_stock_level' => $request->min_stock_level ?? $product->min_stock_level,
            'is_active' => $request->is_active ?? $product->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث المنتج بنجاح',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified product
     */
    public function destroy(Product $product)
    {
        // Soft delete by setting is_active to false
        $product->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المنتج بنجاح'
        ]);
    }

    /**
     * Search products by barcode or name
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:1',
        ]);

        $query = $request->get('query');
        
        $products = Product::active()
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('barcode', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get product by barcode
     */
    public function getByBarcode(Request $request)
    {
        $request->validate([
            'barcode' => 'required|string',
        ]);

        $product = Product::active()
            ->where('barcode', $request->barcode)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'المنتج غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Update product stock
     */
    public function updateStock(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer',
            'operation' => 'required|in:add,subtract,set',
        ]);

        $quantity = $request->quantity;
        $operation = $request->operation;

        switch ($operation) {
            case 'add':
                $product->increaseStock($quantity);
                break;
            case 'subtract':
                if (!$product->reduceStock($quantity)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'الكمية المطلوبة غير متوفرة في المخزون'
                    ], 400);
                }
                break;
            case 'set':
                $product->update(['quantity' => $quantity]);
                break;
        }

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث المخزون بنجاح',
            'data' => $product->fresh()
        ]);
    }
}
