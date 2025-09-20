<?php

namespace App\States\PurchaseRequest;

use App\States\PurchaseRequest\PurchaseRequestState as State;
use Spatie\ModelStates\StateConfig;

class UserRejectedOffers extends State
{
    public static string $name = 'user_rejected_offers';

    public function canTransitionTo($newState, ...$transitionArgs): bool
    {
        return false; // Terminal state
    }

    public static function config(): StateConfig
    {
        return parent::config();
    }
}