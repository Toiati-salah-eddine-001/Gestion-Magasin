<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'كمبيوتر محمول HP',
                'barcode' => '1234567890123',
                'quantity' => 15,
                'price' => 2500.00,
                'cost_price' => 2000.00,
                'description' => 'كمبيوتر محمول HP بمعالج Intel Core i5',
                'min_stock_level' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'هاتف ذكي Samsung Galaxy',
                'barcode' => '2345678901234',
                'quantity' => 25,
                'price' => 1200.00,
                'cost_price' => 950.00,
                'description' => 'هاتف ذكي Samsung Galaxy A54',
                'min_stock_level' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'سماعات لاسلكية AirPods',
                'barcode' => '3456789012345',
                'quantity' => 8,
                'price' => 450.00,
                'cost_price' => 350.00,
                'description' => 'سماعات Apple AirPods Pro',
                'min_stock_level' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'شاحن محمول Anker',
                'barcode' => '4567890123456',
                'quantity' => 50,
                'price' => 120.00,
                'cost_price' => 80.00,
                'description' => 'شاحن محمول Anker 10000mAh',
                'min_stock_level' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'كيبورد لاسلكي Logitech',
                'barcode' => '5678901234567',
                'quantity' => 20,
                'price' => 180.00,
                'cost_price' => 130.00,
                'description' => 'كيبورد لاسلكي Logitech MX Keys',
                'min_stock_level' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'ماوس لاسلكي',
                'barcode' => '6789012345678',
                'quantity' => 30,
                'price' => 85.00,
                'cost_price' => 60.00,
                'description' => 'ماوس لاسلكي بدقة عالية',
                'min_stock_level' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'كابل USB-C',
                'barcode' => '7890123456789',
                'quantity' => 100,
                'price' => 25.00,
                'cost_price' => 15.00,
                'description' => 'كابل USB-C بطول 2 متر',
                'min_stock_level' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'حافظة هاتف',
                'barcode' => '8901234567890',
                'quantity' => 5,
                'price' => 35.00,
                'cost_price' => 20.00,
                'description' => 'حافظة هاتف مقاومة للصدمات',
                'min_stock_level' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'شاشة كمبيوتر 24 بوصة',
                'barcode' => '9012345678901',
                'quantity' => 12,
                'price' => 650.00,
                'cost_price' => 500.00,
                'description' => 'شاشة كمبيوتر LED 24 بوصة Full HD',
                'min_stock_level' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'طابعة HP LaserJet',
                'barcode' => '0123456789012',
                'quantity' => 6,
                'price' => 800.00,
                'cost_price' => 650.00,
                'description' => 'طابعة ليزر HP LaserJet Pro',
                'min_stock_level' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
