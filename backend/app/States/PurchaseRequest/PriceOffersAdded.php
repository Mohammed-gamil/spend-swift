<?php

namespace App\States\PurchaseRequest;

use App\States\PurchaseRequest\PurchaseRequestState as State;
use Spatie\ModelStates\StateConfig;

class PriceOffersAdded extends State
{
    public static string $name = 'price_offers_added';

    public function canTransitionTo($newState, ...$transitionArgs): bool
    {
        $stateClass = is_object($newState) ? get_class($newState) : $newState;

        return in_array($stateClass, [UserAcceptedOffer::class, UserRejectedOffers::class, UserAcceptedOffer::getMorphClass(), UserRejectedOffers::getMorphClass()], true);
    }

    public static function config(): StateConfig
    {
        return parent::config();
    }
}