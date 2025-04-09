import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async findAll(queryBookDto: QueryBookDto): Promise<{ books: Book[]; total: number; page: number; limit: number }> {
    const { 
      author, 
      category, 
      rating, 
      search, 
      page = 1, 
      limit = 10, 
      sortBy,
      sortOrder = 'asc'
    } = queryBookDto;

    // Build filter query
    const query: any = {};
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (rating) {
      query.rating = { $gte: rating };
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Build sort query
    const sortQuery: any = {};
    if (sortBy) {
      sortQuery[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const [books, total] = await Promise.all([
      this.bookModel
        .find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookModel.countDocuments(query).exec(),
    ]);

    return {
      books,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Book> {
    // Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    try {
      const book = await this.bookModel.findById(id).exec();
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return book;
    } catch (error) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    // Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    try {
      const updatedBook = await this.bookModel
        .findByIdAndUpdate(id, { $set: updateBookDto }, { new: true })
        .exec();
      
      if (!updatedBook) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      
      return updatedBook;
    } catch (error) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    // Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    try {
      const result = await this.bookModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
    } catch (error) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
}