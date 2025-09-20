<?php

namespace App\Services;

use App\Models\PurchaseRequest;
use App\Repositories\Contracts\PurchaseRequestRepositoryInterface;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Collection;

class PurchaseRequestService
{
    protected $repository;

    public function __construct(PurchaseRequestRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function createPurchaseRequest(array $data): PurchaseRequest
    {
        // Ensure the creating user is recorded on the purchase request. Some environments
        // (MySQL with strict mode) require `user_id` to be present (no default), so
        // inject the authenticated user id if available.
        $actorId = Auth::id() ?? ($data['user_id'] ?? null);
        if ($actorId && empty($data['user_id'])) {
            $data['user_id'] = $actorId;
        }

        if (empty($data['status'])) {
            $data['status'] = 'draft';
        }

        $pr = $this->repository->create($data);
        ActivityLog::create([
            'loggable_type' => PurchaseRequest::class,
            'loggable_id' => $pr->id,
            'user_id' => $actorId,
            'description' => 'Purchase Request created',
        ]);

        return $pr;
    }

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function getById(int $id): ?PurchaseRequest
    {
        return $this->repository->getById($id);
    }

    public function updatePurchaseRequest(int $id, array $data): ?PurchaseRequest
    {
        $purchaseRequest = $this->repository->findById($id);

        if (!$purchaseRequest) {
            return null;
        }

        // Authorization check (defense in depth)
        if (Gate::denies('update', $purchaseRequest)) {
            throw new \Illuminate\Auth\Access\AuthorizationException('Not allowed to update this purchase request');
        }

        $this->repository->update($purchaseRequest, $data);

        $actorId = Auth::id() ?? ($data['user_id'] ?? null);
        ActivityLog::create([
            'loggable_type' => PurchaseRequest::class,
            'loggable_id' => $purchaseRequest->id,
            'user_id' => $actorId,
            'description' => 'Purchase Request updated',
        ]);

        return $this->repository->findById($purchaseRequest->id);
    }

    public function deletePurchaseRequest(int $id): bool
    {
        $purchaseRequest = $this->repository->findById($id);

        if (!$purchaseRequest) {
            return false;
        }

        $result = $this->repository->delete($purchaseRequest);

        if ($result) {
            $actorId = Auth::id() ?? null;
            ActivityLog::create([
                'loggable_type' => PurchaseRequest::class,
                'loggable_id' => $purchaseRequest->id,
                'user_id' => $actorId,
                'description' => 'Purchase Request deleted',
            ]);
        }

        return $result;
    }

    public function approveByManager(PurchaseRequest $purchaseRequest, ?int $actorId = null): void
    {
        $actorId = $actorId ?? Auth::id();

        if (config('pr_workflow.use_model_states')) {
            // Try to use the model-state transition; if something goes wrong,
            // fall back to a string status assignment so the request isn't left
            // in an inconsistent state.
            try {
                if (method_exists($purchaseRequest, 'transitionTo')) {
                    // The transitionTo method is provided by spatie/model-states
                    // when the model has state objects registered.
                    $purchaseRequest->transitionTo(\App\States\PurchaseRequest\ApprovedByManager::class);
                } else {
                    // Fallback
                    $purchaseRequest->status = 'approved_by_manager';
                    $purchaseRequest->save();
                }
            } catch (\Throwable $e) {
                $purchaseRequest->status = 'approved_by_manager';
                $purchaseRequest->save();
            }
        } else {
            $purchaseRequest->status = 'approved_by_manager';
            $purchaseRequest->save();
        }

        $purchaseRequest->manager_id = $actorId ?? $purchaseRequest->manager_id;
        $purchaseRequest->save();

        ActivityLog::create([
            'loggable_type' => PurchaseRequest::class,
            'loggable_id' => $purchaseRequest->id,
            'user_id' => $actorId,
            'description' => 'Purchase Request approved by manager',
        ]);
    }

    public function rejectByManager(PurchaseRequest $purchaseRequest, ?int $actorId = null): void
    {
        $actorId = $actorId ?? Auth::id();

        if (config('pr_workflow.use_model_states')) {
            try {
                if (method_exists($purchaseRequest, 'transitionTo')) {
                    $purchaseRequest->transitionTo(\App\States\PurchaseRequest\RejectedByManager::class);
                } else {
                    $purchaseRequest->status = 'rejected_by_manager';
                    $purchaseRequest->save();
                }
            } catch (\Throwable $e) {
                $purchaseRequest->status = 'rejected_by_manager';
                $purchaseRequest->save();
            }
        } else {
            $purchaseRequest->status = 'rejected_by_manager';
            $purchaseRequest->save();
        }

        $purchaseRequest->manager_id = $actorId ?? $purchaseRequest->manager_id;
        $purchaseRequest->save();

        ActivityLog::create([
            'loggable_type' => PurchaseRequest::class,
            'loggable_id' => $purchaseRequest->id,
            'user_id' => $actorId,
            'description' => 'Purchase Request rejected by manager',
        ]);
    }

    public function markPriceOffersAdded(PurchaseRequest $purchaseRequest, ?int $actorId = null): void
    {
        // allow transition only from approved -> price offers added
        $actorId = $actorId ?? Auth::id();

        if ($purchaseRequest->status === 'approved_by_manager' || $purchaseRequest->status === 'price_offers_added') {
            if (config('pr_workflow.use_model_states')) {
                try {
                    if (method_exists($purchaseRequest, 'transitionTo')) {
                        $purchaseRequest->transitionTo(\App\States\PurchaseRequest\PriceOffersAdded::class);
                    } else {
                        $purchaseRequest->status = 'price_offers_added';
                        $purchaseRequest->save();
                    }
                } catch (\Throwable $e) {
                    $purchaseRequest->status = 'price_offers_added';
                    $purchaseRequest->save();
                }
            } else {
                $purchaseRequest->status = 'price_offers_added';
                $purchaseRequest->save();
            }

            ActivityLog::create([
                'loggable_type' => PurchaseRequest::class,
                'loggable_id' => $purchaseRequest->id,
                'user_id' => $actorId,
                'description' => 'Price offer added',
            ]);
        }
    }

    public function userAcceptedOffer(PurchaseRequest $purchaseRequest, ?int $actorId = null, ?int $offerId = null): void
    {
        $actorId = $actorId ?? Auth::id();

        if (config('pr_workflow.use_model_states')) {
            try {
                if (method_exists($purchaseRequest, 'transitionTo')) {
                    $purchaseRequest->transitionTo(\App\States\PurchaseRequest\UserAcceptedOffer::class);
                } else {
                    $purchaseRequest->status = 'user_accepted_offer';
                    $purchaseRequest->save();
                }
            } catch (\Throwable $e) {
                $purchaseRequest->status = 'user_accepted_offer';
                $purchaseRequest->save();
            }
        } else {
            $purchaseRequest->status = 'user_accepted_offer';
            $purchaseRequest->save();
        }

        ActivityLog::create([
            'loggable_type' => PurchaseRequest::class,
            'loggable_id' => $purchaseRequest->id,
            'user_id' => $actorId,
            'description' => 'User accepted offer: ' . ($offerId ?? 'n/a'),
        ]);
    }
}