<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (! Schema::hasColumn('users', 'billing_rfc')) {
                    $table->string('billing_rfc', 13)->nullable();
                }
                if (! Schema::hasColumn('users', 'billing_business_name')) {
                    $table->string('billing_business_name', 180)->nullable();
                }
                if (! Schema::hasColumn('users', 'billing_regime')) {
                    $table->string('billing_regime', 10)->nullable();
                }
                if (! Schema::hasColumn('users', 'billing_cfdi_use')) {
                    $table->string('billing_cfdi_use', 10)->default('G03');
                }
                if (! Schema::hasColumn('users', 'billing_zip_code')) {
                    $table->string('billing_zip_code', 10)->nullable();
                }
            });
        }

        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (! Schema::hasColumn('orders', 'invoice_whatsapp_count')) {
                    $table->unsignedInteger('invoice_whatsapp_count')->default(0);
                }
                if (! Schema::hasColumn('orders', 'invoice_requested_at')) {
                    $table->timestamp('invoice_requested_at')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $cols = array_filter([
                    'billing_rfc',
                    'billing_business_name',
                    'billing_regime',
                    'billing_cfdi_use',
                    'billing_zip_code',
                ], fn($c) => Schema::hasColumn('users', $c));
                if (! empty($cols)) {
                    $table->dropColumn($cols);
                }
            });
        }

        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                $cols = array_filter([
                    'invoice_whatsapp_count',
                    'invoice_requested_at',
                ], fn($c) => Schema::hasColumn('orders', $c));
                if (! empty($cols)) {
                    $table->dropColumn($cols);
                }
            });
        }
    }
};
