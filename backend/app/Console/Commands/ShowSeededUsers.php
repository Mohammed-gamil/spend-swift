<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ShowSeededUsers extends Command
{
    protected $signature = 'dev:show-seeded-users';
    protected $description = 'Display seeded user credentials (development only)';

    public function handle()
    {
        if (!app()->environment('local')) {
            $this->error('This command is only available in the local environment.');
            return 1;
        }

        $path = storage_path('app/seeded_users.json');
        if (!file_exists($path)) {
            $this->error('No seeded_users.json found. Run the seeder first.');
            return 1;
        }

        $json = json_decode(file_get_contents($path), true);
        foreach ($json as $u) {
            $this->info("Seeded user: {$u['email']} | password: {$u['password']} | role: {$u['role']}");
        }

        return 0;
    }
}
