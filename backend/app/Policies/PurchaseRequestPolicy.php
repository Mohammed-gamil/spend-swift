<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PurchaseRequest;

class PurchaseRequestPolicy
{
    public function view(User $user, PurchaseRequest $pr)
    {
        return $user->hasRole('admin') || $user->hasRole('manager') || $pr->user_id === $user->id;
    }

    public function approve(User $user, PurchaseRequest $pr)
    {
        return $user->hasRole('manager') || $user->hasRole('admin');
    }

    public function create(User $user)
    {
        return $user->hasRole('user') || $user->hasRole('admin');
    }

    public function update(User $user, PurchaseRequest $pr)
    {
        return $pr->user_id === $user->id || $user->hasRole('admin');
    }

    public function delete(User $user, PurchaseRequest $pr)
    {
        return $pr->user_id === $user->id || $user->hasRole('admin');
    }
}
