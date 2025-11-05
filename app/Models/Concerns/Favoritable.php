<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

trait Favoritable
{
    public function scopeWithFavorited(Builder $query, ?int $userId): Builder
    {
        if (!$userId) {
            return $query->addSelect(DB::raw('0 as is_favorited'));
        }

        return $query->addSelect([
            'is_favorited' => function ($q) use ($userId) {
                $q->from('favorites')
                  ->selectRaw('1')
                  ->whereColumn('favorites.lot_id', 'lots.id')
                  ->where('favorites.user_id', $userId)
                  ->limit(1);
            }
        ]);
    }
}
