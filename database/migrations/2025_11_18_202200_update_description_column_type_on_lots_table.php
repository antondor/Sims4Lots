<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lots', function (Blueprint $table) {
            DB::statement('ALTER TABLE lots MODIFY description TEXT NULL');
        });
    }

    public function down(): void
    {
        Schema::table('lots', function (Blueprint $table) {
            DB::statement('ALTER TABLE lots MODIFY description VARCHAR(255) NULL');
        });
    }
};
