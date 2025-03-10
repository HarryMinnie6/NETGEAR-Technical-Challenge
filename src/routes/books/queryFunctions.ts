import { logger } from '../../utils/logger';
import { sequelize } from '../../utils/dbConfig';
import { Book } from '../../models/BookModel';
import { CustomGenericResponse } from '../../types/CustomGenericResponse';

// Function to add a new book
export const addBook = async (
  title: string,
  author: string,
  genre: string,
  published_date: string,
  total_copies: number,
): Promise<CustomGenericResponse> => {
  logger.info('Accessing adding book');
  await sequelize.sync(); // Creates tables for me.
  try {
    logger.info(`Adding book ${title} to database`);
    const book = await Book.create({
      title,
      author,
      published_date,
      genre,
      total_copies,
      copies_available: total_copies,
    });
    logger.info(`Success adding book ${title}`);
    return { statusCode: 200, message: `Success adding book ${title}`, data: book.toJSON() };
  } catch (error) {
    logger.error({ message: 'Error Adding book', error: `${error}` });
    return { statusCode: 500, message: `Error adding book: ${error}` };
  }
};

// Function to fetch all books
export const getAllBooks = async (): Promise<CustomGenericResponse> => {
  try {
    const response = await Book.findAll();
    logger.info(`Successfully retrieved all books`);
    return { statusCode: 200, message: `Successfully retrieved all books`, data: response };
  } catch (error) {
    logger.error({ message: `Error occurred while getting all books`, error: `${error}` });
    return { statusCode: 500, message: `Error occurred while getting all books` };
  }
};

export const deletebook = async (bookId: number): Promise<CustomGenericResponse> => {
  try {
    const result = await Book.destroy({ where: { id: bookId } });
    if (result === 0) {
      logger.warn(`No book to delete with id: ${bookId}`);
      return { statusCode: 404, message: `No book to delete with id: ${bookId}` };
    }
    logger.info(`Book deleted with id: ${bookId}`);
    return { statusCode: 200, message: `Book deleted with id: ${bookId}` };
  } catch (error) {
    logger.error({
      message: `Error occurred while deleting the book ${bookId}`,
      error: `${error}`,
    });
    return { statusCode: 500, message: `Error occurred while deleting the book ${bookId}` };
  }
};

// Function to update an existing book
export const updateBook = async (bookId: number, updates: any): Promise<CustomGenericResponse> => {
  logger.info(`Accessing update for book with id: ${bookId}`);
  await sequelize.sync();

  try {
    logger.info(`Updating book with id: ${bookId}`);
    const book = await Book.findByPk(bookId);
    if (!book) {
      logger.warn(`No book found with id ${bookId}`);
      return { statusCode: 404, message: `Book with id ${bookId} not found` };
    }

    // only update the book details and not the amount available.
    const { quantityAvailable, ...filteredUpdates } = updates;

    await book.update(filteredUpdates);
    logger.info(`Success updating book details with id: ${bookId}`);

    return {
      statusCode: 200,
      message: `Success updating book details with id: ${bookId}`,
      data: book.toJSON(),
    };
  } catch (error) {
    logger.error({ message: `Error updating book with id: ${bookId}`, error: `${error}` });
    return { statusCode: 500, message: `Error updating book with id: ${bookId}` };
  }
};
