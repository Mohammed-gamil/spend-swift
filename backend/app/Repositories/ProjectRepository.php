<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function getAll(): \Illuminate\Support\Collection
    {
        return Project::all();
    }

    public function getById(int $id): ?Project
    {
        return Project::find($id);
    }
    public function create(array $data): Project
    {
        return Project::create($data);
    }

    public function findById(int $id): ?Project
    {
        return Project::find($id);
    }

    public function update(Project $project, array $data): bool
    {
        return $project->update($data);
    }

    public function delete(Project $project): bool
    {
        return $project->delete();
    }
}