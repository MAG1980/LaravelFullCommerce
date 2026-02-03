<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
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
    }
}
