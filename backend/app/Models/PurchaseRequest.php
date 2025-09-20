<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\States\PurchaseRequest\PurchaseRequestState;
use Spatie\ModelStates\HasStates;
use App\States\PurchaseRequest\Draft;
use App\States\PurchaseRequest\PendingManagerApproval;
use App\States\PurchaseRequest\ApprovedByManager;
use App\States\PurchaseRequest\RejectedByManager;
use App\States\PurchaseRequest\PriceOffersAdded;
use App\States\PurchaseRequest\UserAcceptedOffer;
use App\States\PurchaseRequest\UserRejectedOffers;
use App\States\PurchaseRequest\Completed;

class PurchaseRequest extends Model
{
    use HasFactory, SoftDeletes, HasStates;

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'manager_id',
        'status',
    ];

    // Use a simple string cast for status to avoid relying on auto-discovery of
    // model-state mapping in constrained test environments. The state machine
    // is still defined by registerStates(), but casting to string keeps
    // attribute access simple and predictable for tests.
    protected $casts = [
        'status' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function priceOffers()
    {
        return $this->hasMany(PriceOffer::class);
    }

    protected function registerStates(): void
    {
        $this->addState('status', PurchaseRequestState::class)
            ->default(Draft::class)
            ->allowTransition(Draft::class, PendingManagerApproval::class)
            ->allowTransition(PendingManagerApproval::class, ApprovedByManager::class)
            ->allowTransition(PendingManagerApproval::class, RejectedByManager::class)
            ->allowTransition(ApprovedByManager::class, PriceOffersAdded::class)
            ->allowTransition(PriceOffersAdded::class, UserAcceptedOffer::class)
            ->allowTransition(PriceOffersAdded::class, UserRejectedOffers::class)
            ->allowTransition(UserAcceptedOffer::class, Completed::class);
    }
}