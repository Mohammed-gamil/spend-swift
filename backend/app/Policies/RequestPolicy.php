<?php

namespace App\Policies;

use App\Models\Request;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RequestPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('request.view');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function view(User $user, Request $request): bool
    {
        // Admin and Final Manager can view all requests
        if ($user->hasRole(['ADMIN', 'FINAL_MANAGER'])) {
            return true;
        }

        // Direct Manager can view requests from their team
        if ($user->hasRole('DIRECT_MANAGER')) {
            $requestUser = $request->user;
            
            // Direct manager can view requests from their team members or their own
            if ($requestUser->reports_to === $user->id || $request->user_id === $user->id) {
                return true;
            }
        }

        // Accountant can view requests that are pending their approval
        if ($user->hasRole('ACCOUNTANT') && $request->status === 'DM_APPROVED') {
            return true;
        }

        // Users can view their own requests
        return $request->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('request.create');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function update(User $user, Request $request): bool
    {
        // Only allow updates if the request is in DRAFT state
        if ($request->status !== 'DRAFT') {
            return false;
        }
        
        // Admin can update any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Users can only update their own requests
        return $user->hasPermissionTo('request.update') && $request->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function delete(User $user, Request $request): bool
    {
        // Only allow deletion if the request is in DRAFT state
        if ($request->status !== 'DRAFT') {
            return false;
        }
        
        // Admin can delete any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Users can only delete their own requests
        return $user->hasPermissionTo('request.delete') && $request->user_id === $user->id;
    }

    /**
     * Determine whether the user can submit the request.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function submit(User $user, Request $request): bool
    {
        // Only allow submission if the request is in DRAFT state
        if ($request->status !== 'DRAFT') {
            return false;
        }
        
        // Admin can submit any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Users can only submit their own requests
        return $user->hasPermissionTo('request.submit') && $request->user_id === $user->id;
    }

    /**
     * Determine whether the user can approve the request as direct manager.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function approveAsDirectManager(User $user, Request $request): bool
    {
        // Only allow approval if the request is in SUBMITTED state
        if ($request->status !== 'SUBMITTED') {
            return false;
        }
        
        // Admin can approve any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Direct Manager can only approve requests from their team
        if ($user->hasRole('DIRECT_MANAGER') && $user->hasPermissionTo('request.approve.dm')) {
            $requestUser = $request->user;
            return $requestUser->reports_to === $user->id;
        }
        
        return false;
    }

    /**
     * Determine whether the user can approve the request as accountant.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function approveAsAccountant(User $user, Request $request): bool
    {
        // Only allow approval if the request is in DM_APPROVED state
        if ($request->status !== 'DM_APPROVED') {
            return false;
        }
        
        // Admin can approve any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Accountant with the correct permission
        return $user->hasRole('ACCOUNTANT') && $user->hasPermissionTo('request.approve.acct');
    }

    /**
     * Determine whether the user can approve the request as final manager.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function approveAsFinalManager(User $user, Request $request): bool
    {
        // Only allow approval if the request is in ACCT_APPROVED state
        if ($request->status !== 'ACCT_APPROVED') {
            return false;
        }
        
        // Admin can approve any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Final Manager with the correct permission
        return $user->hasRole('FINAL_MANAGER') && $user->hasPermissionTo('request.approve.final');
    }

    /**
     * Determine whether the user can transfer funds for the request.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function transferFunds(User $user, Request $request): bool
    {
        // Only allow transfer if the request is in FINAL_APPROVED state
        if ($request->status !== 'FINAL_APPROVED') {
            return false;
        }
        
        // Admin can transfer funds for any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Final Manager with the correct permission
        return $user->hasRole('FINAL_MANAGER') && $user->hasPermissionTo('request.transfer');
    }

    /**
     * Determine whether the user can reject the request.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function reject(User $user, Request $request): bool
    {
        // Cannot reject if already rejected, returned, or funds transferred
        if (in_array($request->status, ['REJECTED', 'RETURNED', 'FUNDS_TRANSFERRED'])) {
            return false;
        }
        
        // Admin can reject any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Direct Manager can reject requests from their team
        if ($user->hasRole('DIRECT_MANAGER') && $user->hasPermissionTo('request.reject')) {
            $requestUser = $request->user;
            if ($requestUser->reports_to === $user->id && $request->status === 'SUBMITTED') {
                return true;
            }
        }
        
        // Accountant can reject requests they are reviewing
        if ($user->hasRole('ACCOUNTANT') && $user->hasPermissionTo('request.reject') && $request->status === 'DM_APPROVED') {
            return true;
        }
        
        // Final Manager can reject requests they are reviewing
        if ($user->hasRole('FINAL_MANAGER') && $user->hasPermissionTo('request.reject') && $request->status === 'ACCT_APPROVED') {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can return the request for revision.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function return(User $user, Request $request): bool
    {
        // Cannot return if draft, rejected, returned, or funds transferred
        if (in_array($request->status, ['DRAFT', 'REJECTED', 'RETURNED', 'FUNDS_TRANSFERRED'])) {
            return false;
        }
        
        // Admin can return any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Direct Manager can return requests from their team
        if ($user->hasRole('DIRECT_MANAGER') && $user->hasPermissionTo('request.return')) {
            $requestUser = $request->user;
            if ($requestUser->reports_to === $user->id && $request->status === 'SUBMITTED') {
                return true;
            }
        }
        
        // Accountant can return requests they are reviewing
        if ($user->hasRole('ACCOUNTANT') && $user->hasPermissionTo('request.return') && $request->status === 'DM_APPROVED') {
            return true;
        }
        
        // Final Manager can return requests they are reviewing
        if ($user->hasRole('FINAL_MANAGER') && $user->hasPermissionTo('request.return') && $request->status === 'ACCT_APPROVED') {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can resubmit the request.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function resubmit(User $user, Request $request): bool
    {
        // Only allow resubmission if the request is in RETURNED state
        if ($request->status !== 'RETURNED') {
            return false;
        }
        
        // Admin can resubmit any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }
        
        // Users can only resubmit their own requests
        return $user->hasPermissionTo('request.submit') && $request->user_id === $user->id;
    }
}