<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Models\Lot;
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
        return Inertia::render('profile/edit', [
            'user' => [
                'id'         => $request->user()->id,
                'name'       => $request->user()->name,
                'email'      => $request->user()->email,
                'about'      => $request->user()->about,
                'avatar'     => $request->user()->avatar,
                'avatar_url' => $request->user()->avatar_url,
                'external_url' => $request->user()->external_url,
                'sims_gallery_id' => $request->user()->sims_gallery_id,
            ],
        ]);
    }

    public function show(Request $request)
    {
        $user = $request->user();

        $lotsCount        = Lot::where('user_id', $user->id)->count();
        $favouritesCount  = $user->favoriteLots()->count();

        $latestLots = Lot::query()
            ->where('user_id', $user->id)
            ->with(['images', 'user'])
            ->withCount(['favoritedBy as favorites_count'])
            ->when($request->user(), fn ($q) => $q->withFavorited($user->id))
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('profile/show', [
            'user' => $user->only([
                'id','name','avatar_url','about','external_url','sims_gallery_id','created_at'
            ]),
            'stats' => [
                'lots'        => $lotsCount,
                'favourites'  => $favouritesCount,
            ],
            'latestLots' => $latestLots,
            'isOwner'    => true,
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $fillable = ['name', 'email', 'about', 'external_url', 'sims_gallery_id'];
        $user->fill(Arr::only($data, $fillable));

        if (!empty($data['password'])) {
            if (empty($data['current_password']) || !Hash::check($data['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.'])->withInput();
            }
            $user->password = Hash::make($data['password']);
        }

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $ext  = $file->getClientOriginalExtension();
            $name = Str::uuid().'.'.$ext;
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
        if (! $user->avatar) {
            return back();
        }

        if (str_starts_with($user->avatar, 'http')) {

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
