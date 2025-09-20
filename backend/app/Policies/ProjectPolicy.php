<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Project;

class ProjectPolicy
{
    public function create(User $user)
    {
        // Any authenticated user can create a project
        return (bool)$user;
    }

    public function update(User $user, Project $project)
    {
        // Only the project's manager, owner, or admin may update
        return $user->hasRole('admin') || $user->id === $project->manager_id || $user->id === $project->user_id;
    }

    public function delete(User $user, Project $project)
    {
        // Only admin or project owner may delete
        return $user->hasRole('admin') || $user->id === $project->user_id;
    }
}
