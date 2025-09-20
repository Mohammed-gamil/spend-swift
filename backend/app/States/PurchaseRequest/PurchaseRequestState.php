<?php

namespace App\States\PurchaseRequest;

use Spatie\ModelStates\State;

/**
 * Base state class for PurchaseRequest state machine.
 * Placing a base abstract state in the same directory as concrete states
 * allows the model-states package to auto-discover state classes.
 */
abstract class PurchaseRequestState extends State
{
    // Intentionally empty - concrete states extend this class.
}
