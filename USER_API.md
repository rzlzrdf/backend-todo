# User API Documentation

This document describes the REST API endpoints for managing the user table.

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Create User
**POST** `/users`

Creates a new user.

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
  "id": 1,
  "email": "john.doe@example.com",
  "password": "password123",
  "fullname": "John Doe",
  "created_at": "2024-08-12T19:30:00.000Z"
}
```

### 2. Get All Users
**GET** `/users`

Retrieves all users, ordered by creation date (newest first).

**Response:**
```json
[
  {
    "id": 1,
    "email": "john.doe@example.com",
    "password": "password123",
    "fullname": "John Doe",
    "created_at": "2024-08-12T19:30:00.000Z"
  },
  {
    "id": 2,
    "email": "jane.smith@example.com",
    "password": "password456",
    "fullname": "Jane Smith",
    "created_at": "2024-08-12T19:25:00.000Z"
  }
]
```

### 3. Get User by ID
**GET** `/users/:id`

Retrieves a specific user by their ID.

**Response:**
```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "password": "password123",
  "fullname": "John Doe",
  "created_at": "2024-08-12T19:30:00.000Z"
}
```

### 4. Update User
**PATCH** `/users/:id`

Updates a specific user.

**Request Body:**
```json
{
  "email": "john.updated@example.com",
  "fullname": "John Updated"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "john.updated@example.com",
  "password": "password123",
  "fullname": "John Updated",
  "created_at": "2024-08-12T19:30:00.000Z"
}
```

### 5. Delete User
**DELETE** `/users/:id`

Deletes a specific user.

**Response:**
```
204 No Content
```

## Data Types

### User Object
```typescript
interface User {
  id: number;           // Primary key (auto-generated)
  email: string;        // Unique email address
  password: string;     // User password
  fullname: string;     // User's full name
  created_at: string;   // Creation timestamp (auto-generated)
}
```

## Error Responses

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User with ID 999 not found",
  "error": "Not Found"
}
```

### 409 Conflict (Email already exists)
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
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

## Example Usage with curl

### Create a user
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123",
    "fullname": "John Doe"
  }'
```

### Get all users
```bash
curl http://localhost:3000/users
```

### Get user by ID
```bash
curl http://localhost:3000/users/1
```

### Update a user
```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.updated@example.com",
    "fullname": "John Updated"
  }'
```

### Delete a user
```bash
curl -X DELETE http://localhost:3000/users/1
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Password Storage**: Currently, passwords are stored in plain text. In production, you should:
   - Hash passwords using bcrypt or similar
   - Never return passwords in API responses
   - Use environment variables for salt rounds

2. **Authentication**: This API doesn't include authentication. In production, you should:
   - Implement JWT or session-based authentication
   - Add authorization middleware
   - Restrict RLS policies based on user roles

3. **Email Validation**: Consider adding email verification functionality

4. **Rate Limiting**: Implement rate limiting to prevent abuse

## Database Setup

Run the SQL script `create_user_table.sql` in your Supabase SQL Editor to create the user table with proper RLS policies.

## Next Steps

1. Implement password hashing
2. Add authentication middleware
3. Create login/logout endpoints
4. Add email verification
5. Implement proper authorization
6. Add password reset functionality
