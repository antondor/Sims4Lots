<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'about',
        'short_about',
        'external_url',
        'sims_gallery_id',
        'is_admin',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'bool',
        ];
    }

    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute(): string
    {
        $avatar = $this->avatar;

        if ($avatar && (str_starts_with($avatar, 'http://') || str_starts_with($avatar, 'https://'))) {
            return $avatar;
        }

        if ($avatar && str_contains($avatar, '/')) {
            return Storage::disk('s3')->url($avatar);
        }

        if ($avatar) {
            return Storage::disk('s3')->url("avatars/{$this->id}/{$avatar}");
        }

        return asset('images/profile_avatar_placeholder.png');
    }

    public function favoriteLots()
    {
        return $this->belongsToMany(Lot::class, 'favorites')->withTimestamps();
    }
}
