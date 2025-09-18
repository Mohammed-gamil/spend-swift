<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled via permissions
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'department_id' => 'required|exists:departments,id',
            'type' => 'required|in:purchase,project',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'total_cost' => 'required|numeric|min:0',
        ];

        // Additional validation rules based on request type
        if ($this->input('type') === 'purchase') {
            $rules['items'] = 'required|array|min:1';
            $rules['items.*.name'] = 'required|string|max:255';
            $rules['items.*.description'] = 'nullable|string';
            $rules['items.*.quantity'] = 'required|integer|min:1';
            $rules['items.*.unit_price'] = 'required|numeric|min:0';
        } elseif ($this->input('type') === 'project') {
            $rules['project_detail.start_date'] = 'required|date|after_or_equal:today';
            $rules['project_detail.end_date'] = 'required|date|after:project_detail.start_date';
            $rules['project_detail.milestones'] = 'required|array|min:1';
            $rules['project_detail.milestones.*.title'] = 'required|string|max:255';
            $rules['project_detail.milestones.*.description'] = 'nullable|string';
            $rules['project_detail.milestones.*.due_date'] = 'required|date|after_or_equal:project_detail.start_date|before_or_equal:project_detail.end_date';
            $rules['project_detail.risk_assessment'] = 'required|string';
        }

        return $rules;
    }
}