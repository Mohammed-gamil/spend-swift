<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceQuote extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'request_id',
        'vendor_name',
        'vendor_contact',
        'vendor_email',
        'vendor_phone',
        'quote_amount',
        'quote_details',
        'quote_file_path',
        'validity_date',
        'payment_terms',
        'delivery_time',
        'is_selected',
        'notes',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quote_amount' => 'decimal:2',
        'validity_date' => 'date',
        'is_selected' => 'boolean',
    ];

    /**
     * Get the request that owns this quote.
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class);
    }

    /**
     * Get the user who created this quote.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include selected quotes.
     */
    public function scopeSelected($query)
    {
        return $query->where('is_selected', true);
    }

    /**
     * Scope a query to only include quotes for a specific request.
     */
    public function scopeForRequest($query, $requestId)
    {
        return $query->where('request_id', $requestId);
    }

    /**
     * Scope a query to only include valid quotes (not expired).
     */
    public function scopeValid($query)
    {
        return $query->where('validity_date', '>=', now());
    }

    /**
     * Check if this quote is selected.
     *
     * @return bool
     */
    public function isSelected(): bool
    {
        return $this->is_selected;
    }

    /**
     * Check if this quote is still valid.
     *
     * @return bool
     */
    public function isValid(): bool
    {
        return $this->validity_date >= now();
    }

    /**
     * Mark this quote as selected.
     *
     * @return void
     */
    public function markAsSelected(): void
    {
        // Unselect all other quotes for the same request
        self::where('request_id', $this->request_id)
            ->where('id', '!=', $this->id)
            ->update(['is_selected' => false]);

        // Select this quote
        $this->is_selected = true;
        $this->save();
    }
}
