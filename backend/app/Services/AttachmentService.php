<?php

namespace App\Services;

use App\Models\Attachment;
use App\Models\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class AttachmentService
{
    /**
     * Upload an attachment for a request.
     *
     * @param Request $request
     * @param UploadedFile $file
     * @param string|null $description
     * @return Attachment
     */
    public function uploadAttachment(Request $request, UploadedFile $file, ?string $description = null): Attachment
    {
        // Generate a unique file name
        $fileName = Str::uuid() . '_' . $file->getClientOriginalName();
        
        // Store the file
        $path = $file->storeAs(
            'attachments/' . $request->id,
            $fileName,
            'private'
        );
        
        // Create the attachment record
        $attachment = new Attachment([
            'request_id' => $request->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'description' => $description,
            'uploaded_by' => Auth::id(),
        ]);
        
        $attachment->save();
        
        return $attachment;
    }
    
    /**
     * Upload multiple attachments for a request.
     *
     * @param Request $request
     * @param array $files
     * @param array|null $descriptions
     * @return array
     */
    public function uploadMultipleAttachments(Request $request, array $files, ?array $descriptions = null): array
    {
        $attachments = [];
        
        foreach ($files as $index => $file) {
            $description = $descriptions[$index] ?? null;
            $attachments[] = $this->uploadAttachment($request, $file, $description);
        }
        
        return $attachments;
    }
    
    /**
     * Get attachments for a specific request.
     *
     * @param int $requestId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAttachmentsForRequest(int $requestId)
    {
        return Attachment::where('request_id', $requestId)
            ->with('uploader')
            ->orderBy('created_at', 'desc')
            ->get();
    }
    
    /**
     * Get a specific attachment.
     *
     * @param int $id
     * @return Attachment
     */
    public function getAttachment(int $id): Attachment
    {
        return Attachment::findOrFail($id);
    }
    
    /**
     * Get the file contents of an attachment.
     *
     * @param Attachment $attachment
     * @return string
     */
    public function getAttachmentContents(Attachment $attachment): string
    {
        return Storage::disk('private')->get($attachment->file_path);
    }
    
    /**
     * Delete an attachment.
     *
     * @param Attachment $attachment
     * @return bool
     */
    public function deleteAttachment(Attachment $attachment): bool
    {
        // Delete the file from storage
        Storage::disk('private')->delete($attachment->file_path);
        
        // Delete the attachment record
        return $attachment->delete();
    }
    
    /**
     * Check if a user has permission to view an attachment.
     *
     * @param Attachment $attachment
     * @return bool
     */
    public function canViewAttachment(Attachment $attachment): bool
    {
        $user = Auth::user();
        
        // Admin and Final Manager can view all attachments
        if ($user->hasRole(['ADMIN', 'FINAL_MANAGER'])) {
            return true;
        }
        
        // Direct Manager can view attachments from their team
        if ($user->hasRole('DIRECT_MANAGER')) {
            $request = $attachment->request;
            $requestUser = $request->user;
            
            // If the request belongs to a user that reports to this manager
            if ($requestUser->reports_to == $user->id) {
                return true;
            }
        }
        
        // Accountant can view attachments for requests they are reviewing
        if ($user->hasRole('ACCOUNTANT') && $attachment->request->status === 'DM_APPROVED') {
            return true;
        }
        
        // Users can view attachments for their own requests
        return $attachment->request->user_id === $user->id;
    }
}