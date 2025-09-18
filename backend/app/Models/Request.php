<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Request extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'requester_id',
        'department_id',
        'type',
        'status',
        'title',
        'description',
        'total_cost',
        'submitted_at',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
        'total_cost' => 'decimal:2',
    ];

    /**
     * Get the requester for this request.
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    /**
     * Alias for requester (backward compatibility).
     */
    public function user(): BelongsTo
    {
        return $this->requester();
    }

    /**
     * Get the department for this request.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the items for this request.
     */
    public function items(): HasMany
    {
        return $this->hasMany(RequestItem::class);
    }

    /**
     * Get the project details for this request.
     */
    public function projectDetail(): HasOne
    {
        return $this->hasOne(ProjectDetail::class);
    }

    /**
     * Get the approval history for this request.
     */
    public function approvalHistory(): HasMany
    {
        return $this->hasMany(ApprovalHistory::class);
    }

    /**
     * Get the price quotes for this request.
     */
    public function priceQuotes(): HasMany
    {
        return $this->hasMany(PriceQuote::class);
    }

    /**
     * Get the selected price quote for this request.
     */
    public function selectedQuote(): HasOne
    {
        return $this->hasOne(PriceQuote::class)->where('is_selected', true);
    }

    /**
     * Get the attachments for this request.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    /**
     * Scope a query to only include requests with a specific status.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include requests of a specific type.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to include requests submitted by a specific user.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSubmittedBy($query, $userId)
    {
        return $query->where('requester_id', $userId);
    }

    /**
     * Check if the request is in draft status.
     *
     * @return bool
     */
    public function isDraft(): bool
    {
        return $this->status === 'DRAFT';
    }

    /**
     * Check if the request has been submitted.
     *
     * @return bool
     */
    public function isSubmitted(): bool
    {
        return $this->status !== 'DRAFT' && $this->status !== 'CANCELLED';
    }

    /**
     * Check if the request is of type purchase.
     *
     * @return bool
     */
    public function isPurchase(): bool
    {
        return $this->type === 'purchase';
    }

    /**
     * Check if the request is of type project.
     *
     * @return bool
     */
    public function isProject(): bool
    {
        return $this->type === 'project';
    }

    /**
     * Check if the request can be edited.
     *
     * @return bool
     */
    public function canBeEdited(): bool
    {
        return in_array($this->status, ['DRAFT', 'RETURNED']);
    }

    /**
     * Get the total amount for this request.
     *
     * @return float
     */
    public function getTotalAmount(): float
    {
        return (float) $this->total_cost;
    }

    /**
     * Check if the request can be approved by a specific user.
     *
     * @param  User  $user
     * @return bool
     */
    public function canBeApprovedBy(User $user): bool
    {
        // This logic will be implemented in a service class
        // We'll just check if the user has the appropriate role for now
        if ($this->status === 'SUBMITTED' && $user->hasRole('DIRECT_MANAGER')) {
            return true;
        }

        if ($this->status === 'DM_APPROVED' && $user->hasRole('ACCOUNTANT')) {
            return true;
        }

        if ($this->status === 'ACCT_APPROVED' && $user->hasRole('FINAL_MANAGER')) {
            return true;
        }

        return false;
    }
}