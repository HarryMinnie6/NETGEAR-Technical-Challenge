import { logger } from "../../utils/logger";
import { sequelize } from "../../utils/dbConfig"
import { Book } from '../../models/BookModel';
import { BookReservation } from '../../models/BookReservationModel';
import { CustomGenericResponse } from '../../types/CustomGenericResponse';

// Function to add a new book
export const addBook = async (title: string, author: string, genre: string, publishedYear: string, totalCopies: number): Promise<CustomGenericResponse> => {
  logger.info("Accessing adding book");
  await sequelize.sync(); // Creates tables for me.
  try {
    logger.info(`Adding book ${title} to database`)
    const book = await Book.create({ title, author, publishedYear, genre, totalCopies, copiesAvailable: totalCopies });
    logger.info(`Success adding book ${title}`)
    return { statusCode: 200, message: `Success adding book ${title}`, data: book.toJSON() };
  } catch (error) {
    logger.error({ message: "Error Adding book", error: `${error}` });
    return { statusCode: 500, message: `Error adding book: ${error}` }
  }

};

// Function to fetch all books
export const getAllBooks = async (): Promise<CustomGenericResponse> => {
  try {
    const response = await Book.findAll();
    logger.info(`Successfully retrieved all books`)
    return { statusCode: 200, message: `Successfully retrieved all books`, data: response }
  } catch (error) {
    logger.error(`Error occurred while getting all books`);
    return { statusCode: 500, message: `Error occurred while getting all books` };
  }
};

export const deletebook = async (bookId: number): Promise<CustomGenericResponse> => {
  try {
    const result = await Book.destroy({ where: { id: bookId } });
    if (result === 0) {
      logger.info(`No book to delete with id: ${bookId}`)
      return { statusCode: 404, message: `No book to delete with id: ${bookId}` };
    }
    logger.info(`Book deleted with id: ${bookId}`)
    return { statusCode: 200, message: `Book deleted with id: ${bookId}` };
  } catch (error) {
    logger.error(`Error occurred while deleting the book ${bookId}`, error);
    return { statusCode: 500, message: `Error occurred while deleting the book ${bookId}` };
  }
}

// Function to update an existing book
export const updateBook = async (bookId: number, updates: any): Promise<CustomGenericResponse> => {
  logger.info(`Accessing update for book with id: ${bookId}`);
  await sequelize.sync();

  try {
    logger.info(`Updating book with id: ${bookId}`);
    const book = await Book.findByPk(bookId);
    if (!book) {
      logger.info(`No book found with id ${bookId}`);
      return { statusCode: 404, message: `Book with id ${bookId} not found` };
    }

    // only update the book details and not the amount available. 
    const { quantityAvailable, ...filteredUpdates } = updates;

    await book.update(filteredUpdates);
    logger.info(`Success updating book details with id: ${bookId}`);

    return { statusCode: 200, message: `Success updating book details with id: ${bookId}`, data: book.toJSON() };
  } catch (error) {
    logger.error({ message: `Error updating book with id: ${bookId}`, error: error });
    return { statusCode: 500, message: `Error updating book with id: ${bookId}` };
  }
};

export const checkoutBook = async (bookId: number, reserverName: string): Promise<CustomGenericResponse> => {
  logger.info(`Checking out book id ${bookId} for ${reserverName}`);

  try {
    // fixes an issue where it will fail sometimes if the book_reservations table is not available
    await BookReservation.sync({ alter: true });

    const book = await Book.findByPk(bookId);
    if (!book) return { statusCode: 404, message: `Book with id ${bookId} not found` };
    if (book.copiesAvailable <= 0) return { statusCode: 400, message: `No copies of ${book.title} available` };

    const transaction = await sequelize.transaction();

    // update both tables together, if there is an error in updating either it will fail. (Keeps data the same)
    try {
      // update books table
      await book.update({ copiesAvailable: book.copiesAvailable - 1 }, { transaction });

      // update book_reservations table
      await BookReservation.create(
        { bookId, reserverName, title: book.title, genre: book.genre },
        { transaction }
      );
      // Ensures updating both tables happen together
      await transaction.commit();
      return { statusCode: 200, message: `Checked out '${book.title}' for ${reserverName}` };
    } catch (error) {
      //If any error, transactions dont get processed..
      logger.info(`Error checking out book ${book.title}`)
      await transaction.rollback();
      return { statusCode: 500, message: `Error checking out book ${book.title}` };
    }
  } catch (error) {
    return { statusCode: 500, message: `Unexpected error: ${error}` };
  }
};


export const returnBook = async (bookId: number, reserverName: string): Promise<CustomGenericResponse> => {
  logger.info(`Returning book id ${bookId} for ${reserverName}`);

  try {
    // fixes an issue where it will fail sometimes if the book_reservations table is not available
    await BookReservation.sync({ alter: true });

    const reservation = await BookReservation.findOne({
      where: {
        bookId,
        reserverName,
      },
    });

    if (!reservation) {
      logger.info(`Reservation for book with id ${bookId} not found for ${reserverName}`);
      return {
        statusCode: 404,
        message: `Reservation for book with id ${bookId} not found for ${reserverName}`,
      };
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      logger.info(`Book with id ${bookId} not found`)
      return { statusCode: 404, message: `Book with id ${bookId} not found` };
    }

    // Ensures updating both tables happen together
    const transaction = await sequelize.transaction();

    // update both tables together, if there is an error in updating either it will fail (Keeps data the same).
    try {
      // Update books table with more copies
      await book.update({ copiesAvailable: book.copiesAvailable + 1 }, { transaction });

      // remove associated reservation
      await reservation.destroy({ transaction });

      await transaction.commit();

      logger.info(`Successfully returned '${book.title}' for user ${reserverName}`);
      return {
        statusCode: 200,
        message: `Successfully returned'${book.title}' for ${reserverName}`,
      };
    } catch (error) {
      logger.info(`Error returning book ${book.title}`)
      await transaction.rollback();
      return { statusCode: 500, message: `Error returning in book ${book.title}` };
    }
  } catch (error) {
    return { statusCode: 500, message: `Unexpected error: ${error}` };
  }
};

