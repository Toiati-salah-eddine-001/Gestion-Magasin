<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Get sales reports
     */
    public function salesReport(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());
        $groupBy = $request->get('group_by', 'day'); // day, week, month

        // Sales over time
        $salesOverTime = $this->getSalesOverTime($startDate, $endDate, $groupBy);

        // Top selling products
        $topProducts = $this->getTopSellingProducts($startDate, $endDate, 10);

        // Payment method breakdown
        $paymentMethods = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->completed()
            ->selectRaw('payment_method, COUNT(*) as count, SUM(total) as total')
            ->groupBy('payment_method')
            ->get();

        // Summary statistics
        $summary = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->completed()
            ->selectRaw('
                COUNT(*) as total_sales,
                SUM(total) as total_revenue,
                AVG(total) as average_sale,
                SUM(discount_amount) as total_discounts,
                MAX(total) as highest_sale,
                MIN(total) as lowest_sale
            ')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'sales_over_time' => $salesOverTime,
                'top_products' => $topProducts,
                'payment_methods' => $paymentMethods,
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]
            ]
        ]);
    }

    /**
     * Get inventory reports
     */
    public function inventoryReport(Request $request)
    {
        // Current stock levels
        $stockLevels = Product::active()
            ->selectRaw('
                COUNT(*) as total_products,
                SUM(quantity) as total_quantity,
                SUM(quantity * price) as total_value,
                SUM(CASE WHEN quantity <= min_stock_level THEN 1 ELSE 0 END) as low_stock_count
            ')
            ->first();

        // Low stock products
        $lowStockProducts = Product::lowStock()
            ->active()
            ->select('id', 'name', 'quantity', 'min_stock_level', 'price')
            ->orderBy('quantity', 'asc')
            ->limit(20)
            ->get();

        // Top products by value
        $topValueProducts = Product::active()
            ->selectRaw('id, name, quantity, price, (quantity * price) as total_value')
            ->orderByRaw('(quantity * price) DESC')
            ->limit(10)
            ->get();

        // Stock movement (products sold in the last 30 days)
        $stockMovement = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.created_at', '>=', now()->subDays(30))
            ->where('sales.status', 'completed')
            ->selectRaw('
                products.id,
                products.name,
                products.quantity as current_stock,
                SUM(sale_items.quantity) as sold_quantity,
                AVG(sale_items.unit_price) as avg_selling_price
            ')
            ->groupBy('products.id', 'products.name', 'products.quantity')
            ->orderBy('sold_quantity', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stock_levels' => $stockLevels,
                'low_stock_products' => $lowStockProducts,
                'top_value_products' => $topValueProducts,
                'stock_movement' => $stockMovement,
            ]
        ]);
    }

    /**
     * Get profit and loss reports
     */
    public function profitLossReport(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        // Get sales with profit calculations
        $salesData = Sale::with('saleItems.product')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->completed()
            ->get();

        $totalRevenue = 0;
        $totalCost = 0;
        $totalProfit = 0;

        foreach ($salesData as $sale) {
            $totalRevenue += $sale->total;
            
            foreach ($sale->saleItems as $item) {
                if ($item->product && $item->product->cost_price) {
                    $itemCost = $item->product->cost_price * $item->quantity;
                    $totalCost += $itemCost;
                }
            }
        }

        $totalProfit = $totalRevenue - $totalCost;
        $profitMargin = $totalRevenue > 0 ? ($totalProfit / $totalRevenue) * 100 : 0;

        // Profit by product
        $profitByProduct = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->where('sales.status', 'completed')
            ->whereNotNull('products.cost_price')
            ->selectRaw('
                products.id,
                products.name,
                SUM(sale_items.quantity) as total_sold,
                SUM(sale_items.total_price) as total_revenue,
                SUM(products.cost_price * sale_items.quantity) as total_cost,
                SUM(sale_items.total_price - (products.cost_price * sale_items.quantity)) as total_profit
            ')
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_profit', 'desc')
            ->limit(20)
            ->get();

        // Monthly profit trend
        $monthlyProfit = $this->getMonthlyProfitTrend($startDate, $endDate);

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_revenue' => $totalRevenue,
                    'total_cost' => $totalCost,
                    'total_profit' => $totalProfit,
                    'profit_margin' => round($profitMargin, 2),
                ],
                'profit_by_product' => $profitByProduct,
                'monthly_trend' => $monthlyProfit,
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]
            ]
        ]);
    }

    /**
     * Get sales over time based on grouping
     */
    private function getSalesOverTime($startDate, $endDate, $groupBy)
    {
        $dateFormat = match ($groupBy) {
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        return Sale::whereBetween('created_at', [$startDate, $endDate])
            ->completed()
            ->selectRaw("
                DATE_FORMAT(created_at, '{$dateFormat}') as period,
                COUNT(*) as sales_count,
                SUM(total) as total_revenue
            ")
            ->groupBy('period')
            ->orderBy('period')
            ->get();
    }

    /**
     * Get top selling products
     */
    private function getTopSellingProducts($startDate, $endDate, $limit = 10)
    {
        return DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->where('sales.status', 'completed')
            ->selectRaw('
                products.id,
                products.name,
                SUM(sale_items.quantity) as total_sold,
                SUM(sale_items.total_price) as total_revenue
            ')
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get monthly profit trend
     */
    private function getMonthlyProfitTrend($startDate, $endDate)
    {
        return DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->where('sales.status', 'completed')
            ->whereNotNull('products.cost_price')
            ->selectRaw('
                DATE_FORMAT(sales.created_at, "%Y-%m") as month,
                SUM(sale_items.total_price) as revenue,
                SUM(products.cost_price * sale_items.quantity) as cost,
                SUM(sale_items.total_price - (products.cost_price * sale_items.quantity)) as profit
            ')
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }
}
