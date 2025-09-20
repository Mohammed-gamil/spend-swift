<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PriceOffer;

class PriceOfferPolicy
{
    public function create(User $user)
    {
        // Only users with the 'accountant' role can create price offers
        return $user->hasRole('accountant') || $user->hasRole('admin');
    }

    public function view(User $user, PriceOffer $offer)
    {
        // Owner (accountant who created it), admin, or PR owner can view
        return $user->hasRole('admin') || $user->id === $offer->accountant_id || $user->id === $offer->purchaseRequest->user_id;
    }

    public function accept(User $user, PriceOffer $offer)
    {
        // Only the owner of the purchase request (the requesting user) can accept
        return $user->id === $offer->purchaseRequest->user_id || $user->hasRole('admin');
    }

    public function delete(User $user, PriceOffer $offer)
    {
        // Allow admin or the accountant who created it to delete
        return $user->hasRole('admin') || $user->id === $offer->accountant_id;
    }
}
