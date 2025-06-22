<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    /**
     * Display a listing of sales
     */
    public function index(Request $request)
    {
        $query = Sale::with(['user', 'saleItems.product']);

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment method
        if ($request->has('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Search by invoice number
        if ($request->has('search')) {
            $query->where('invoice_number', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $sales = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $sales
        ]);
    }

    /**
     * Store a newly created sale
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'payment_method' => 'required|in:cash,card,transfer',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Calculate totals
            $subtotal = 0;
            $saleItems = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Check stock availability
                if ($product->quantity < $item['quantity']) {
                    throw new \Exception("المنتج '{$product->name}' غير متوفر بالكمية المطلوبة. المتوفر: {$product->quantity}");
                }

                $unitPrice = $product->price;
                $totalPrice = $unitPrice * $item['quantity'];
                $subtotal += $totalPrice;

                $saleItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ];
            }

            // Calculate discount
            $discountPercent = $request->discount_percent ?? 0;
            $discountAmount = ($subtotal * $discountPercent) / 100;
            $total = $subtotal - $discountAmount;

            // Create sale
            $sale = Sale::create([
                'user_id' => $request->user()->id,
                'invoice_number' => Sale::generateInvoiceNumber(),
                'subtotal' => $subtotal,
                'discount_percent' => $discountPercent,
                'discount_amount' => $discountAmount,
                'total' => $total,
                'payment_method' => $request->payment_method,
                'status' => 'completed',
                'notes' => $request->notes,
            ]);

            // Create sale items and update stock
            foreach ($saleItems as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                ]);

                // Reduce product stock
                $item['product']->reduceStock($item['quantity']);
            }

            DB::commit();

            // Load relationships for response
            $sale->load(['user', 'saleItems.product']);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الفاتورة بنجاح',
                'data' => $sale
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified sale
     */
    public function show(Sale $sale)
    {
        $sale->load(['user', 'saleItems.product']);

        return response()->json([
            'success' => true,
            'data' => $sale
        ]);
    }

    /**
     * Update sale status
     */
    public function updateStatus(Request $request, Sale $sale)
    {
        $request->validate([
            'status' => 'required|in:completed,pending,cancelled',
        ]);

        $oldStatus = $sale->status;
        $newStatus = $request->status;

        // Handle stock adjustments when changing status
        if ($oldStatus === 'completed' && $newStatus === 'cancelled') {
            // Return items to stock
            foreach ($sale->saleItems as $item) {
                $item->product->increaseStock($item->quantity);
            }
        } elseif ($oldStatus === 'cancelled' && $newStatus === 'completed') {
            // Remove items from stock
            foreach ($sale->saleItems as $item) {
                if (!$item->product->reduceStock($item->quantity)) {
                    return response()->json([
                        'success' => false,
                        'message' => "المنتج '{$item->product->name}' غير متوفر بالكمية المطلوبة"
                    ], 400);
                }
            }
        }

        $sale->update(['status' => $newStatus]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة الفاتورة بنجاح',
            'data' => $sale
        ]);
    }

    /**
     * Get sales statistics
     */
    public function statistics(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $stats = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->completed()
            ->selectRaw('
                COUNT(*) as total_sales,
                SUM(total) as total_revenue,
                AVG(total) as average_sale,
                SUM(discount_amount) as total_discounts
            ')
            ->first();

        // Payment method breakdown
        $paymentMethods = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->completed()
            ->selectRaw('payment_method, COUNT(*) as count, SUM(total) as total')
            ->groupBy('payment_method')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $stats,
                'payment_methods' => $paymentMethods,
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]
            ]
        ]);
    }
}
