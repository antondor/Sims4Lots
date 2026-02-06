<?php

namespace App\Models;

use App\Models\Concerns\Favoritable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lot extends Model
{
    use HasFactory, SoftDeletes, Favoritable;

    protected $fillable = [
        'user_id','name','description','creator_link','download_link',
        'gallery_id', 'lot_size','content_type','furnishing','lot_type','bedrooms','bathrooms',
        'status','rejection_reason',
    ];

    protected $casts = [
        'is_favorited' => 'boolean',
    ];

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function images()
    {
        return $this->hasMany(LotImage::class);
    }

    public function coverImage()
    {
        return $this->hasOne(LotImage::class)->orderBy('position');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeConfirmed($q)
    {
        return $q->where('status', 'confirmed');
    }

    public function scopePending($q)
    {
        return $q->where('status', 'pending');
    }
}
