<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = User::query();
        
        if ($request->has('department_id')) {
            $query->where('department_id', $request->get('department_id'));
        }
        
        if ($request->has('role')) {
            $query->whereHas('roles', function($q) use ($request) {
                $q->where('name', $request->get('role'));
            });
        }
        
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }
        
        $users = $query->with(['roles', 'department', 'directManager'])
            ->paginate($request->get('per_page', 15));
        
        return UserResource::collection($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        
        $user = User::create($data);
        
        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }
        
        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user->load(['roles', 'department', 'directManager']))
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['roles', 'permissions', 'department', 'directManager']);
        
        return response()->json([
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();
        
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        $user->update($data);
        
        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }
        
        return response()->json([
            'message' => 'User updated successfully',
            'user' => new UserResource($user->load(['roles', 'department', 'directManager']))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function destroy(User $user): JsonResponse
    {
        // Prevent deleting yourself
        if (auth()->id() === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }
        
        $user->delete();
        
        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Assign a role to a user.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function assignRole(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'role' => 'required|exists:roles,name'
        ]);
        
        $role = Role::where('name', $request->role)->firstOrFail();
        $user->assignRole($role);
        
        return response()->json([
            'message' => "Role {$role->name} assigned to {$user->name} successfully",
            'user' => new UserResource($user->load('roles'))
        ]);
    }
}