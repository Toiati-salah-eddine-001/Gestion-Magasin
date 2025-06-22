# Store Management System - Laravel API Backend

A comprehensive Laravel API backend for the Store Management System (نظام إدارة المتجر) that supports inventory management, point of sale, user management, and reporting features.

## Features

- **Authentication**: Token-based authentication using Laravel Sanctum
- **Dashboard**: Real-time statistics and metrics
- **Inventory Management**: CRUD operations for products with barcode support
- **Point of Sale**: Sales transactions with multiple payment methods
- **User Management**: Role-based user management system
- **Reports**: Sales, inventory, and profit/loss reports
- **Settings**: Configurable store and system settings

## Requirements

- PHP 8.2 or higher
- Composer
- MySQL 8.0 or higher (or SQLite for development)
- Laravel 11.x

## Installation

### 1. Install Dependencies

```bash
cd laravel-backend
composer install
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Configuration

Edit the `.env` file with your database credentials:

```env
# For MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=store_management
DB_USERNAME=root
DB_PASSWORD=your_password

# For SQLite (development)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### 4. Create Database

For MySQL:
```sql
CREATE DATABASE store_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

For SQLite:
```bash
touch database/database.sqlite
```

### 5. Run Migrations and Seeders

```bash
# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

### 6. Start the Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## Default Users

After running the seeders, you can login with these default accounts:

| Role | Email | Password |
|------|-------|----------|
| مدير (Admin) | admin@store.com | password123 |
| موظف مبيعات (Sales) | sales@store.com | password123 |
| أمين مخزن (Warehouse) | warehouse@store.com | password123 |
| محاسب (Accountant) | accountant@store.com | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get authenticated user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/sales-chart` - Get sales chart data
- `GET /api/dashboard/top-products` - Get top selling products

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product details
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search` - Search products
- `GET /api/products/barcode` - Get product by barcode
- `PUT /api/products/{id}/stock` - Update product stock

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/sales/{id}` - Get sale details
- `PUT /api/sales/{id}/status` - Update sale status
- `GET /api/sales/statistics` - Get sales statistics

### Users (Admin only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `PUT /api/users/{id}/reset-password` - Reset user password
- `PUT /api/users/{id}/toggle-status` - Toggle user status

### Reports
- `GET /api/reports/sales` - Sales reports
- `GET /api/reports/inventory` - Inventory reports
- `GET /api/reports/profit-loss` - Profit and loss reports

### Settings (Admin only)
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings
- `PUT /api/settings/store` - Update store settings
- `PUT /api/settings/printing` - Update printing settings
- `PUT /api/settings/system` - Update system settings

## Frontend Integration

To connect your Next.js frontend to this Laravel backend:

1. Update your frontend API base URL to `http://localhost:8000/api`
2. Use the authentication endpoints to get access tokens
3. Include the Bearer token in all authenticated requests:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
     'Accept': 'application/json'
   }
   ```

## Example API Usage

### Login
```javascript
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@store.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.data.token;
```

### Get Products
```javascript
const response = await fetch('http://localhost:8000/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});

const products = await response.json();
```

### Create Sale
```javascript
const response = await fetch('http://localhost:8000/api/sales', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    items: [
      {
        product_id: 1,
        quantity: 2
      }
    ],
    payment_method: 'cash',
    discount_percent: 5
  })
});

const sale = await response.json();
```

## Database Schema

### Users
- id, name, email, password, role, is_active, timestamps

### Products
- id, name, barcode, quantity, price, cost_price, description, image, min_stock_level, is_active, timestamps

### Sales
- id, user_id, invoice_number, subtotal, discount_percent, discount_amount, total, payment_method, status, notes, timestamps

### Sale Items
- id, sale_id, product_id, quantity, unit_price, total_price, timestamps

### Settings
- id, key, value, type, group, description, timestamps

## Troubleshooting

### Common Issues

1. **CORS Issues**: Make sure your frontend URL is added to the CORS configuration
2. **Database Connection**: Verify your database credentials in `.env`
3. **Permission Issues**: Ensure proper file permissions for storage and bootstrap/cache directories
4. **Token Issues**: Make sure you're including the Bearer token in authenticated requests

### Logs

Check Laravel logs for detailed error information:
```bash
tail -f storage/logs/laravel.log
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
