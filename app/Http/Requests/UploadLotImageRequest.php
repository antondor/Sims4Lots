<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadLotImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        // здесь можно проверять, что текущий пользователь имеет право трогать этот лот
        // пока вернём true, чтобы не падало
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'max:5120'], // 5MB
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
