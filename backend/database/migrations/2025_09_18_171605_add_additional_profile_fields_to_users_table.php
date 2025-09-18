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
            // Add bio field
            if (!Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable()->after('phone');
            }
            
            // Add avatar field
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('bio');
            }
            
            // Add timezone preference
            if (!Schema::hasColumn('users', 'timezone')) {
                $table->string('timezone')->default('UTC')->after('avatar');
            }
            
            // Add date format preference
            if (!Schema::hasColumn('users', 'date_format')) {
                $table->string('date_format')->default('Y-m-d')->after('timezone');
            }
            
            // Add currency preference
            if (!Schema::hasColumn('users', 'currency')) {
                $table->string('currency')->default('USD')->after('date_format');
            }
            
            // Add notification preferences (JSON field)
            if (!Schema::hasColumn('users', 'notification_preferences')) {
                $table->json('notification_preferences')->nullable()->after('currency');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'bio',
                'avatar',
                'timezone',
                'date_format',
                'currency',
                'notification_preferences'
            ]);
        });
    }
};
