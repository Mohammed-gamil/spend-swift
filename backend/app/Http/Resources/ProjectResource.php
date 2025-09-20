<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'user' => new UserResource($this->whenLoaded('user')),
            'manager' => new UserResource($this->whenLoaded('manager')),
            'accountant' => new UserResource($this->whenLoaded('accountant')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}