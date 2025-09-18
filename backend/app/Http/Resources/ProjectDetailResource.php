<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectDetailResource extends JsonResource
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
            'request_id' => $this->request_id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'duration_days' => $this->getDurationInDays(),
            'milestones' => $this->milestones,
            'risk_assessment' => $this->risk_assessment,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}