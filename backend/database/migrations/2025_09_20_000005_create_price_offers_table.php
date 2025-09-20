<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePriceOffersTable extends Migration
{
    public function up(): void
    {
        Schema::create('price_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_request_id')->constrained('purchase_requests');
            $table->foreignId('accountant_id')->constrained('users');
            $table->decimal('amount', 10, 2);
            $table->text('description')->nullable();
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_offers');
    }
}