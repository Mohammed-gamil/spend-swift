<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseRequestResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            // Some state classes may not implement a `label()` helper. Fall back to string value.
            'status' => is_object($this->status) && method_exists($this->status, 'label')
                ? $this->status->label()
                : (string) $this->status,
            'user' => new UserResource($this->whenLoaded('user')),
            'manager' => new UserResource($this->whenLoaded('manager')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}