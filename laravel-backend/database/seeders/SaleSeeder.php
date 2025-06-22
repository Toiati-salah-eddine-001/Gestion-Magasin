<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        // Create sample sales for the last 30 days
        for ($i = 0; $i < 50; $i++) {
            $user = $users->random();
            $saleDate = now()->subDays(rand(0, 30));
            
            // Create sale
            $sale = Sale::create([
                'user_id' => $user->id,
                'invoice_number' => 'INV' . $saleDate->format('Ymd') . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'subtotal' => 0, // Will be calculated
                'discount_percent' => rand(0, 20),
                'discount_amount' => 0, // Will be calculated
                'total' => 0, // Will be calculated
                'payment_method' => ['cash', 'card', 'transfer'][rand(0, 2)],
                'status' => 'completed',
                'notes' => $i % 5 == 0 ? 'عميل VIP' : null,
                'created_at' => $saleDate,
                'updated_at' => $saleDate,
            ]);

            // Add random products to the sale
            $numItems = rand(1, 5);
            $subtotal = 0;

            for ($j = 0; $j < $numItems; $j++) {
                $product = $products->random();
                $quantity = rand(1, 3);
                $unitPrice = $product->price;
                $totalPrice = $unitPrice * $quantity;
                $subtotal += $totalPrice;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                    'created_at' => $saleDate,
                    'updated_at' => $saleDate,
                ]);
            }

            // Update sale totals
            $discountAmount = ($subtotal * $sale->discount_percent) / 100;
            $total = $subtotal - $discountAmount;

            $sale->update([
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'total' => $total,
            ]);
        }
    }
}
