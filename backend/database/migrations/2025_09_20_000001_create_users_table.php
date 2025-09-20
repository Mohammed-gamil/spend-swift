<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateUsersTable extends Migration
{
    public function up(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('users');
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            // make role_id nullable to avoid FK ordering issues during automated testing/migrations
            $table->unsignedBigInteger('role_id')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        // Add foreign key constraint only if roles table already exists
        if (Schema::hasTable('roles')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}