<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## SpendSwift Additions (Auth, Roles & Permissions)

### Overview
This project uses:

* JWT auth guard (`api`) via `tymon/jwt-auth`.
* Spatie Laravel Permission for roles & permissions.
* Middleware usage on routes like: `->middleware('permission:requests.view.own')`.

### Common Problem: 403 Though User “Has” Permission
If you see a `403 Forbidden` but the permission name exists, the most common root cause is a **guard mismatch**.

Spatie stores a `guard_name` on each `roles` and `permissions` record. If they were created under the default `web` guard but you authenticate with the `api` guard (JWT), permission checks will fail silently and return 403.

#### How We Fixed It
We added a seeder `PermissionsGuardFixSeeder` that:
1. Ensures all expected permissions exist with `guard_name = api`.
2. Ensures roles exist & syncs their permissions.
3. Ensures the test user `test@example.com` exists and has the `USER` role.
4. Clears the Spatie permission cache.

Run it manually anytime:
```bash
php artisan db:seed --class=PermissionsGuardFixSeeder
```

### Auditing Guards
Use the custom artisan command to audit (and optionally fix) mismatches:
```bash
php artisan permissions:audit
php artisan permissions:audit --fix   # will prompt & then align guards to 'api'
```

### Creating a Sample Request (Manual Check)
After authenticating and acquiring a JWT token:
```bash
curl -H "Authorization: Bearer <TOKEN>" -H "Accept: application/json" http://127.0.0.1:8000/api/requests
```
If empty object `{}` is returned, the permission is working (no data yet). Create a request via the appropriate POST endpoint (once implemented) and re-list.

### Testing Notes
Feature tests for permissions (`tests/Feature/PermissionsTest.php`) rely on a working database driver. If `pdo_sqlite` is not enabled you will see errors like `could not find driver`.

Options:
1. Enable SQLite in `php.ini` (uncomment `extension=sqlite3` and `extension=pdo_sqlite`).
2. Or create a MySQL test database & adjust `phpunit.xml` / `.env.testing`:
	```env
	DB_CONNECTION=mysql
	DB_HOST=127.0.0.1
	DB_PORT=3306
	DB_DATABASE=spendswift_test
	DB_USERNAME=root
	DB_PASSWORD=secret
	```
3. Or temporarily skip the test suite (it auto-skips if the DB driver truly cannot be initialized before schema access).

### Quick Troubleshooting Checklist
| Symptom | Likely Cause | Action |
|---------|--------------|-------|
| 401 Unauthorized | Missing/expired JWT | Re-login and use fresh token |
| 403 Forbidden (has role) | Guard mismatch | Run `permissions:audit --fix` |
| 500 after adding middleware | Missing middleware alias | Ensure aliases in `bootstrap/app.php` |
| Permissions missing after deploy | Cache stale | `php artisan permission:cache-reset` |

### Useful Commands
```bash
php artisan permissions:audit
php artisan permissions:audit --fix
php artisan tinker --execute="echo auth('api')->user()?->can('requests.view.own');"
php artisan jwt:secret        # regenerate JWT secret (only on fresh setup)
```

## Production Deployment Runbook

1. Copy `.env.example` to `.env` and set:
	- `APP_ENV=production`
	- `APP_DEBUG=false`
	- `APP_URL=https://your-domain`
	- Set secure `APP_KEY` (generated automatically if missing)
	- Configure mail, queue, cache, session, logging channels
	- Set correct DB credentials
	- Run `php artisan jwt:secret` once (stores JWT key in `.env`)
2. Install dependencies (no dev):
	```bash
	composer install --no-dev --prefer-dist --optimize-autoloader
	npm ci --omit=dev  # if building front-end separately, else run build then copy assets
	```
3. Run migrations & seed base permissions only:
	```bash
	php artisan migrate --force
	php artisan db:seed --class=BasePermissionsSeeder --force
	```
4. Create initial admin user (tinker example):
	```bash
	php artisan tinker --execute="\\$u=App\\Models\\User::create(['name'=>'Admin','email'=>'admin@company.com','password'=>bcrypt('ChangeMe123!')]); \\$u->assignRole('ADMIN');"
	```
5. Cache & optimize:
	```bash
	php artisan config:cache
	php artisan route:cache
	php artisan view:cache
	php artisan event:cache
	php artisan optimize
	```
6. Queue / Scheduler:
	- Supervisor sample: run `php artisan queue:work --sleep=3 --tries=3 --max-time=3600`
	- Cron: `* * * * * php /path/artisan schedule:run >> /dev/null 2>&1`
7. Log rotation & retention: configure system logrotate (avoid giant `storage/logs/laravel.log`).
8. Security Hardening:
	- Force HTTPS (web server / `APP_URL`)
	- Set proper CORS rules (`config/cors.php`)
	- Set `SESSION_SECURE_COOKIE=true` behind TLS
	- Regenerate JWT secret for production only; never commit it
	- Keep `APP_DEBUG=false`
9. Monitoring & Health:
	- Add a `/health` route returning DB + cache status.
	- Instrument queue failure notifications.
10. Disaster Recovery:
	- Automated DB backups
	- Store `.env` securely (vault) & never in VCS

### Recovery Scenario (If Permissions Break in Prod)
1. Run audit: `php artisan permissions:audit`
2. If mismatches exist: `php artisan permissions:audit --fix`
3. Clear caches: `php artisan permission:cache-reset && php artisan optimize:clear`
4. If still failing, reseed base (idempotent): `php artisan db:seed --class=BasePermissionsSeeder --force`

### Avoid in Production
| Action | Why Avoid |
|--------|-----------|
| Running full `DatabaseSeeder` | Seeds demo users & random budgets |
| `php artisan migrate:fresh` | Drops data; prefer normal migrations |
| Committing `.env` | Security risk |
| Leaving `APP_DEBUG=true` | Exposes stack traces |


---
