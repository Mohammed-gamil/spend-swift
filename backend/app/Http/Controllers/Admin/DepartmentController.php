<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        $departments = Department::with(['budget'])->get();
        
        return DepartmentResource::collection($departments);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreDepartmentRequest $request
     * @return JsonResponse
     */
    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = Department::create($request->validated());
        
        return response()->json([
            'message' => 'Department created successfully',
            'department' => new DepartmentResource($department)
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Department $department
     * @return JsonResponse
     */
    public function show(Department $department): JsonResponse
    {
        $department->load(['budget', 'users']);
        
        return response()->json([
            'department' => new DepartmentResource($department)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateDepartmentRequest $request
     * @param Department $department
     * @return JsonResponse
     */
    public function update(UpdateDepartmentRequest $request, Department $department): JsonResponse
    {
        $department->update($request->validated());
        
        return response()->json([
            'message' => 'Department updated successfully',
            'department' => new DepartmentResource($department)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Department $department
     * @return JsonResponse
     */
    public function destroy(Department $department): JsonResponse
    {
        // Check if department has users
        if ($department->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete department with associated users'
            ], 422);
        }
        
        $department->delete();
        
        return response()->json([
            'message' => 'Department deleted successfully'
        ]);
    }
}