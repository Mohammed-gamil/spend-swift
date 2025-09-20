<?php

namespace App\States\PurchaseRequest;

use App\States\PurchaseRequest\PurchaseRequestState as State;
use Spatie\ModelStates\StateConfig;

class Completed extends State
{
    public static string $name = 'completed';

    public function canTransitionTo($newState, ...$transitionArgs): bool
    {
        return false; // Terminal state
    }

    public static function config(): StateConfig
    {
        return parent::config();
    }
}