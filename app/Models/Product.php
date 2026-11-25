<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'sku',
        'is_new',
        'is_active'
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];
    // Dentro de app/Models/Product.php
    protected $appends = ['is_recently_new'];

    public function getIsRecentlyNewAttribute(): bool
    {
        if (! $this->is_new) {
            return false;
        }

        if (! $this->created_at) {
            return true;
        }

        return $this->created_at->greaterThanOrEqualTo(now()->subDays(14));
    }
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function favoredBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }
}
