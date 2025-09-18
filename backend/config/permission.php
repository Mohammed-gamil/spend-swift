<?php

return [

    'models' => [

        /*
        |--------------------------------------------------------------------------
        | Permission Model
        |--------------------------------------------------------------------------
        |
        | When using the "HasPermissions" trait from this package, we need to know which
        | Eloquent model should be used to retrieve your permissions. Of course, it
        | is often just the "Permission" model but you may use whatever you like.
        |
        | The model you want to use as a Permission model needs to implement the
        | `Spatie\Permission\Contracts\Permission` contract.
        |
        */

        'permission' => Spatie\Permission\Models\Permission::class,

        /*
        |--------------------------------------------------------------------------
        | Role Model
        |--------------------------------------------------------------------------
        |
        | When using the "HasRoles" trait from this package, we need to know which
        | Eloquent model should be used to retrieve your roles. Of course, it
        | is often just the "Role" model but you may use whatever you like.
        |
        | The model you want to use as a Role model needs to implement the
        | `Spatie\Permission\Contracts\Role` contract.
        |
        */

        'role' => Spatie\Permission\Models\Role::class,

    ],

    'table_names' => [

        /*
        |--------------------------------------------------------------------------
        | Users Table
        |--------------------------------------------------------------------------
        |
        | The table that your application uses for users. This table's model will
        | be using the "HasRoles" and "HasPermissions" traits.
        |
        */

        'users' => 'users',

        /*
        |--------------------------------------------------------------------------
        | Roles Table
        |--------------------------------------------------------------------------
        |
        | When using the "HasRoles" trait from this package, we need to know which
        | table should be used to retrieve your roles. We have chosen a basic
        | default value but you may easily change it to any table you like.
        |
        */

        'roles' => 'roles',

        /*
        |--------------------------------------------------------------------------
        | Permissions Table
        |--------------------------------------------------------------------------
        |
        | When using the "HasPermissions" trait from this package, we need to know which
        | table should be used to retrieve your permissions. We have chosen a basic
        | default value but you may easily change it to any table you like.
        |
        */

        'permissions' => 'permissions',

        /*
        |--------------------------------------------------------------------------
        | Model has permissions table
        |--------------------------------------------------------------------------
        |
        | When using the "HasRoles" trait from this package, we need to know which
        | table should be used to retrieve your models permissions. We have chosen a
        | basic default value but you may easily change it to any table you like.
        |
        */

        'model_has_permissions' => 'model_has_permissions',

        /*
        |--------------------------------------------------------------------------
        | Model has roles table
        |--------------------------------------------------------------------------
        |
        | When using the "HasRoles" trait from this package, we need to know which
        | table should be used to retrieve your model roles. We have chosen a
        | basic default value but you may easily change it to any table you like.
        |
        */

        'model_has_roles' => 'model_has_roles',

        /*
        |--------------------------------------------------------------------------
        | Role has permissions table
        |--------------------------------------------------------------------------
        |
        | When using the "HasRoles" trait from this package, we need to know which
        | table should be used to retrieve roles permissions. We have chosen a
        | basic default value but you may easily change it to any table you like.
        |
        */

        'role_has_permissions' => 'role_has_permissions',
    ],

    'column_names' => [
        /*
        |--------------------------------------------------------------------------
        | User Foreign Key on Permission and Role Model
        |--------------------------------------------------------------------------
        |
        | When using the "HasRoles" and "HasPermissions" traits from this package,
        | we need to know which foreign key to use when attaching these models to
        | users. Here you may change the name of that foreign key for each model.
        |
        */

        'model_morph_key' => 'model_id',
    ],

    /*
    |--------------------------------------------------------------------------
    | Teams Feature
    |--------------------------------------------------------------------------
    |
    | When using the "HasTeams" trait from this package, you may specify if
    | the package should make use of the teams feature. By default we don't!
    |
    */

    'teams' => false,

    /*
    |--------------------------------------------------------------------------
    | Cache
    |--------------------------------------------------------------------------
    |
    | By default all permissions are cached for 24 hours to speed up performance.
    | When permissions or roles are updated the cache is flushed automatically.
    |
    */

    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString('24 hours'),

        'key' => 'spatie.permission.cache',

        'model_key' => 'name',

        'store' => 'default',
    ],
];