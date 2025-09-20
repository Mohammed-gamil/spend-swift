<?php

namespace App\States\PurchaseRequest;

use App\States\PurchaseRequest\PurchaseRequestState as State;
use Spatie\ModelStates\StateConfig;

class ApprovedByManager extends State
{
    public static string $name = 'approved_by_manager';

    public function canTransitionTo($newState, ...$transitionArgs): bool
    {
        $stateClass = is_object($newState) ? get_class($newState) : $newState;
        return $stateClass === PriceOffersAdded::class || $stateClass === PriceOffersAdded::getMorphClass();
    }

    public static function config(): StateConfig
    {
        return parent::config();
    }
}