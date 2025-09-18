<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        $roles = Role::with('permissions')->get();
        
        return RoleResource::collection($roles);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);
        
        $role = Role::create(['name' => $request->name]);
        
        if ($request->has('permissions')) {
            $permissions = Permission::whereIn('name', $request->permissions)->get();
            $role->syncPermissions($permissions);
        }
        
        return response()->json([
            'message' => 'Role created successfully',
            'role' => new RoleResource($role->load('permissions'))
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Role $role
     * @return JsonResponse
     */
    public function show(Role $role): JsonResponse
    {
        $role->load('permissions');
        
        return response()->json([
            'role' => new RoleResource($role)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Role $role
     * @return JsonResponse
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'name' => "required|string|max:255|unique:roles,name,{$role->id}",
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);
        
        $role->update(['name' => $request->name]);
        
        if ($request->has('permissions')) {
            $permissions = Permission::whereIn('name', $request->permissions)->get();
            $role->syncPermissions($permissions);
        }
        
        return response()->json([
            'message' => 'Role updated successfully',
            'role' => new RoleResource($role->load('permissions'))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Role $role
     * @return JsonResponse
     */
    public function destroy(Role $role): JsonResponse
    {
        // Check if role is in use
        if ($role->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete a role that is assigned to users'
            ], 422);
        }
        
        // Prevent deleting core roles
        $coreRoles = ['ADMIN', 'USER', 'DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER'];
        if (in_array($role->name, $coreRoles)) {
            return response()->json([
                'message' => 'Cannot delete a core system role'
            ], 422);
        }
        
        $role->delete();
        
        return response()->json([
            'message' => 'Role deleted successfully'
        ]);
    }
}