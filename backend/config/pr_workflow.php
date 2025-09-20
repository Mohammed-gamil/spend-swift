<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Purchase Request Workflow Configuration
    |--------------------------------------------------------------------------
    |
    | Toggle whether the application should use the spatie model-states
    | implementation for PurchaseRequest status transitions. In constrained
    | test environments the model-states auto-discovery can be fragile, so
    | the default for tests should remain false. Set the environment
    | variable `PR_USE_MODEL_STATES=true` in non-test environments to enable
    | state objects and transitions.
    |
    */

    'use_model_states' => env('PR_USE_MODEL_STATES', false),
];
