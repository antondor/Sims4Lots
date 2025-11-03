<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lot extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'creator_id',
        'creator_link',
        'download_link',
        'lot_size',
        'content_type',
        'furnishing',
        'lot_type',
        'bedrooms',
        'bathrooms',
    ];

    public function images()
    {
        return $this->hasMany(LotImage::class)->orderBy('position');
    }

    public function coverImage()
    {
        return $this->hasOne(LotImage::class)->orderBy('position');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }
}
