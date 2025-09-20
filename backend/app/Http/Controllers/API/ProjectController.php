<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Http\Resources\ProjectResource;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    protected $service;

    public function __construct(ProjectService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $projects = $this->service->getAll();
        return response()->json(ProjectResource::collection($projects));
    }

    public function store(ProjectStoreRequest $request): JsonResponse
    {
        $project = $this->service->createProject($request->validated());
        return response()->json(new ProjectResource($project), 201);
    }

    public function show(int $id): JsonResponse
    {
        $project = $this->service->getById($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json(new ProjectResource($project));
    }

    public function update(ProjectUpdateRequest $request, int $id): JsonResponse
    {
        $project = $this->service->updateProject($id, $request->validated());

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json(new ProjectResource($project));
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->service->deleteProject($id);

        if (!$deleted) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json(['message' => 'Project deleted successfully']);
    }
}