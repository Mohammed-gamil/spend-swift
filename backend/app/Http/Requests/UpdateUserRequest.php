<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled via middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => 'sometimes|string|min:8|confirmed',
            'department_id' => 'nullable|exists:departments,id',
            'direct_manager_id' => [
                'nullable',
                'exists:users,id',
                // Prevent circular reference - user can't be their own manager
                Rule::notIn([$userId]),
            ],
            'language_preference' => 'nullable|string|in:en,ar',
            'roles' => 'sometimes|array',
            'roles.*' => 'exists:roles,name',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'direct_manager_id.not_in' => 'A user cannot be their own manager.',
        ];
    }
}