<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PriceOfferResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'description' => $this->description,
            'status' => $this->status,
            'purchase_request' => new PurchaseRequestResource($this->whenLoaded('purchaseRequest')),
            'accountant' => new UserResource($this->whenLoaded('accountant')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}