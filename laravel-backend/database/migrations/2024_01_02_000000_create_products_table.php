<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('barcode')->unique();
            $table->integer('quantity')->default(0);
            $table->decimal('price', 10, 2);
            $table->decimal('cost_price', 10, 2)->nullable(); // For profit calculations
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->integer('min_stock_level')->default(10); // For low stock alerts
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
