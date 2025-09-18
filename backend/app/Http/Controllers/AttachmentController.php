<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttachmentRequest;
use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use App\Models\Request;
use App\Services\AttachmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    protected $attachmentService;

    /**
     * AttachmentController constructor.
     *
     * @param AttachmentService $attachmentService
     */
    public function __construct(AttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreAttachmentRequest $request
     * @param Request $parentRequest
     * @return JsonResponse
     */
    public function store(StoreAttachmentRequest $request, Request $parentRequest): JsonResponse
    {
        $this->authorize('addAttachment', $parentRequest);
        
        $attachment = $this->attachmentService->storeAttachment(
            $request->file('file'),
            $parentRequest,
            $request->user()
        );
        
        return response()->json([
            'message' => 'File uploaded successfully',
            'attachment' => new AttachmentResource($attachment)
        ], 201);
    }

    /**
     * Download an attachment.
     *
     * @param Attachment $attachment
     * @return Response
     */
    public function download(Attachment $attachment): Response
    {
        $this->authorize('download', $attachment);
        
        $filePath = Storage::path($attachment->storage_path);
        
        return response()->download(
            $filePath,
            $attachment->original_filename,
            ['Content-Type' => $attachment->mime_type]
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Attachment $attachment
     * @return JsonResponse
     */
    public function destroy(Attachment $attachment): JsonResponse
    {
        $this->authorize('delete', $attachment);
        
        $this->attachmentService->deleteAttachment($attachment);
        
        return response()->json([
            'message' => 'File deleted successfully'
        ]);
    }
}