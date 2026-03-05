<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Expand the allowed values for the lot_size enum on the lots table
        DB::statement("
            ALTER TABLE lots
            MODIFY COLUMN lot_size ENUM(
                '20x15',
                '20x20',
                '30x20',
                '30x30',
                '40x20',
                '40x30',
                '40x40',
                '50x40',
                '50x50',
                '64x64'
            ) NOT NULL
        ");
    }

    public function down(): void
    {
        // Revert back to the original enum values
        DB::statement("
            ALTER TABLE lots
            MODIFY COLUMN lot_size ENUM(
                '20x15',
                '30x20',
                '40x30',
                '50x50',
                '64x64'
            ) NOT NULL
        ");
    }
};

