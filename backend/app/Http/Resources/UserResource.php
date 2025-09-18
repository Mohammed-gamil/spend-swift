<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'department_id' => $this->department_id,
            'department' => $this->whenLoaded('department', function() {
                return new DepartmentResource($this->department);
            }),
            'direct_manager_id' => $this->direct_manager_id,
            'direct_manager' => $this->whenLoaded('directManager', function() {
                return new UserResource($this->directManager);
            }),
            'language_preference' => $this->language_preference,
            'roles' => $this->whenLoaded('roles', function() {
                return $this->roles->pluck('name');
            }),
            'permissions' => $this->whenLoaded('permissions', function() {
                return $this->getAllPermissions()->pluck('name');
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}