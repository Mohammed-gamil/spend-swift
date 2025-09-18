<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequestRequest;
use App\Http\Requests\UpdateRequestRequest;
use App\Http\Resources\RequestResource;
use App\Models\AuditTrail;
use App\Models\Request;
use App\Services\NotificationService;
use App\Services\RequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RequestController extends Controller
{
    protected $requestService;
    protected $notificationService;

    /**
     * RequestController constructor.
     *
     * @param RequestService $requestService
     * @param NotificationService $notificationService
     */
    public function __construct(RequestService $requestService, NotificationService $notificationService)
    {
        $this->requestService = $requestService;
        $this->notificationService = $notificationService;
        
        // In Laravel 12, middleware should be applied in the route definitions
        // instead of the controller constructor
    }

    /**
     * Display a listing of the resource.
     *
     * @param HttpRequest $request
     * @return AnonymousResourceCollection
     */
    public function index(HttpRequest $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $requests = $this->requestService->getRequestsForUser(
            $user,
            $request->get('status'),
            $request->get('type'),
            $request->get('start_date'),
            $request->get('end_date')
        );
        return RequestResource::collection($requests);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequestRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequestRequest $request): JsonResponse
    {
        $newRequest = $this->requestService->createRequest(
            $request->user(),
            $request->validated()
        );
        
        return response()->json([
            'message' => 'Request created successfully',
            'request' => new RequestResource($newRequest)
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        $this->authorize('view', $request);
        
        $request->load([
            'requester',
            'department',
            'items',
            'projectDetail',
            'approvalHistory.approver',
            'attachments',
        ]);
        
        return response()->json([
            'request' => new RequestResource($request)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequestRequest $validatedRequest
     * @param Request $request
     * @return JsonResponse
     */
    public function update(UpdateRequestRequest $validatedRequest, Request $request): JsonResponse
    {
        $this->authorize('update', $request);
        
        if (!$request->canBeEdited()) {
            return response()->json([
                'message' => 'This request cannot be edited in its current state.'
            ], 403);
        }
        
        $updatedRequest = $this->requestService->updateRequest(
            $request,
            $validatedRequest->validated()
        );
        
        return response()->json([
            'message' => 'Request updated successfully',
            'request' => new RequestResource($updatedRequest)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        $this->authorize('delete', $request);
        
        if (!$request->isDraft()) {
            return response()->json([
                'message' => 'Only draft requests can be deleted.'
            ], 403);
        }
        
        $this->requestService->deleteRequest($request);
        
        return response()->json([
            'message' => 'Request deleted successfully'
        ]);
    }

    /**
     * Submit a request for approval.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function submit(Request $request): JsonResponse
    {
        $this->authorize('submit', $request);
        
        if (!$request->isDraft()) {
            return response()->json([
                'message' => 'Only draft requests can be submitted.'
            ], 403);
        }
        
        $submittedRequest = $this->requestService->submitRequest($request);
        
        return response()->json([
            'message' => 'Request submitted successfully',
            'request' => new RequestResource($submittedRequest)
        ]);
    }

    /**
     * Approve a request.
     *
     * @param HttpRequest $httpRequest
     * @param Request $request
     * @return JsonResponse
     */
    public function approve(HttpRequest $httpRequest, Request $request): JsonResponse
    {
        $user = $httpRequest->user();
        
        if (!$request->canBeApprovedBy($user)) {
            return response()->json([
                'message' => 'You are not authorized to approve this request in its current state.'
            ], 403);
        }
        
        $httpRequest->validate([
            'comments' => 'nullable|string|max:1000',
        ]);
        
        $approvedRequest = $this->requestService->approveRequest(
            $request,
            $user,
            $httpRequest->input('comments')
        );
        
        return response()->json([
            'message' => 'Request approved successfully',
            'request' => new RequestResource($approvedRequest)
        ]);
    }

    /**
     * Reject a request.
     *
     * @param HttpRequest $httpRequest
     * @param Request $request
     * @return JsonResponse
     */
    public function reject(HttpRequest $httpRequest, Request $request): JsonResponse
    {
        $user = $httpRequest->user();
        
        if (!$request->canBeApprovedBy($user)) {
            return response()->json([
                'message' => 'You are not authorized to reject this request.'
            ], 403);
        }
        
        $httpRequest->validate([
            'comments' => 'required|string|max:1000',
        ]);
        
        $rejectedRequest = $this->requestService->rejectRequest(
            $request,
            $user,
            $httpRequest->input('comments')
        );
        
        return response()->json([
            'message' => 'Request rejected',
            'request' => new RequestResource($rejectedRequest)
        ]);
    }

    /**
     * Return a request for more information.
     *
     * @param HttpRequest $httpRequest
     * @param Request $request
     * @return JsonResponse
     */
    public function return(HttpRequest $httpRequest, Request $request): JsonResponse
    {
        $user = $httpRequest->user();
        
        if (!$request->canBeApprovedBy($user)) {
            return response()->json([
                'message' => 'You are not authorized to return this request.'
            ], 403);
        }
        
        $httpRequest->validate([
            'comments' => 'required|string|max:1000',
        ]);
        
        $returnedRequest = $this->requestService->returnRequest(
            $request,
            $user,
            $httpRequest->input('comments')
        );
        
        return response()->json([
            'message' => 'Request returned for more information',
            'request' => new RequestResource($returnedRequest)
        ]);
    }

    /**
     * Cancel a request.
     *
     * @param HttpRequest $httpRequest
     * @param Request $request
     * @return JsonResponse
     */
    public function cancel(HttpRequest $httpRequest, Request $request): JsonResponse
    {
        $this->authorize('cancel', $request);
        
        if (!$request->isDraft() && !$request->status === 'SUBMITTED') {
            return response()->json([
                'message' => 'Only draft or submitted requests can be cancelled.'
            ], 403);
        }
        
        $httpRequest->validate([
            'comments' => 'nullable|string|max:1000',
        ]);
        
        $cancelledRequest = $this->requestService->cancelRequest(
            $request,
            $httpRequest->user(),
            $httpRequest->input('comments')
        );
        
        return response()->json([
            'message' => 'Request cancelled successfully',
            'request' => new RequestResource($cancelledRequest)
        ]);
    }
}