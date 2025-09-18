<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled via permissions and policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $request = $this->route('request');

        $rules = [
            'department_id' => 'sometimes|exists:departments,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'total_cost' => 'sometimes|numeric|min:0',
        ];

        // Type cannot be changed after creation
        if ($request->type === 'purchase') {
            $rules['items'] = 'sometimes|array|min:1';
            $rules['items.*.id'] = 'sometimes|exists:request_items,id';
            $rules['items.*.name'] = 'required|string|max:255';
            $rules['items.*.description'] = 'nullable|string';
            $rules['items.*.quantity'] = 'required|integer|min:1';
            $rules['items.*.unit_price'] = 'required|numeric|min:0';
        } elseif ($request->type === 'project') {
            $rules['project_detail.start_date'] = 'sometimes|date';
            $rules['project_detail.end_date'] = 'sometimes|date|after:project_detail.start_date';
            $rules['project_detail.milestones'] = 'sometimes|array|min:1';
            $rules['project_detail.milestones.*.title'] = 'required|string|max:255';
            $rules['project_detail.milestones.*.description'] = 'nullable|string';
            $rules['project_detail.milestones.*.due_date'] = 'required|date|after_or_equal:project_detail.start_date|before_or_equal:project_detail.end_date';
            $rules['project_detail.risk_assessment'] = 'sometimes|string';
        }

        return $rules;
    }
}