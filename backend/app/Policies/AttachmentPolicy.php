<?php

namespace App\Policies;

use App\Models\Attachment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttachmentPolicy
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
        return $user->hasPermissionTo('attachment.view');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Attachment  $attachment
     * @return bool
     */
    public function view(User $user, Attachment $attachment): bool
    {
        // Admin and Final Manager can view all attachments
        if ($user->hasRole(['ADMIN', 'FINAL_MANAGER'])) {
            return true;
        }

        // Direct Manager can view attachments from their team
        if ($user->hasRole('DIRECT_MANAGER')) {
            $request = $attachment->request;
            $requestUser = $request->user;
            
            // Direct manager can view attachments from their team members or their own
            if ($requestUser->reports_to === $user->id || $attachment->uploaded_by === $user->id) {
                return true;
            }
        }

        // Accountant can view attachments for requests they are reviewing
        if ($user->hasRole('ACCOUNTANT') && $attachment->request->status === 'DM_APPROVED') {
            return true;
        }

        // Users can view attachments for their own requests or ones they uploaded
        return $attachment->request->user_id === $user->id || $attachment->uploaded_by === $user->id;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('attachment.create');
    }

    /**
     * Determine whether the user can upload an attachment to a specific request.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Request  $request
     * @return bool
     */
    public function upload(User $user, \App\Models\Request $request): bool
    {
        // Admin can upload attachments to any request
        if ($user->hasRole('ADMIN')) {
            return true;
        }

        // Direct Manager can upload attachments to their team's requests
        if ($user->hasRole('DIRECT_MANAGER')) {
            $requestUser = $request->user;
            
            // Direct manager can upload attachments to their team members' requests or their own
            if ($requestUser->reports_to === $user->id || $request->user_id === $user->id) {
                return true;
            }
        }

        // Accountant can upload attachments to requests they are reviewing
        if ($user->hasRole('ACCOUNTANT') && $request->status === 'DM_APPROVED') {
            return true;
        }

        // Final Manager can upload attachments to requests they are reviewing
        if ($user->hasRole('FINAL_MANAGER') && in_array($request->status, ['ACCT_APPROVED', 'FINAL_APPROVED'])) {
            return true;
        }

        // Users can upload attachments to their own requests
        return $user->hasPermissionTo('attachment.create') && $request->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Attachment  $attachment
     * @return bool
     */
    public function delete(User $user, Attachment $attachment): bool
    {
        // Admin can delete any attachment
        if ($user->hasRole('ADMIN')) {
            return true;
        }

        // Cannot delete attachments for requests that are past the SUBMITTED state
        // unless you are an admin or the attachment's uploader
        if (!in_array($attachment->request->status, ['DRAFT', 'SUBMITTED']) && 
            $attachment->uploaded_by !== $user->id) {
            return false;
        }

        // Users can delete attachments they uploaded
        if ($attachment->uploaded_by === $user->id) {
            return $user->hasPermissionTo('attachment.delete');
        }

        // Direct Manager can delete attachments from their team's requests
        if ($user->hasRole('DIRECT_MANAGER')) {
            $request = $attachment->request;
            $requestUser = $request->user;
            
            if ($requestUser->reports_to === $user->id) {
                return $user->hasPermissionTo('attachment.delete');
            }
        }

        // Otherwise, only request owner can delete attachments
        return $user->hasPermissionTo('attachment.delete') && $attachment->request->user_id === $user->id;
    }
}