<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'department_id' => $this->department_id,
            'department' => $this->whenLoaded('department', function() {
                return new DepartmentResource($this->department);
            }),
            'fiscal_year' => $this->fiscal_year,
            'total_amount' => $this->total_amount,
            'spent_amount' => $this->spent_amount,
            'remaining_amount' => $this->getRemainingAmount(),
            'percentage_spent' => $this->getPercentageSpent(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}