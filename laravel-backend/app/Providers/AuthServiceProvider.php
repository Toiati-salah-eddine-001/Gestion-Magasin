<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Define gates for user permissions based on roles
        
        // Admin can manage users
        Gate::define('manage-users', function (User $user) {
            Log::info('Gate check', ['user_id' => $user->id, 'is_admin' => $user->is_admin, 'isAdmin' => $user->isAdmin()]);
            return $user->isAdmin(); // Admins can manage users
        });

        // Admin can manage settings
        Gate::define('manage-settings', function (User $user) {
            return $user->isAdmin();
        });

        // Users who can manage inventory
        Gate::define('manage-inventory', function (User $user) {
            return $user->canManageInventory();
        });

        // Users who can make sales
        Gate::define('make-sales', function (User $user) {
            return $user->canMakeSales();
        });

        // Users who can view reports (admin and accountant)
        Gate::define('view-reports', function (User $user) {
            return in_array($user->role, ['مدير', 'محاسب']);
        });

        // Users who can view detailed financial reports (admin only)
        Gate::define('view-financial-reports', function (User $user) {
            return $user->isAdmin();
        });
    }
}
