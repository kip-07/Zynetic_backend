import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let bookId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    // Create a test user and get auth token
    const authService = app.get<AuthService>(AuthService);
    const testUser: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    
    try {
      const { access_token } = await authService.signup(testUser);
      authToken = access_token;
    } catch (error) {
      // If user already exists, log in instead
      const { access_token } = await authService.login({
        email: testUser.email,
        password: testUser.password,
      });
      authToken = access_token;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('/books (POST) - should create a new book', () => {
    return request(app.getHttpServer())
      .post('/books')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Book',
        author: 'Test Author',
        category: 'Test Category',
        price: 19.99,
        rating: 4.5,
        publishedDate: '2023-01-01',
      })
      .expect(201)
      .then(response => {
        bookId = response.body._id;
        expect(response.body).toHaveProperty('title', 'Test Book');
      });
  });

  it('/books (GET) - should return all books', () => {
    return request(app.getHttpServer())
      .get('/books')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('books');
        expect(response.body.books).toBeInstanceOf(Array);
      });
  });

  it('/books/:id (GET) - should return a book by ID', () => {
    return request(app.getHttpServer())
      .get(`/books/${bookId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('title', 'Test Book');
      });
  });

  it('/books/:id (PATCH) - should update a book', () => {
    return request(app.getHttpServer())
      .patch(`/books/${bookId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Test Book',
      })
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('title', 'Updated Test Book');
      });
  });

  it('/books (GET) - should filter books by author', () => {
    return request(app.getHttpServer())
      .get('/books?author=Test')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then(response => {
        expect(response.body.books.length).toBeGreaterThan(0);
        expect(response.body.books[0].author).toContain('Test');
      });
  });

  it('/books (GET) - should search books by title', () => {
    return request(app.getHttpServer())
      .get('/books?search=Updated')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then(response => {
        expect(response.body.books.length).toBeGreaterThan(0);
        expect(response.body.books[0].title).toContain('Updated');
      });
  });

  it('/books/:id (DELETE) - should delete a book', () => {
    return request(app.getHttpServer())
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });
}); 