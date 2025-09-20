<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Policies\PurchaseRequestPolicy;
use App\Policies\PriceOfferPolicy;
use App\Policies\ProjectPolicy;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Super-admin shortcut
        Gate::before(function (?User $user, $ability) {
            if ($user && $user->hasRole('admin')) {
                return true;
            }
        });

    Gate::policy(\App\Models\PurchaseRequest::class, PurchaseRequestPolicy::class);
    Gate::policy(\App\Models\PriceOffer::class, PriceOfferPolicy::class);
    Gate::policy(\App\Models\Project::class, ProjectPolicy::class);
    }
}
