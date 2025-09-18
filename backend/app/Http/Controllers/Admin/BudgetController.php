<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BudgetController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        $budgets = Budget::with(['department'])->get();
        
        return BudgetResource::collection($budgets);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreBudgetRequest $request
     * @return JsonResponse
     */
    public function store(StoreBudgetRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Check if department exists
        $department = Department::findOrFail($data['department_id']);
        
        // Check if a budget for this department and fiscal year already exists
        $existingBudget = Budget::where('department_id', $data['department_id'])
            ->where('fiscal_year', $data['fiscal_year'])
            ->first();
            
        if ($existingBudget) {
            return response()->json([
                'message' => 'A budget for this department and fiscal year already exists'
            ], 422);
        }
        
        $budget = Budget::create($data);
        
        return response()->json([
            'message' => 'Budget created successfully',
            'budget' => new BudgetResource($budget->load('department'))
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Budget $budget
     * @return JsonResponse
     */
    public function show(Budget $budget): JsonResponse
    {
        $budget->load('department');
        
        return response()->json([
            'budget' => new BudgetResource($budget)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateBudgetRequest $request
     * @param Budget $budget
     * @return JsonResponse
     */
    public function update(UpdateBudgetRequest $request, Budget $budget): JsonResponse
    {
        $data = $request->validated();
        
        // If changing department or fiscal year, check for conflicts
        if ((isset($data['department_id']) && $data['department_id'] != $budget->department_id) ||
            (isset($data['fiscal_year']) && $data['fiscal_year'] != $budget->fiscal_year)) {
            
            $departmentId = $data['department_id'] ?? $budget->department_id;
            $fiscalYear = $data['fiscal_year'] ?? $budget->fiscal_year;
            
            $existingBudget = Budget::where('department_id', $departmentId)
                ->where('fiscal_year', $fiscalYear)
                ->where('id', '!=', $budget->id)
                ->first();
                
            if ($existingBudget) {
                return response()->json([
                    'message' => 'A budget for this department and fiscal year already exists'
                ], 422);
            }
        }
        
        $budget->update($data);
        
        return response()->json([
            'message' => 'Budget updated successfully',
            'budget' => new BudgetResource($budget->load('department'))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Budget $budget
     * @return JsonResponse
     */
    public function destroy(Budget $budget): JsonResponse
    {
        // Check if there are allocated funds
        if ($budget->spent_amount > 0) {
            return response()->json([
                'message' => 'Cannot delete a budget with allocated funds'
            ], 422);
        }
        
        $budget->delete();
        
        return response()->json([
            'message' => 'Budget deleted successfully'
        ]);
    }
}