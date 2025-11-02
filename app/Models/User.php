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
        ];
    }

    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar && preg_match('~^https?://~i', $this->avatar)) {
            return $this->avatar;
        }

        if ($this->avatar && str_contains($this->avatar, '/')) {
            return Storage::disk('s3')->url($this->avatar);
        }

        if ($this->avatar) {
            return Storage::disk('s3')->url("avatars/{$this->id}/{$this->avatar}");
        }

        // ← плейсхолдер из public/
        return asset('images/profile_avatar_placeholder.png');
    }

    public function favoriteLots()
    {
        return $this->belongsToMany(Lot::class, 'favorites')->withTimestamps();
    }
}
