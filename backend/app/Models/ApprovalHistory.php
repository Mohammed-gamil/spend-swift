<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprovalHistory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'request_id',
        'approver_id',
        'status',
        'comments',
    ];

    /**
     * Get the request that owns the approval history.
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class);
    }

    /**
     * Get the user who performed the approval action.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    /**
     * Check if the approval was an approval.
     *
     * @return bool
     */
    public function isApproval(): bool
    {
        return $this->status === 'APPROVED';
    }

    /**
     * Check if the approval was a rejection.
     *
     * @return bool
     */
    public function isRejection(): bool
    {
        return $this->status === 'REJECTED';
    }

    /**
     * Check if the approval was a return for more information.
     *
     * @return bool
     */
    public function isReturn(): bool
    {
        return $this->status === 'RETURNED';
    }
}