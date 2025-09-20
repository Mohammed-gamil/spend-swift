<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Make role_id nullable to allow creating users without explicit role_id during seeding/tests
        DB::statement('ALTER TABLE `users` MODIFY `role_id` BIGINT UNSIGNED NULL');
    }

    public function down(): void
    {
        // Revert to NOT NULL if needed (may fail if NULLs exist)
        DB::statement('ALTER TABLE `users` MODIFY `role_id` BIGINT UNSIGNED NOT NULL');
    }
};
