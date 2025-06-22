<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'المدير العام',
            'email' => 'admin@store.com',
            'password' => Hash::make('password123'),
            'role' => 'مدير',
            'is_active' => true,
            'is_admin' => true,
        ]);

        // Create sales employee
        User::create([
            'name' => 'أحمد محمد',
            'email' => 'sales@store.com',
            'password' => Hash::make('password123'),
            'role' => 'موظف مبيعات',
            'is_active' => true,
        ]);

        // Create warehouse keeper
        User::create([
            'name' => 'سارة أحمد',
            'email' => 'warehouse@store.com',
            'password' => Hash::make('password123'),
            'role' => 'أمين مخزن',
            'is_active' => true,
        ]);

        // Create accountant
        User::create([
            'name' => 'محمد علي',
            'email' => 'accountant@store.com',
            'password' => Hash::make('password123'),
            'role' => 'محاسب',
            'is_active' => true,
        ]);
    }
}
