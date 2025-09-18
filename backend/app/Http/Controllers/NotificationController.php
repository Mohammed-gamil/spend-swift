<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->get('per_page', 15);
        $read = $request->get('read');
        
        $query = $request->user()->customNotifications();
        
        if ($read === 'true') {
            $query->where('is_read', true);
        } elseif ($read === 'false') {
            $query->where('is_read', false);
        }
        
        $notifications = $query->latest()->paginate($perPage);
        
        return NotificationResource::collection($notifications);
    }

    /**
     * Mark a notification as read.
     *
     * @param Notification $notification
     * @return JsonResponse
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->authorize('update', $notification);
        
        $notification->markAsRead();
        
        return response()->json([
            'message' => 'Notification marked as read'
        ]);
    }

    /**
     * Mark all notifications as read.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->customNotifications()->update(['is_read' => true]);
        
        return response()->json([
            'message' => 'All notifications marked as read'
        ]);
    }
}