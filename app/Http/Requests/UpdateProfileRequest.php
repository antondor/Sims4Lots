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
        $userId = $this->user()?->getKey();

        return [
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],

            'about'          => ['nullable', 'string', 'max:2000'],
            'external_url'   => ['nullable', 'url', 'max:255'],
            'sims_gallery_id'=> ['nullable', 'string', 'max:255'],

            'current_password'      => ['nullable', 'string'],
            'password'              => ['nullable', 'string', 'min:8', 'confirmed', 'different:current_password'],
            'password_confirmation' => ['nullable', 'string'],

            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already taken.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'about'           => $this->string('about')->trim()->value() ?: null,
            'external_url'    => $this->string('external_url')->trim()->value() ?: null,
            'sims_gallery_id' => $this->string('sims_gallery_id')->trim()->value() ?: null,
        ]);
    }
}
