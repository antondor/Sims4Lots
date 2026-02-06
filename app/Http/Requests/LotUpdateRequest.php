<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LotUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name'          => ['required','string','max:255'],
            'description'   => ['nullable','string','max:65535'],
            'gallery_id'    => ['nullable','string','max:255'],
            'creator_link'  => ['nullable','url','max:255'],
            'download_link' => ['nullable','url','max:255'],
            'lot_size'      => ['required','in:20x15,30x20,40x30,50x50,64x64'],
            'content_type'  => ['required','in:CC,NoCC'],
            'furnishing'    => ['required','in:Furnished,Unfurnished'],
            'lot_type'      => ['required','in:Residential,Community'],
            'bedrooms'      => ['nullable','integer','min:0','max:50'],
            'bathrooms'     => ['nullable','integer','min:0','max:50'],
        ];
    }
}
