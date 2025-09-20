<?php

namespace App\States\PurchaseRequest;

use App\States\PurchaseRequest\PurchaseRequestState as State;
use Spatie\ModelStates\StateConfig;

class RejectedByManager extends State
{
    public static string $name = 'rejected_by_manager';

    public function canTransitionTo($newState, ...$transitionArgs): bool
    {
        // Rejected is terminal in our simple workflow
        return false;
    }

    public static function config(): StateConfig
    {
        return parent::config();
    }
}