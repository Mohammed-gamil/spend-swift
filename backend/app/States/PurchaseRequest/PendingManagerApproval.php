<?php

namespace App\States\PurchaseRequest;

use App\States\PurchaseRequest\PurchaseRequestState as State;
use Spatie\ModelStates\StateConfig;

class PendingManagerApproval extends State
{
    public static string $name = 'pending_manager_approval';

    public function canTransitionTo($newState, ...$transitionArgs): bool
    {
        $stateClass = is_object($newState) ? get_class($newState) : $newState;

        return in_array($stateClass, [ApprovedByManager::class, RejectedByManager::class, ApprovedByManager::getMorphClass(), RejectedByManager::getMorphClass()], true);
    }

    public static function config(): StateConfig
    {
        return parent::config();
    }
}