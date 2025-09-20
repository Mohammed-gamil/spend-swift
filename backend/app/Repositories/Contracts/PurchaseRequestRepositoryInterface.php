<?php

namespace App\Repositories\Contracts;

use App\Models\PurchaseRequest;
use Illuminate\Support\Collection;

interface PurchaseRequestRepositoryInterface
{
    public function getAll(): Collection;

    public function getById(int $id): ?PurchaseRequest;

    public function create(array $data): PurchaseRequest;

    public function findById(int $id): ?PurchaseRequest;

    public function update(PurchaseRequest $purchaseRequest, array $data): bool;

    public function delete(PurchaseRequest $purchaseRequest): bool;
}