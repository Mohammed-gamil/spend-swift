<?php

namespace App\Services;

use App\Models\Request;
use App\Models\ApprovalHistory;
use App\Models\User;
use App\Models\Budget;
use App\Models\Department;
use App\Exceptions\InvalidRequestStateException;
use App\Exceptions\InsufficientBudgetException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Services\NotificationService;

class RequestService
{
    protected $notificationService;
    
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    
    /**
     * Get all requests for the authenticated user based on their role.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRequests()
    {
        $user = Auth::user();
        return $this->getRequestsForUser($user);
    }
    
    /**
     * Get requests for a specific user with optional filters.
     *
     * @param User $user
     * @param string|null $status
     * @param string|null $type
     * @param string|null $startDate
     * @param string|null $endDate
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRequestsForUser(User $user, ?string $status = null, ?string $type = null, ?string $startDate = null, ?string $endDate = null)
    {
        $query = Request::with(['user', 'department', 'items', 'projectDetails', 'approvalHistories', 'attachments']);
        
        if ($user->hasRole(['ADMIN', 'FINAL_MANAGER'])) {
            // Admin and Final Manager can see all requests
        } elseif ($user->hasRole('DIRECT_MANAGER')) {
            // Get requests from users that report to this manager or created by this manager
            $teamUserIds = User::where('reports_to', $user->id)->pluck('id')->toArray();
            $teamUserIds[] = $user->id;
            
            $query->where(function($q) use ($teamUserIds) {
                $q->whereIn('requester_id', $teamUserIds)
                  ->orWhere('status', 'SUBMITTED'); // Pending direct manager approval
            });
        } elseif ($user->hasRole('ACCOUNTANT')) {
            $query->where('status', 'DM_APPROVED'); // Pending accountant approval
        } else {
            // Regular users can only see their own requests
            $query->where('requester_id', $user->id);
        }
        
        // Apply filters
        if ($status) {
            $query->where('status', $status);
        }
        
        if ($type) {
            $query->where('type', $type);
        }
        
        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }
        
        return $query->latest()->get();
    }
    
    /**
     * Get a specific request by ID.
     *
     * @param int $id
     * @return Request
     */
    public function getRequestById($id)
    {
        return Request::with(['user', 'department', 'items', 'projectDetails', 'approvalHistories', 'attachments'])
            ->findOrFail($id);
    }
    
