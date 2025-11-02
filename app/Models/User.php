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
        $avatar = $this->avatar;

        // 1) Уже абсолютный?
        if ($avatar && (str_starts_with($avatar, 'http://') || str_starts_with($avatar, 'https://'))) {
            return $avatar;
        }

        // 2) Относительный путь (например, "avatars/1/xxx.png" или "storage/xxx.png")
        if ($avatar && str_contains($avatar, '/')) {
            // если это файл в s3 /avatars/{id}/..., вернём полный URL
            return Storage::disk('s3')->url($avatar);
        }

        // 3) Только имя файла => лежит в S3: avatars/{id}/{filename}
        if ($avatar) {
            return Storage::disk('s3')->url("avatars/{$this->id}/{$avatar}");
        }

        // Плейсхолдер из public
        return asset('images/profile_avatar_placeholder.png');
    }

    public function favoriteLots()
    {
        return $this->belongsToMany(Lot::class, 'favorites')->withTimestamps();
    }
}
