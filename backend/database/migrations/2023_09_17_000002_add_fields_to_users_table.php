<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add the department_id after initial user creation
            // to avoid circular reference issues
            $table->foreignId('department_id')->nullable()->after('password')->constrained()->onDelete('set null');
            $table->foreignId('direct_manager_id')->nullable()->after('department_id')->references('id')->on('users')->onDelete('set null');
            $table->string('language_preference')->default('en')->after('direct_manager_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['direct_manager_id']);
            $table->dropColumn(['department_id', 'direct_manager_id', 'language_preference']);
        });
    }
};