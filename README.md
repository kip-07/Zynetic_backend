# Bookstore API

A RESTful API for a Bookstore Application built with NestJS, TypeScript, and MongoDB.

## Features

- User authentication (signup, login) with JWT
- Book management (CRUD operations)
- Filtering and searching books
- Pagination and sorting
- Input validation
- Error handling
- API documentation with Swagger

## Prerequisites

- Node.js (v16 or later)
- MongoDB (v4 or later)
- NestJS CLI - For managing the application

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=7d
   ```
4. Start the application:
   ```bash
   npm run start:dev
   ```
5. Swagger documentation will be available at `http://localhost:3000/api/docs`

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login a user and get JWT token

### Books

- `GET /books` - Get all books (with filtering, pagination, sorting)
- `GET /books/:id` - Get a book by ID
- `POST /books` - Create a new book (protected)
- `PATCH /books/:id` - Update a book (protected)
- `DELETE /books/:id` - Delete a book (protected)

## API Request Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Create a book (requires authentication)

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "price": 19.99,
    "rating": 4.5,
    "publishedDate": "1925-04-10"
  }'
```

### Get all books with filtering

```bash
curl -X GET "http://localhost:3000/books?author=Fitzgerald&category=Fiction&rating=4&page=1&limit=10&sortBy=price&sortOrder=asc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Search books by title

```bash
curl -X GET "http://localhost:3000/books?search=Gatsby" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
src/
├── auth/              # Authentication module
├── books/             # Books module
├── users/             # Users module
├── app.module.ts      # Root module
├── main.ts            # Application entry point

tests/
├── postman/           # Postman collection for API testing
``` 
