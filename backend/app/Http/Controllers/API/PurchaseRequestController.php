<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\PurchaseRequestStoreRequest;
use App\Http\Requests\PurchaseRequestUpdateRequest;
use App\Http\Resources\PurchaseRequestResource;
use App\Services\PurchaseRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseRequestController extends Controller
{
    protected $service;

    public function __construct(PurchaseRequestService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $purchaseRequests = $this->service->getAll();
        // PurchaseRequestResource::collection handles pagination automatically when passed a LengthAwarePaginator
        return response()->json(PurchaseRequestResource::collection($purchaseRequests));
    }

    public function store(PurchaseRequestStoreRequest $request): JsonResponse
    {
        $this->authorize('create', \App\Models\PurchaseRequest::class);
        $purchaseRequest = $this->service->createPurchaseRequest($request->validated());
        return (new PurchaseRequestResource($purchaseRequest))->response()->setStatusCode(201);
    }

    public function show(int $id): JsonResponse
    {
        $purchaseRequest = $this->service->getById($id);

        if (!$purchaseRequest) {
            return response()->json(['message' => 'Purchase Request not found'], 404);
        }

        return response()->json(new PurchaseRequestResource($purchaseRequest));
    }

    public function update(PurchaseRequestUpdateRequest $request, int $id): JsonResponse
    {
        $purchaseRequest = $this->service->getById($id);
        if (!$purchaseRequest) {
            return response()->json(['message' => 'Purchase Request not found'], 404);
        }
        $this->authorize('update', $purchaseRequest);

        $purchaseRequest = $this->service->updatePurchaseRequest($id, $request->validated());

        if (!$purchaseRequest) {
            return response()->json(['message' => 'Purchase Request not found'], 404);
        }

        return (new PurchaseRequestResource($purchaseRequest))->response();
    }

    public function destroy(int $id): JsonResponse
    {
        $purchaseRequest = $this->service->getById($id);
        if (!$purchaseRequest) {
            return response()->json(['message' => 'Purchase Request not found'], 404);
        }
        $this->authorize('delete', $purchaseRequest);

        $deleted = $this->service->deletePurchaseRequest($id);

        if (!$deleted) {
            return response()->json(['message' => 'Purchase Request not found'], 404);
        }

        return response()->json(['message' => 'Purchase Request deleted successfully']);
    }

    public function approve(int $id): JsonResponse
    {
        $purchaseRequest = $this->service->getById($id);
        if (!$purchaseRequest) {
            return response()->json(['message' => 'Purchase Request not found'], 404);
        }

        $this->authorize('approve', $purchaseRequest);

        $this->service->approveByManager($purchaseRequest, auth()->id());

        return response()->json(['message' => 'Purchase Request approved']);
    }

    public function reject(int $id): JsonResponse
    {
        $purchaseRequest = $this->service->getById($id);
        if (!$purchaseRequest) {
            return response()->json(['message' => 'Purchase Request not found'], 404);
        }

        $this->authorize('approve', $purchaseRequest);

        $this->service->rejectByManager($purchaseRequest, auth()->id());

        return response()->json(['message' => 'Purchase Request rejected']);
    }
}