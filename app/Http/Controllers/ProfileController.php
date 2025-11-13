<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Models\Lot;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user();

        return Inertia::render('profile/edit', [
            'user' => [
                'id'              => $user->id,
                'name'            => $user->name,
                'email'           => $user->email,
                'about'           => $user->about,
                'short_about'     => $user->short_about,
                'avatar'          => $user->avatar,
                'avatar_url'      => $user->avatar_url,
                'external_url'    => $user->external_url,
                'sims_gallery_id' => $user->sims_gallery_id,
                'is_online'       => $user->is_online,
            ],
        ]);
    }

    /**
     * Общий метод отображения профиля любого пользователя
     */
    public function showUser(User $profileOwner, ?User $viewer = null)
    {
        $data = $this->buildProfileData($profileOwner, $viewer);

        return Inertia::render('profile/show', $data);
    }

    /**
     * Свой профиль: /profile
     */
    public function show(Request $request)
    {
        $user   = $request->user();
        $viewer = $user;

        return $this->showUser($user, $viewer);
    }

    /**
     * Вся бизнес-логика профиля в одном месте
     */
    private function buildProfileData(User $profileOwner, ?User $viewer = null): array
    {
        $viewerId = $viewer?->id;

        $lotsCount = Lot::query()
            ->where('user_id', $profileOwner->id)
            ->confirmed()
            ->count();

        $favouritesCount = $profileOwner->favoriteLots()->count();

        $latestLots = Lot::query()
            ->where('user_id', $profileOwner->id)
            ->confirmed()
            ->with(['images', 'user'])
            ->withCount(['favoritedBy as favorites_count'])
            ->when($viewerId, fn ($q) => $q->withFavorited($viewerId))
            ->latest()
            ->take(12)
            ->get();

        $topLot = Lot::query()
            ->where('user_id', $profileOwner->id)
            ->confirmed()
            ->with(['images', 'user'])
            ->withCount(['favoritedBy as favorites_count'])
            ->when($viewerId, fn ($q) => $q->withFavorited($viewerId))
            ->orderByDesc('favorites_count')
            ->orderByDesc('updated_at')
            ->first();

        return [
            'user' => [
                'id'              => $profileOwner->id,
                'name'            => $profileOwner->name,
                'avatar_url'      => $profileOwner->avatar_url,
                'about'           => $profileOwner->about,
                'short_about'     => $profileOwner->short_about,
                'external_url'    => $profileOwner->external_url,
                'sims_gallery_id' => $profileOwner->sims_gallery_id,
                'created_at'      => $profileOwner->created_at?->toIso8601String(),
                'last_seen_at'    => $profileOwner->last_seen_at?->toIso8601String(),
                'is_online'       => $profileOwner->is_online,
            ],
            'stats' => [
                'lots'       => $lotsCount,
                'favourites' => $favouritesCount,
            ],
            'latestLots' => $latestLots,
            'topLot'     => $topLot,
            'isOwner'    => $viewerId !== null && $viewerId === $profileOwner->id,
        ];
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $fillable = ['name', 'email', 'about', 'short_about', 'external_url', 'sims_gallery_id'];
        $user->fill(Arr::only($data, $fillable));

        if (!empty($data['password'])) {
            if (empty($data['current_password']) || !Hash::check($data['current_password'], $user->password)) {
                return back()
                    ->withErrors(['current_password' => 'Current password is incorrect.'])
                    ->withInput();
            }
            $user->password = Hash::make($data['password']);
        }

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $ext  = $file->getClientOriginalExtension();
            $name = Str::uuid() . '.' . $ext;
            $dir  = "avatars/{$user->id}";

            if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
                if (str_contains($user->avatar, '/')) {
                    Storage::disk('s3')->delete($user->avatar);
                } else {
                    Storage::disk('s3')->delete("$dir/{$user->avatar}");
                }
            }

            Storage::disk('s3')->putFileAs($dir, $file, $name);
            $user->avatar = $name;
        }

        $user->save();

        return redirect()->route('profile.show')->with('success', 'Profile updated');
    }

    public function destroyAvatar(Request $request)
    {
        $user = $request->user();
        if (!$user->avatar) {
            return back();
        }

        if (str_starts_with($user->avatar, 'http')) {
            // no-op for remote absolute URL
        } elseif (str_contains($user->avatar, '/')) {
            Storage::disk('s3')->delete($user->avatar);
        } else {
            Storage::disk('s3')->delete("avatars/{$user->id}/{$user->avatar}");
        }

        $user->avatar = null;
        $user->save();

        return back()->with('success', 'Avatar removed.');
    }
}
