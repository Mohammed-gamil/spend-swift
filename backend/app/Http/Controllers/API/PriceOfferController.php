<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use App\Models\PriceOffer;
use App\Services\PurchaseRequestService;
use Illuminate\Http\JsonResponse;

class PriceOfferController extends Controller
{
    protected $service;

    public function __construct(PurchaseRequestService $service)
    {
        $this->service = $service;
    }

    public function store(Request $request, int $purchaseRequestId): JsonResponse
    {
        $purchaseRequest = $this->service->getById($purchaseRequestId);
        if (!$purchaseRequest) {
            return response()->json(['message' => 'Purchase Request not found'], 404);
        }

        // Accountant permission check
        if (!auth()->user() || !auth()->user()->hasRole('accountant')) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $offer = PriceOffer::create([
            'purchase_request_id' => $purchaseRequest->id,
            'accountant_id' => auth()->id(),
            'amount' => $data['amount'],
            'description' => $data['description'] ?? null,
            'status' => 'pending',
        ]);

        // Transition PR state to PriceOffersAdded if appropriate
        $this->service->markPriceOffersAdded($purchaseRequest, auth()->id());

        return response()->json($offer, 201);
    }

    public function accept(int $offerId): JsonResponse
    {
        $offer = PriceOffer::find($offerId);
        if (!$offer) {
            return response()->json(['message' => 'Offer not found'], 404);
        }

        $purchaseRequest = $offer->purchaseRequest;

        // Only the creator of the PR can accept offers
        if (auth()->id() !== $purchaseRequest->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Accept the offer
        $offer->status = 'accepted';
        $offer->save();

        // Update other offers to rejected
        PriceOffer::where('purchase_request_id', $purchaseRequest->id)
            ->where('id', '!=', $offer->id)
            ->update(['status' => 'rejected']);

        $this->service->userAcceptedOffer($purchaseRequest, auth()->id(), $offer->id);

        return response()->json(['message' => 'Offer accepted']);
    }
}
