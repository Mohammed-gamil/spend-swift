<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE `purchase_requests` MODIFY `status` VARCHAR(255) NOT NULL DEFAULT 'draft'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE `purchase_requests` MODIFY `status` VARCHAR(255) NOT NULL");
    }
};
