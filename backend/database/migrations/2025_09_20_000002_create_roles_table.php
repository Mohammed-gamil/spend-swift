<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    public function up(): void
    {
        // Avoid creating duplicate tables if Spatie's migration already created them.
        if (! Schema::hasTable('roles')) {
            Schema::create('roles', function (Blueprint $table) {
                $table->bigIncrements('id'); // use bigIncrements to match Spatie's migration
                $table->string('name')->unique();
                $table->string('guard_name');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
}