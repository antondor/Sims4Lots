<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name'  => ['required','string','max:255'],
            'email' => ['required','email','max:255', Rule::unique('users','email')->ignore($userId)],
            'current_password'      => ['nullable','string'],
            'password'              => ['nullable','string','min:6','max:255','confirmed'],
            'password_confirmation' => ['nullable','string'],
            'avatar' => ['nullable','image','mimes:jpg,jpeg,png,webp','max:4096'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already taken.',
            'password.confirmed' => 'Password confirmation does not match.',
            'avatar.image' => 'Avatar must be an image.',
            'avatar.mimes' => 'Supported formats: JPG, JPEG, PNG, WEBP.',
            'avatar.max' => 'Avatar must be no larger than 4 MB.',
        ];
    }
}
