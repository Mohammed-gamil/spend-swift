<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'department_id',
        'fiscal_year',
        'total_amount',
        'spent_amount',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_amount' => 'decimal:2',
        'spent_amount' => 'decimal:2',
        'fiscal_year' => 'integer',
    ];

    /**
     * Get the department that owns the budget.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the remaining budget.
     *
     * @return float
     */
    public function getRemainingAmount(): float
    {
        return $this->total_amount - $this->spent_amount;
    }

    /**
     * Get the percentage of budget spent.
     *
     * @return float
     */
    public function getPercentageSpent(): float
    {
        if ($this->total_amount <= 0) {
            return 0;
        }

        return ($this->spent_amount / $this->total_amount) * 100;
    }

    /**
     * Check if there's enough budget for a new request.
     *
     * @param float $amount
     * @return bool
     */
    public function hasEnoughFor(float $amount): bool
    {
        return $this->getRemainingAmount() >= $amount;
    }

    /**
     * Allocate funds from this budget.
     *
     * @param float $amount
     * @return bool
     */
    public function allocateFunds(float $amount): bool
    {
        if (!$this->hasEnoughFor($amount)) {
            return false;
        }

        $this->spent_amount += $amount;
        return $this->save();
    }
}