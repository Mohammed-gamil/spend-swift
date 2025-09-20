<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseRequestStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Adjust authorization logic as needed
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ];
    }
}