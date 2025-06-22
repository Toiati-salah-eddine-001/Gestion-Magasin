<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'total_price' => 'decimal:2',
        ];
    }

    /**
     * Get the sale this item belongs to
     */
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    /**
     * Get the product for this sale item
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Calculate profit for this item
     */
    public function getProfit(): float
    {
        if (!$this->product || !$this->product->cost_price) {
            return 0;
        }
        
        return ($this->unit_price - $this->product->cost_price) * $this->quantity;
    }
}
