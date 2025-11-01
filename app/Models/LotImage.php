<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class LotImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lot_id',
        'filename',
        'position',
    ];

    protected $appends = ['url'];

    public function lot()
    {
        return $this->belongsTo(Lot::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('s3')->url($this->key());
    }

    public function key(): string
    {
        return "images/lots/{$this->lot_id}/{$this->filename}";
    }
}
