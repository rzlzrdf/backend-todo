# Authentication API Documentation

This document describes the authentication endpoints for user registration and login.

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Register User
**POST** `/auth/register`

Registers a new user with hashed password and returns JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "fullname": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "fullname": "John Doe",
    "created_at": "2024-08-12T19:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User
**POST** `/auth/login`

Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "fullname": "John Doe",
    "created_at": "2024-08-12T19:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Error Responses

### 409 Conflict (Email already exists)
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

### 401 Unauthorized (Invalid credentials)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "fullname should not be empty"
  ],
  "error": "Bad Request"
}
```

## Using JWT Token

After receiving the JWT token, include it in the Authorization header for protected routes:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/todos
```

## Example Usage with curl

### Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123",
    "fullname": "John Doe"
  }'
```

### Login with existing user
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Use JWT token for protected routes
```bash
# First, get the token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Then use it in subsequent requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/todos
```

## Security Features

### Password Hashing
- Passwords are hashed using bcrypt with salt rounds of 10
- Original passwords are never stored in the database

### JWT Token
- Tokens expire after 24 hours
- Contains user ID, email, and fullname
- Used for authentication on protected routes

### Input Validation
- Email format validation
- Password minimum length (6 characters)
- Required field validation

## Environment Variables

Make sure your `.env` file contains:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Protected Routes

To protect routes with JWT authentication, use the `@UseGuards(JwtAuthGuard)` decorator:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class TodoController {
  // ... controller methods
}
```

Or protect individual routes:

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Request() req) {
  return req.user;
}
```

## Next Steps

1. **Test the registration endpoint** with a new user
2. **Test the login endpoint** with the registered user
3. **Use the JWT token** to access protected routes
4. **Implement protected routes** using `@UseGuards(JwtAuthGuard)`
5. **Add password reset functionality** if needed
6. **Add email verification** for enhanced security
