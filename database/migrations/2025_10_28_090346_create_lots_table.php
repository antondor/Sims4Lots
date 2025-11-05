<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('name');
            $table->string('description')->nullable();
            $table->integer('favorites_count')->nullable();
            $table->string('creator_id')->nullable();
            $table->string('creator_link')->nullable();
            $table->string('download_link')->nullable();
            $table->enum('lot_size', ['20x15','30x20','40x30','50x50','64x64']);
            $table->enum('content_type', ['CC','NoCC']);
            $table->enum('furnishing', ['Furnished','Unfurnished']);
            $table->enum('lot_type', ['Residential','Community']);
            $table->tinyInteger('bedrooms')->nullable();
            $table->tinyInteger('bathrooms')->nullable();
            $table->enum('status', ['pending','confirmed','invalid'])
                ->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('lot_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lot_id')
                ->constrained('lots')
                ->onDelete('cascade');
            $table->string('filename');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['lot_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lot_images');
        Schema::dropIfExists('lots');
    }
};
