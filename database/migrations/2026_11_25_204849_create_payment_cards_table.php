<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('holder_name', 120);
            $table->string('brand', 30); // visa, mastercard, amex
            $table->string('bank_name', 80)->nullable();
            $table->string('last4', 4);
            $table->string('exp_month', 2);
            $table->string('exp_year', 4);
            $table->boolean('is_default')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_cards');
    }
};
