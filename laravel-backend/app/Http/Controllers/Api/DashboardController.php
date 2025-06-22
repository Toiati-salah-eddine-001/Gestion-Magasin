<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index(Request $request)
    {
        // Today's sales
        $todaySales = Sale::today()->completed()->sum('total');
        $todaySalesCount = Sale::today()->completed()->count();
        
        // Yesterday's sales for comparison
        $yesterdaySales = Sale::whereDate('created_at', today()->subDay())
            ->completed()
            ->sum('total');
        
        // Calculate percentage change
        $salesChange = 0;
        if ($yesterdaySales > 0) {
            $salesChange = (($todaySales - $yesterdaySales) / $yesterdaySales) * 100;
        } elseif ($todaySales > 0) {
            $salesChange = 100;
        }

        // Low stock products
        $lowStockCount = Product::lowStock()->active()->count();
        
        // Pending orders (assuming pending sales)
        $pendingOrders = Sale::where('status', 'pending')->count();
        
        // Total products
        $totalProducts = Product::active()->sum('quantity');
        
        // Recent sales for activity feed
        $recentSales = Sale::with(['user', 'saleItems.product'])
            ->completed()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'total' => $sale->total,
                    'user_name' => $sale->user->name,
                    'items_count' => $sale->saleItems->count(),
                    'created_at' => $sale->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Low stock products details
        $lowStockProducts = Product::lowStock()
            ->active()
            ->select('id', 'name', 'quantity', 'min_stock_level')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'today_sales' => [
                        'amount' => $todaySales,
                        'count' => $todaySalesCount,
                        'change_percent' => round($salesChange, 1),
                    ],
                    'low_stock_count' => $lowStockCount,
                    'pending_orders' => $pendingOrders,
                    'total_products' => $totalProducts,
                ],
                'recent_sales' => $recentSales,
                'low_stock_products' => $lowStockProducts,
            ]
        ]);
    }

    /**
     * Get sales chart data for the last 7 days
     */
    public function salesChart(Request $request)
    {
        $days = $request->get('days', 7);
        
        $salesData = Sale::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subDays($days))
            ->completed()
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Fill missing dates with zero values
        $chartData = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayData = $salesData->firstWhere('date', $date);
            
            $chartData[] = [
                'date' => $date,
                'total' => $dayData ? $dayData->total : 0,
                'count' => $dayData ? $dayData->count : 0,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $chartData
        ]);
    }

    /**
     * Get top selling products
     */
    public function topProducts(Request $request)
    {
        $limit = $request->get('limit', 10);
        
        $topProducts = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.status', 'completed')
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(sale_items.quantity) as total_sold'),
                DB::raw('SUM(sale_items.total_price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $topProducts
        ]);
    }
}
