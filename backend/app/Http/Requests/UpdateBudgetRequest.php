<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBudgetRequest extends FormRequest
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
        $budgetId = $this->route('budget')->id;

        return [
            'department_id' => 'sometimes|exists:departments,id',
            'fiscal_year' => [
                'sometimes',
                'integer',
                'min:2020',
                'max:' . (date('Y') + 5),
                // Ensure no duplicate budget for same department/year (except this record)
                Rule::unique('budgets')->where(function ($query) {
                    $departmentId = $this->department_id ?? $this->route('budget')->department_id;
                    return $query->where('department_id', $departmentId)
                                 ->where('fiscal_year', $this->fiscal_year);
                })->ignore($budgetId),
            ],
            'total_amount' => 'sometimes|numeric|min:0',
            'spent_amount' => 'sometimes|numeric|min:0',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Ensure total_amount is greater than or equal to spent_amount
            $totalAmount = $this->total_amount ?? $this->route('budget')->total_amount;
            $spentAmount = $this->spent_amount ?? $this->route('budget')->spent_amount;
            
            if ($spentAmount > $totalAmount) {
                $validator->errors()->add('spent_amount', 'The spent amount cannot exceed the total budget amount.');
            }
        });
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
        ];
    }
}