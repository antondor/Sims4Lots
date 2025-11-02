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
        'lot_size',
        'content_type',
        'furnishing',
        'lot_type',
        'bedrooms',
        'bathrooms',
    ];

    // Один лот -> много картинок
    public function images()
    {
        return $this->hasMany(LotImage::class)->orderBy('position');
    }

    // Если хочешь быстро получать "обложку" (первая картинка)
    public function coverImage()
    {
        return $this->hasOne(LotImage::class)->orderBy('position');
    }

    // Если у тебя есть App\Models\User (стандартный User из Laravel)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function favoredBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }
}
