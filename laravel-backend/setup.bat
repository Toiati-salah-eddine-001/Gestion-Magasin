@echo off
echo ========================================
echo Store Management System - Laravel Setup
echo ========================================
echo.

echo [1/6] Installing Composer dependencies...
call composer install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/6] Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo Environment file created from .env.example
) else (
    echo Environment file already exists
)

echo.
echo [3/6] Generating application key...
call php artisan key:generate
if %errorlevel% neq 0 (
    echo Error: Failed to generate application key
    pause
    exit /b 1
)

echo.
echo [4/6] Creating SQLite database...
if not exist database\database.sqlite (
    type nul > database\database.sqlite
    echo SQLite database file created
) else (
    echo SQLite database file already exists
)

echo.
echo [5/6] Running database migrations...
call php artisan migrate --force
if %errorlevel% neq 0 (
    echo Error: Failed to run migrations
    pause
    exit /b 1
)

echo.
echo [6/6] Seeding database with sample data...
call php artisan db:seed --force
if %errorlevel% neq 0 (
    echo Error: Failed to seed database
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Default login credentials:
echo Email: admin@store.com
echo Password: password123
echo.
echo To start the development server, run:
echo php artisan serve
echo.
echo The API will be available at: http://localhost:8000
echo.
pause
