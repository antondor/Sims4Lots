<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\Request;
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
                'avatar'     => $request->user()->avatar,
                'avatar_url' => $request->user()->avatar_url,
            ],
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();

        $user->name  = $request->string('name');
        $user->email = $request->string('email');

        if ($request->filled('current_password') || $request->filled('password')) {
            if (! $request->filled('current_password') || ! Hash::check($request->input('current_password'), $user->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }
            if (! $request->filled('password')) {
                return back()->withErrors(['password' => 'New password is required.']);
            }
            $user->password = $request->input('password');
        }

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');

            $ext  = $file->getClientOriginalExtension();
            $name = Str::uuid().'.'.$ext;
            $dir  = "avatars/{$user->id}";

            if ($user->avatar && !str_starts_with($user->avatar, 'http') && !str_contains($user->avatar, '/')) {
                Storage::disk('s3')->delete("$dir/{$user->avatar}");
            }
            if ($user->avatar && str_contains($user->avatar, '/')) {
                Storage::disk('s3')->delete($user->avatar);
            }

            Storage::disk('s3')->putFileAs($dir, $file, $name);

            $user->avatar = $name;
        }

        $user->save();

        return redirect()->route('profile.edit')->with('success', 'Profile updated.');
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
