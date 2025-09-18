<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Broadcast;

class NotificationService
{
    /**
     * Send a notification to a specific user.
     *
     * @param int $userId
     * @param string $message
     * @param string|null $link
     * @return Notification
     */
    public function sendNotification(int $userId, string $message, ?string $link = null): Notification
    {
        $notification = Notification::create([
            'user_id' => $userId,
            'message' => $message,
            'link' => $link,
            'is_read' => false,
        ]);

        // Broadcast notification to user
        // This would be used if we implement real-time notifications with Laravel Echo
        // Broadcast::channel('App.Models.User.' . $userId, $notification);

        return $notification;
    }

    /**
     * Send notifications to multiple users.
     *
     * @param array $userIds
     * @param string $message
     * @param string|null $link
     * @return array
     */
    public function sendNotificationToMany(array $userIds, string $message, ?string $link = null): array
    {
        $notifications = [];

        foreach ($userIds as $userId) {
            $notifications[] = $this->sendNotification($userId, $message, $link);
        }

        return $notifications;
    }

    /**
     * Get notifications for the authenticated user.
     *
     * @param bool $includeRead Whether to include read notifications
     * @param int $limit Limit the number of notifications to return
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserNotifications(bool $includeRead = true, int $limit = 50)
    {
        $query = Notification::where('user_id', Auth::id());

        if (!$includeRead) {
            $query->where('is_read', false);
        }

        return $query->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Mark a notification as read.
     *
     * @param int $notificationId
     * @return Notification
     */
    public function markAsRead(int $notificationId): Notification
    {
        $notification = Notification::findOrFail($notificationId);
        
        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== Auth::id()) {
            throw new \Exception('Unauthorized access to notification');
        }

        $notification->is_read = true;
        $notification->save();

        return $notification;
    }

    /**
     * Mark all notifications as read for the authenticated user.
     *
     * @return int Number of notifications marked as read
     */
    public function markAllAsRead(): int
    {
        return Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    /**
     * Delete a notification.
     *
     * @param int $notificationId
     * @return bool
     */
    public function deleteNotification(int $notificationId): bool
    {
        $notification = Notification::findOrFail($notificationId);
        
        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== Auth::id()) {
            throw new \Exception('Unauthorized access to notification');
        }

        return $notification->delete();
    }

    /**
     * Get the count of unread notifications for the authenticated user.
     *
     * @return int
     */
    public function getUnreadCount(): int
    {
        return Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->count();
    }
}