    /**
     * Create a new request.
     *
     * @param array $data
     * @return Request
     */
    public function createRequest(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create the request
            $request = new Request();
            $request->fill($data);
            $request->requester_id = Auth::id();
            $request->status = 'DRAFT';
            $request->save();
            
            // Create request items if it's a purchase request
            if ($request->request_type === 'PURCHASE' && isset($data['items'])) {
                foreach ($data['items'] as $itemData) {
                    $request->items()->create($itemData);
                }
            }
            
            // Create project details if it's a project request
            if ($request->request_type === 'PROJECT' && isset($data['project_details'])) {
                $request->projectDetails()->create($data['project_details']);
            }
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'CREATED',
                'comments' => 'Request created as draft',
                'status' => 'DRAFT'
            ]);
            
            return $request;
        });
    }
    
    /**
     * Update an existing request.
     *
     * @param Request $request
     * @param array $data
     * @return Request
     */
    public function updateRequest(Request $request, array $data)
    {
        return DB::transaction(function () use ($request, $data) {
            // Only allow updates to draft requests
            if ($request->status !== 'DRAFT') {
                throw new InvalidRequestStateException('Cannot update a request that has been submitted or approved');
            }
            
            // Update the request
            $request->fill($data);
            $request->save();
            
            // Update request items if it's a purchase request
            if ($request->request_type === 'PURCHASE' && isset($data['items'])) {
                // Delete existing items
                $request->items()->delete();
                
                // Create new items
                foreach ($data['items'] as $itemData) {
                    $request->items()->create($itemData);
                }
            }
            
            // Update project details if it's a project request
            if ($request->request_type === 'PROJECT' && isset($data['project_details'])) {
                if ($request->projectDetails) {
                    $request->projectDetails->update($data['project_details']);
                } else {
                    $request->projectDetails()->create($data['project_details']);
                }
            }
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'UPDATED',
                'comments' => 'Request updated',
                'status' => 'DRAFT'
            ]);
            
            return $request;
        });
    }
    
    /**
     * Submit a request for approval.
     *
     * @param Request $request
     * @param string|null $comments
     * @return Request
     */
    public function submitRequest(Request $request, ?string $comments = null)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Can only submit draft requests
            if ($request->status !== 'DRAFT') {
                throw new InvalidRequestStateException('Only draft requests can be submitted');
            }
            
            // Update status
            $request->status = 'SUBMITTED';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'SUBMITTED',
                'comments' => $comments ?? 'Request submitted for approval',
                'status' => 'SUBMITTED'
            ]);
            
            // Notify direct manager
            $directManager = User::find($request->user->reports_to);
            if ($directManager) {
                $this->notificationService->sendNotification(
                    $directManager->id,
                    'New request needs your approval',
                    '/requests/' . $request->id
                );
            }
            
            return $request;
        });
    }
    
    /**
     * Approve request by direct manager.
     *
     * @param Request $request
     * @param string|null $comments
     * @return Request
     */
    public function approveByDirectManager(Request $request, ?string $comments = null)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Can only approve submitted requests
            if ($request->status !== 'SUBMITTED') {
                throw new InvalidRequestStateException('Only submitted requests can be approved by direct manager');
            }
            
            // Update status
            $request->status = 'DM_APPROVED';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'DM_APPROVED',
                'comments' => $comments ?? 'Request approved by direct manager',
                'status' => 'DM_APPROVED'
            ]);
            
            // Notify accountants
            $accountants = User::role('ACCOUNTANT')->get();
            foreach ($accountants as $accountant) {
                $this->notificationService->sendNotification(
                    $accountant->id,
                    'New request ready for financial review',
                    '/requests/' . $request->id
                );
            }
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Your request has been approved by your manager',
                '/requests/' . $request->id
            );
            
            return $request;
        });
    }
    
    /**
     * Approve request by accountant.
     *
     * @param Request $request
     * @param string|null $comments
     * @return Request
     */
    public function approveByAccountant(Request $request, ?string $comments = null)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Can only approve requests that were approved by direct manager
            if ($request->status !== 'DM_APPROVED') {
                throw new InvalidRequestStateException('Only direct manager approved requests can be approved by accountant');
            }
            
            // Check budget availability
            $department = $request->department;
            $budget = Budget::where('department_id', $department->id)
                ->where('fiscal_year', date('Y'))
                ->first();
            
            if (!$budget) {
                throw new InsufficientBudgetException('No budget found for this department');
            }
            
            $requestAmount = $request->getTotalAmount();
            if ($requestAmount > ($budget->total_amount - $budget->spent_amount)) {
                throw new InsufficientBudgetException('Insufficient budget for this request');
            }
            
            // Update status
            $request->status = 'ACCT_APPROVED';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'ACCT_APPROVED',
                'comments' => $comments ?? 'Request approved by accountant',
                'status' => 'ACCT_APPROVED'
            ]);
            
            // Notify final managers
            $finalManagers = User::role('FINAL_MANAGER')->get();
            foreach ($finalManagers as $finalManager) {
                $this->notificationService->sendNotification(
                    $finalManager->id,
                    'Request ready for final approval',
                    '/requests/' . $request->id
                );
            }
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Your request has been approved by accounting',
                '/requests/' . $request->id
            );
            
            return $request;
        });
    }
    
    /**
     * Approve request by final manager.
     *
     * @param Request $request
     * @param string|null $comments
     * @return Request
     */
    public function approveByFinalManager(Request $request, ?string $comments = null)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Can only approve requests that were approved by accountant
            if ($request->status !== 'ACCT_APPROVED') {
                throw new InvalidRequestStateException('Only accountant approved requests can be approved by final manager');
            }
            
            // Update status
            $request->status = 'FINAL_APPROVED';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'FINAL_APPROVED',
                'comments' => $comments ?? 'Request approved by final manager',
                'status' => 'FINAL_APPROVED'
            ]);
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Your request has been finally approved',
                '/requests/' . $request->id
            );
            
            return $request;
        });
    }
    
    /**
     * Mark funds as transferred for an approved request.
     *
     * @param Request $request
     * @param string|null $comments
     * @param string|null $transactionReference
     * @return Request
     */
    public function transferFunds(Request $request, ?string $comments = null, ?string $transactionReference = null)
    {
        return DB::transaction(function () use ($request, $comments, $transactionReference) {
            // Can only transfer funds for finally approved requests
            if ($request->status !== 'FINAL_APPROVED') {
                throw new InvalidRequestStateException('Only finally approved requests can have funds transferred');
            }
            
            // Update budget
            $department = $request->department;
            $budget = Budget::where('department_id', $department->id)
                ->where('fiscal_year', date('Y'))
                ->first();
            
            if ($budget) {
                $requestAmount = $request->getTotalAmount();
                $budget->spent_amount += $requestAmount;
                $budget->save();
            }
            
            // Update status
            $request->status = 'FUNDS_TRANSFERRED';
            $request->transaction_reference = $transactionReference;
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'FUNDS_TRANSFERRED',
                'comments' => $comments ?? 'Funds transferred',
                'status' => 'FUNDS_TRANSFERRED'
            ]);
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Funds for your request have been transferred',
                '/requests/' . $request->id
            );
            
            return $request;
        });
    }
    
    /**
     * Reject a request at any stage.
     *
     * @param Request $request
     * @param string $comments
     * @return Request
     */
    public function rejectRequest(Request $request, string $comments)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Cannot reject if already rejected, returned, or funds transferred
            if (in_array($request->status, ['REJECTED', 'RETURNED', 'FUNDS_TRANSFERRED'])) {
                throw new InvalidRequestStateException('This request cannot be rejected');
            }
            
            // Update status
            $request->status = 'REJECTED';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'REJECTED',
                'comments' => $comments,
                'status' => 'REJECTED'
            ]);
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Your request has been rejected',
                '/requests/' . $request->id
            );
            
            return $request;
        });
    }
    
    /**
     * Return a request for revision.
     *
     * @param Request $request
     * @param string $comments
     * @return Request
     */
    public function returnRequest(Request $request, string $comments)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Cannot return if draft, rejected, returned, or funds transferred
            if (in_array($request->status, ['DRAFT', 'REJECTED', 'RETURNED', 'FUNDS_TRANSFERRED'])) {
                throw new InvalidRequestStateException('This request cannot be returned for revision');
            }
            
            // Update status
            $request->status = 'RETURNED';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'RETURNED',
                'comments' => $comments,
                'status' => 'RETURNED'
            ]);
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Your request has been returned for revision',
                '/requests/' . $request->id
            );
            
            return $request;
        });
    }
    
    /**
     * Resubmit a returned request.
     *
     * @param Request $request
     * @param array $data
     * @param string|null $comments
     * @return Request
     */
    public function resubmitRequest(Request $request, array $data, ?string $comments = null)
    {
        return DB::transaction(function () use ($request, $data, $comments) {
            // Can only resubmit returned requests
            if ($request->status !== 'RETURNED') {
                throw new InvalidRequestStateException('Only returned requests can be resubmitted');
            }
            
            // Update the request
            $request->fill($data);
            $request->status = 'SUBMITTED';
            $request->save();
            
            // Update request items if it's a purchase request
            if ($request->request_type === 'PURCHASE' && isset($data['items'])) {
                // Delete existing items
                $request->items()->delete();
                
                // Create new items
                foreach ($data['items'] as $itemData) {
                    $request->items()->create($itemData);
                }
            }
            
            // Update project details if it's a project request
            if ($request->request_type === 'PROJECT' && isset($data['project_details'])) {
                if ($request->projectDetails) {
                    $request->projectDetails->update($data['project_details']);
                } else {
                    $request->projectDetails()->create($data['project_details']);
                }
            }
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'user_id' => Auth::id(),
                'action' => 'RESUBMITTED',
                'comments' => $comments ?? 'Request resubmitted after revision',
                'status' => 'SUBMITTED'
            ]);
            
            // Notify direct manager
            $directManager = User::find($request->user->reports_to);
            if ($directManager) {
                $this->notificationService->sendNotification(
                    $directManager->id,
                    'Request has been resubmitted and needs your approval',
                    '/requests/' . $request->id
                );
            }
            
            return $request;
        });
    }
}