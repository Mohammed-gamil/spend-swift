<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseRequestUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Adjust authorization logic as needed
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
        ];
    }
}