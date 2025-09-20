<?php

namespace App\Repositories;

use App\Models\PurchaseRequest;
use App\Repositories\Contracts\PurchaseRequestRepositoryInterface;

class PurchaseRequestRepository implements PurchaseRequestRepositoryInterface
{
    public function getAll(): \Illuminate\Support\Collection
    {
        return PurchaseRequest::with(['user','manager','priceOffers'])->paginate(20);
    }

    public function getById(int $id): ?PurchaseRequest
    {
        return PurchaseRequest::find($id);
    }
    public function create(array $data): PurchaseRequest
    {
        $pr = PurchaseRequest::create($data);
        return $pr->fresh();
    }

    public function findById(int $id): ?PurchaseRequest
    {
        return PurchaseRequest::find($id);
    }

    public function update(PurchaseRequest $purchaseRequest, array $data): bool
    {
        $result = $purchaseRequest->update($data);
        if ($result) {
            $purchaseRequest->refresh();
        }
        return $result;
    }

    public function delete(PurchaseRequest $purchaseRequest): bool
    {
        return $purchaseRequest->delete();
    }
}