<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lot;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

class SearchHeaderController extends Controller
{
    public function search(Request $request)
    {
        // 1. Получаем и очищаем запрос
        $query = $request->string('q')->trim();

        // 2. Быстрая проверка длины
        if ($query->length() < 2) {
            return response()->json(['users' => [], 'lots' => []]);
        }

        // Приводим к строке для SQL
        $searchTerm = "%{$query}%";

        // 3. Поиск Лотов (Lots)
        $lots = Lot::query()
            ->select(['id', 'name', 'updated_at']) // Выбираем только нужное
            ->where('name', 'LIKE', $searchTerm) // Для Postgres используйте 'ILIKE'
            ->with(['images' => fn($q) => $q->select('lot_id', 'url', 'position')->orderBy('position')->limit(1)])
            ->orderByDesc('updated_at')
            ->limit(8)
            ->get()
            ->map(fn(Lot $lot) => [
                'id'        => $lot->id,
                'name'      => $lot->name,
                'cover_url' => $lot->images->first()?->url ?? asset('images/lot-placeholder.jpg'),
            ]);

        // 4. Поиск Пользователей (Users)
        $users = User::query()
            ->select(['id', 'name', 'avatar', 'about', 'created_at', 'last_seen_at', 'is_online']) // Убедитесь, что все поля для Accessor-ов тут есть
            ->where('name', 'LIKE', $searchTerm) // Для Postgres используйте 'ILIKE'
            ->orderBy('name')
            ->limit(20)
            ->get()
            ->map(fn(User $user) => [
                'id'           => $user->id,
                'name'         => $user->name,
                'avatar_url'   => $user->avatar_url, // Используем Accessor модели
                'about'        => $user->about,
                'short_about'  => $user->short_about, // Используем Accessor модели
                'created_at'   => $user->created_at?->toIso8601String(),
                'last_seen_at' => $user->last_seen_at?->toIso8601String(),
                'is_online'    => $user->is_online,
            ]);

        return response()->json([
            'users' => $users,
            'lots'  => $lots
        ]);
    }
}
