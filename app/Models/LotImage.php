<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class LotImage extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'lot_id',
        'url',
        'position',
    ];

    public function lot()
    {
        return $this->belongsTo(Lot::class);
    }
}
