<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Repositories\PurchaseRequestRepository;
use App\Repositories\Contracts\PurchaseRequestRepositoryInterface;
use App\Repositories\ProjectRepository;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Models\PurchaseRequest;
use App\Policies\PurchaseRequestPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repository interfaces to implementations
    $this->app->bind(PurchaseRequestRepositoryInterface::class, PurchaseRequestRepository::class);
    // Bind project repository so controllers/services can be resolved when artisan commands run
    $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Super-admin shortcut: also register a Gate::before here to ensure
        // admin bypass works even if AuthServiceProvider is not auto-registered.
        Gate::before(function (?User $user, $ability) {
            if ($user && method_exists($user, 'hasRole') && $user->hasRole('admin')) {
                return true;
            }
        });

        // Register model policies
        Gate::policy(PurchaseRequest::class, PurchaseRequestPolicy::class);
    }
}
