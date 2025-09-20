<?php

namespace App\States\PurchaseRequest;

use App\States\PurchaseRequest\PurchaseRequestState as State;
use Spatie\ModelStates\StateConfig;

class Draft extends State
{
    public static string $name = 'draft';

    public function canTransitionTo($newState, ...$transitionArgs): bool
    {
        $stateClass = is_object($newState) ? get_class($newState) : $newState;

        return $stateClass === PendingManagerApproval::class
            || $stateClass === PendingManagerApproval::getMorphClass();
    }

    public static function config(): StateConfig
    {
        return parent::config();
    }
}