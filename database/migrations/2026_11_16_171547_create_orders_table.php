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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 32)->unique(); // Ej. SC-20261122-8F4A
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Estados desacoplados para pasarela de pagos y operación en tienda
            $table->string('status', 30)->default('pending'); // pending, preparing, ready_for_pickup, completed, cancelled
            $table->string('payment_status', 30)->default('unpaid'); // unpaid, pending, paid, failed, refunded
            $table->string('payment_provider', 40)->nullable(); // cash_on_pickup, stripe, mercadopago, conekta
            $table->string('payment_reference', 120)->nullable()->index(); // ID de sesión / PaymentIntent de la pasarela

            // Modalidad de entrega en Cancún
            $table->string('delivery_method', 30)->default('pickup'); // pickup (sucursal), local_delivery
            $table->string('pickup_code', 12)->nullable(); // Código corto para entregar en mostrador

            // Totales calculados estrictamente en servidor (MXN)
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax_amount', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('currency', 3)->default('MXN');

            // Cumplimiento fiscal SAT (CFDI 4.0) y legal
            $table->boolean('requires_invoice')->default(false);
            $table->json('billing_data')->nullable();
            $table->timestamp('accepted_policies_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
