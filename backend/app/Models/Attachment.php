<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'request_id',
        'uploader_id',
        'original_filename',
        'storage_path',
        'mime_type',
        'size',
    ];

    /**
     * Get the request that owns the attachment.
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class);
    }

    /**
     * Get the user who uploaded the attachment.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    /**
     * Get the URL for downloading the attachment.
     *
     * @return string
     */
    public function getDownloadUrl(): string
    {
        return url('api/attachments/' . $this->id . '/download');
    }

    /**
     * Get the file size in a human-readable format.
     *
     * @return string
     */
    public function getFormattedSize(): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $size = $this->size;
        $i = 0;

        while ($size > 1024 && $i < 4) {
            $size /= 1024;
            $i++;
        }

        return round($size, 2) . ' ' . $units[$i];
    }

    /**
     * Delete the attachment file from storage when the model is deleted.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function (Attachment $attachment) {
            Storage::delete($attachment->storage_path);
        });
    }
}