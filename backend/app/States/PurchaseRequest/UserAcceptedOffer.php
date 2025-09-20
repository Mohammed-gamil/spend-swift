<?php

namespace App\States\PurchaseRequest;

use App\States\PurchaseRequest\PurchaseRequestState as State;
use Spatie\ModelStates\StateConfig;

class UserAcceptedOffer extends State
{
    public static string $name = 'user_accepted_offer';

    public function canTransitionTo($newState, ...$transitionArgs): bool
    {
        $stateClass = is_object($newState) ? get_class($newState) : $newState;
        return $stateClass === Completed::class || $stateClass === Completed::getMorphClass();
    }

    public static function config(): StateConfig
    {
        return parent::config();
    }
}