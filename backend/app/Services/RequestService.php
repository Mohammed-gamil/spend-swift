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
use App\Services\QuoteService;

class RequestService
{
    protected $notificationService;
    protected $quoteService;
    
    public function __construct(NotificationService $notificationService, QuoteService $quoteService)
    {
        $this->notificationService = $notificationService;
        $this->quoteService = $quoteService;
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
            $teamUserIds = User::where('direct_manager_id', $user->id)->pluck('id')->toArray();
            $teamUserIds[] = $user->id;
            
            $query->where(function($q) use ($teamUserIds) {
                $q->whereIn('requester_id', $teamUserIds)
                  ->orWhere('status', 'SUBMITTED') // Pending first direct manager approval
                  ->orWhere('status', 'QUOTE_SELECTED'); // Pending second direct manager approval
            });
        } elseif ($user->hasRole('ACCOUNTANT')) {
            $query->whereIn('status', [
                'DM_APPROVED', // Pending quote request
                'AWAITING_FINAL_APPROVAL' // Pending final approval and funds transfer
            ]);
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
                'approver_id' => Auth::id(),
                'status' => 'CREATED',
                'comments' => 'Request created as draft'
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
                'approver_id' => Auth::id(),
                'status' => 'UPDATED',
                'comments' => 'Request updated'
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
                'approver_id' => Auth::id(),
                'status' => 'SUBMITTED',
                'comments' => $comments ?? 'Request submitted for approval'
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
                'approver_id' => Auth::id(),
                'status' => 'DM_APPROVED',
                'comments' => $comments ?? 'Request approved by direct manager'
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
     * Second approval by direct manager after quote selection.
     *
     * @param Request $request
     * @param string|null $comments
     * @return Request
     */
    public function secondApprovalByDirectManager(Request $request, ?string $comments = null)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Can only approve requests that have selected quotes
            if ($request->status !== 'QUOTE_SELECTED') {
                throw new InvalidRequestStateException('Only requests with selected quotes can be approved by direct manager for second time');
            }
            
            // Ensure there's a selected quote
            $selectedQuote = $request->selectedQuote;
            if (!$selectedQuote) {
                throw new InvalidRequestStateException('No quote has been selected for this request');
            }
            
            // Update status
            $request->status = 'AWAITING_FINAL_APPROVAL';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'approver_id' => Auth::id(),
                'status' => 'DM_SECOND_APPROVED',
                'comments' => $comments ?? 'Request approved by direct manager after quote selection'
            ]);
            
            // Notify accountants for final approval
            $accountants = User::role('ACCOUNTANT')->get();
            foreach ($accountants as $accountant) {
                $this->notificationService->sendNotification(
                    $accountant->id,
                    'Request with selected quote ready for final approval',
                    '/requests/' . $request->id
                );
            }
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Your request with selected quote has been approved by your manager',
                '/requests/' . $request->id
            );
            
            return $request;
        });
    }

    /**
     * Process request by accountant - Request quotes instead of direct approval.
     *
     * @param Request $request
     * @param string|null $comments
     * @return Request
     */
    public function processRequestByAccountant(Request $request, ?string $comments = null)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Can only process requests that were approved by direct manager
            if ($request->status !== 'DM_APPROVED') {
                throw new InvalidRequestStateException('Only direct manager approved requests can be processed by accountant');
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
            
            // Request quotes instead of direct approval
            return $this->quoteService->requestQuotes($request, $comments);
        });
    }

    /**
     * Approve request by accountant after quote selection.
     *
     * @param Request $request
     * @param string|null $comments
     * @return Request
     */
    public function approveByAccountant(Request $request, ?string $comments = null)
    {
        return DB::transaction(function () use ($request, $comments) {
            // Can only approve requests that have selected quotes and are awaiting final approval
            if ($request->status !== 'AWAITING_FINAL_APPROVAL') {
                throw new InvalidRequestStateException('Only requests awaiting final approval can be approved by accountant');
            }
            
            // Ensure there's a selected quote
            $selectedQuote = $request->selectedQuote;
            if (!$selectedQuote) {
                throw new InvalidRequestStateException('No quote has been selected for this request');
            }
            
            // Update status
            $request->status = 'ACCT_APPROVED';
            $request->save();
            
            // Add approval history entry
            $request->approvalHistories()->create([
                'approver_id' => Auth::id(),
                'status' => 'ACCT_APPROVED',
                'comments' => $comments ?? 'Request approved by accountant with selected quote'
            ]);
            
            // Notify requester
            $this->notificationService->sendNotification(
                $request->requester_id,
                'Your request has been approved by accounting for funds transfer',
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
                'approver_id' => Auth::id(),
                'status' => 'FINAL_APPROVED',
                'comments' => $comments ?? 'Request approved by final manager'
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
                'approver_id' => Auth::id(),
                'status' => 'FUNDS_TRANSFERRED',
                'comments' => $comments ?? 'Funds transferred'
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
                'approver_id' => Auth::id(),
                'status' => 'REJECTED',
                'comments' => $comments
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
                'approver_id' => Auth::id(),
                'status' => 'RETURNED',
                'comments' => $comments
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
     * Get requests that need quotes to be added (for accountants).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRequestsNeedingQuotes()
    {
        return Request::with(['user', 'department', 'items', 'projectDetails', 'approvalHistories', 'priceQuotes'])
            ->where('status', 'DM_APPROVED')
            ->latest()
            ->get();
    }
    
    /**
     * Get requests with quotes requested (for viewing quotes).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRequestsWithQuotesRequested()
    {
        return Request::with(['user', 'department', 'items', 'projectDetails', 'approvalHistories', 'priceQuotes.creator'])
            ->where('status', 'QUOTES_REQUESTED')
            ->latest()
            ->get();
    }
    
    /**
     * Get requests with selected quotes (for second manager approval).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRequestsWithSelectedQuotes()
    {
        return Request::with(['user', 'department', 'items', 'projectDetails', 'approvalHistories', 'selectedQuote'])
            ->where('status', 'QUOTE_SELECTED')
            ->latest()
            ->get();
    }
    
    /**
     * Get requests awaiting final approval (for accountant final approval).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRequestsAwaitingFinalApproval()
    {
        return Request::with(['user', 'department', 'items', 'projectDetails', 'approvalHistories', 'selectedQuote'])
            ->where('status', 'AWAITING_FINAL_APPROVAL')
            ->latest()
            ->get();
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
                'approver_id' => Auth::id(),
                'status' => 'RESUBMITTED',
                'comments' => $comments ?? 'Request resubmitted after revision'
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