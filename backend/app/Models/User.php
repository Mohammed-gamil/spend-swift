<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable  implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'department_id',
        'direct_manager_id',
        'language_preference',
        'position',
        'phone',
        'bio',
        'avatar',
        'timezone',
        'date_format',
        'currency',
        'notification_preferences',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'notification_preferences' => 'array',
        ];
    }
    
    /**
     * Get the department that the user belongs to.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
    
    /**
     * Get the user's direct manager.
     */
    public function directManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'direct_manager_id');
    }
    
    /**
     * Get the team members of this manager.
     */
    public function teamMembers(): HasMany
    {
        return $this->hasMany(User::class, 'direct_manager_id');
    }
    
    /**
     * Get the requests created by this user.
     */
    public function requests(): HasMany
    {
        return $this->hasMany(Request::class, 'requester_id');
    }
    
    /**
     * Get the approval history for this user.
     */
    public function approvalHistory(): HasMany
    {
        return $this->hasMany(ApprovalHistory::class, 'approver_id');
    }
    
    /**
     * Get the attachments uploaded by this user.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'uploader_id');
    }
    
    /**
     * Get the notifications for this user.
     */
    public function customNotifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
    
    /**
     * Get the audit trails for this user.
     */
    public function auditTrails(): HasMany
    {
        return $this->hasMany(AuditTrail::class);
    }
    
    /**
     * Check if the user is a manager of another user.
     *
     * @param User $user
     * @return bool
     */
    public function isManagerOf(User $user): bool
    {
        return $user->direct_manager_id === $this->id;
    }
    
    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('ADMIN');
    }
    
    /**
     * Check if the user is a direct manager.
     *
     * @return bool
     */
    public function isDirectManager(): bool
    {
        return $this->hasRole('DIRECT_MANAGER');
    }
    
    /**
     * Check if the user is an accountant.
     *
     * @return bool
     */
    public function isAccountant(): bool
    {
        return $this->hasRole('ACCOUNTANT');
    }
    
    /**
     * Check if the user is a final manager.
     *
     * @return bool
     */
    public function isFinalManager(): bool
    {
        return $this->hasRole('FINAL_MANAGER');
    }
    // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

}
