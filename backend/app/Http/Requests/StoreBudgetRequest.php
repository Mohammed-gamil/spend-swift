<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBudgetRequest extends FormRequest
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
        return [
            'department_id' => 'required|exists:departments,id',
            'fiscal_year' => [
                'required',
                'integer',
                'min:2020',
                'max:' . (date('Y') + 5),
                // Ensure no duplicate budget for same department/year
                Rule::unique('budgets')->where(function ($query) {
                    return $query->where('department_id', $this->department_id)
                                 ->where('fiscal_year', $this->fiscal_year);
                }),
            ],
            'total_amount' => 'required|numeric|min:0',
            'spent_amount' => 'sometimes|numeric|min:0|lte:total_amount',
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
            'fiscal_year.unique' => 'A budget for this department and fiscal year already exists.',
            'spent_amount.lte' => 'The spent amount cannot exceed the total budget amount.',
        ];
    }
}