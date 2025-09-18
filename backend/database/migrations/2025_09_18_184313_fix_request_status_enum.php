<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change status column to varchar temporarily
        Schema::table('requests', function (Blueprint $table) {
            $table->string('status')->default('DRAFT')->change();
        });
        
        // Update any existing invalid statuses
        DB::table('requests')->whereNotIn('status', [
            'DRAFT', 'SUBMITTED', 'DM_APPROVED', 'QUOTES_REQUESTED', 
            'QUOTE_SELECTED', 'AWAITING_FINAL_APPROVAL', 'ACCT_APPROVED', 
            'FINAL_APPROVED', 'FUNDS_TRANSFERRED', 'REJECTED', 'RETURNED'
        ])->update(['status' => 'DRAFT']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This will revert back to the previous enum format if needed
        Schema::table('requests', function (Blueprint $table) {
            $table->enum('status', [
                'DRAFT', 'SUBMITTED', 'DM_APPROVED', 'ACCT_APPROVED', 
                'FINAL_APPROVED', 'FUNDS_TRANSFERRED', 'REJECTED', 'RETURNED'
            ])->default('DRAFT')->change();
        });
    }
};
