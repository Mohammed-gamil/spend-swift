<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Tymon\JWTAuth\Factory;

class JwtFixServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register bindings
        $this->app->extend('tymon.jwt.factory', function ($factory, $app) {
            // Get the TTL value from config and ensure it's an integer
            $ttl = $app['config']->get('jwt.ttl');
            if (!is_null($ttl)) {
                // Cast TTL to integer to avoid the string type issue
                $ttl = (int) $ttl;
                $factory->setTTL($ttl);
            }
            
            return $factory;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}