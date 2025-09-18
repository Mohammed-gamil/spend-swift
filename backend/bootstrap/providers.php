<?php

return [
    App\Providers\AppServiceProvider::class,
    Tymon\JWTAuth\Providers\LaravelServiceProvider::class,
    App\Providers\JwtFixServiceProvider::class,
    Spatie\Permission\PermissionServiceProvider::class,
];
