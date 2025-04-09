import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BooksService } from './books.service';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';

const mockBook = {
  _id: 'some-id',
  title: 'Test Book',
  author: 'Test Author',
  category: 'Test Category',
  price: 19.99,
  rating: 4.5,
  publishedDate: new Date('2023-01-01'),
};

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<BookDocument>;

  const mockBookModel = {
    new: jest.fn().mockResolvedValue(mockBook),
    constructor: jest.fn().mockResolvedValue(mockBook),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn().mockResolvedValue(mockBook),
    exec: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<BookDocument>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        category: 'Test Category',
        price: 19.99,
        rating: 4.5,
        publishedDate: new Date('2023-01-01'),
      };

      const createdBook = { ...mockBook, save: jest.fn().mockResolvedValue(mockBook) };
      jest.spyOn(model, 'create').mockResolvedValue(createdBook as any);
      
      const result = await service.create(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const queryParams = {
        page: 1,
        limit: 10,
      };
      
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce([mockBook]),
            }),
          }),
        }),
      } as any);
      
      jest.spyOn(model, 'countDocuments').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(1),
      } as any);

      const result = await service.findAll(queryParams);
      
      expect(result).toEqual({
        books: [mockBook],
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should find and return a book by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockBook),
      } as any);
      
      const result = await service.findOne('some-id');
      
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
      };
      
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          ...mockBook,
          title: 'Updated Title',
        }),
      } as any);
      
      const result = await service.update('some-id', updateBookDto);
      
      expect(result.title).toEqual('Updated Title');
    });

    it('should throw NotFoundException if book to update is not found', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
      };
      
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.update('non-existent-id', updateBookDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the book', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockBook),
      } as any);
      
      await expect(service.remove('some-id')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if book to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
}); 