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
        Schema::table('users', function (Blueprint \) {
            if (!Schema::hasColumn('users', 'position')) {
                \->string('position')->nullable()->after('language_preference');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                \->string('phone')->nullable()->after('position');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint \) {
            \->dropColumn(['position', 'phone']);
        });
    }
};
