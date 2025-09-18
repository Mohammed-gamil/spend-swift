<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditTrail extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'loggable_type',
        'loggable_id',
        'old_values',
        'new_values',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    /**
     * Get the user who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the loggable model.
     */
    public function loggable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope a query to only include audit trails for a specific model.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  Model  $model
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForModel($query, Model $model)
    {
        return $query->where('loggable_type', get_class($model))
                     ->where('loggable_id', $model->id);
    }

    /**
     * Scope a query to only include audit trails by a specific user.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include audit trails with a specific action.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $action
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithAction($query, $action)
    {
        return $query->where('action', $action);
    }
}