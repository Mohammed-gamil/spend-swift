<?php

namespace App\Services;

use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;

class ProjectService
{
    protected $repository;

    public function __construct(ProjectRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function createProject(array $data): Project
    {
        $project = $this->repository->create($data);
        $actorId = Auth::id() ?? ($data['user_id'] ?? null);
        ActivityLog::create([
            'loggable_type' => Project::class,
            'loggable_id' => $project->id,
            'user_id' => $actorId,
            'description' => 'Project created',
        ]);

        return $project;
    }

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function getById(int $id): ?Project
    {
        return $this->repository->getById($id);
    }

    public function updateProject(int $id, array $data): ?Project
    {
        $project = $this->repository->findById($id);

        if (!$project) {
            return null;
        }

        $this->repository->update($project, $data);

        $actorId = Auth::id() ?? ($data['user_id'] ?? null);
        ActivityLog::create([
            'loggable_type' => Project::class,
            'loggable_id' => $project->id,
            'user_id' => $actorId,
            'description' => 'Project updated',
        ]);

        return $project;
    }

    public function deleteProject(int $id): bool
    {
        $project = $this->repository->findById($id);

        if (!$project) {
            return false;
        }

        $result = $this->repository->delete($project);

        if ($result) {
            $actorId = Auth::id() ?? null;
            ActivityLog::create([
                'loggable_type' => Project::class,
                'loggable_id' => $project->id,
                'user_id' => $actorId,
                'description' => 'Project deleted',
            ]);
        }

        return $result;
    }
}