<?php

namespace Database\Seeders;

use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'username' => 'testUser',
            'email' => 'test@example.com',
            'avatar' => 'default.svg',
            'phone' => '89008887766',
            'address' => '321 Main St',
            'password' => Hash::make('password'),
            'role' => 'user',
            'status' => 'active',
        ]);
        $this->call(AdminSeeder::class);
    }
}
