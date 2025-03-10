import { logger } from '../../utils/logger';
import { sequelize } from '../../utils/dbConfig';
import { Book } from '../../models/BookModel';
import { BookReservation } from '../../models/BookReservationModel';
import { CustomGenericResponse } from '../../types/CustomGenericResponse';

export const getAllReservations = async (): Promise<CustomGenericResponse> => {
  try {
    const response = await BookReservation.findAll();
    logger.info(`Successfully retrieved all reservations`);
    return { statusCode: 200, message: `Successfully retrieved all reservations`, data: response };
  } catch (error) {
    logger.error({ message: `Error occurred while getting all reservations`, error: `${error}` });
    return { statusCode: 500, message: `Error occurred while getting all reservations` };
  }
};

export const checkoutBook = async (
  bookId: number,
  reserverName: string,
): Promise<CustomGenericResponse> => {
  logger.info(`Checking out book id ${bookId} for ${reserverName}`);

  try {
    // fixes an issue where it will fail sometimes if the book_reservations table is not available
    await BookReservation.sync({ alter: true });

    const book = await Book.findByPk(bookId);
    if (!book) return { statusCode: 404, message: `Book with id ${bookId} not found` };
    if (book.copies_available <= 0)
      return { statusCode: 400, message: `No copies of ${book.title} available` };

    const transaction = await sequelize.transaction();

    // update both tables together, if there is an error in updating either it will fail. (Keeps data the same)
    try {
      // update books table
      await book.update({ copies_available: book.copies_available - 1 }, { transaction });

      // update book_reservations table
      await BookReservation.create(
        { bookId, reserverName, title: book.title, genre: book.genre },
        { transaction },
      );
      // Ensures updating both tables happen together
      await transaction.commit();
      return { statusCode: 200, message: `Checked out '${book.title}' for ${reserverName}` };
    } catch (error) {
      //If any error, transactions dont get processed..
      logger.info({ message: `Error checking out book ${book.title}`, error: `${error}` });
      await transaction.rollback();
      return { statusCode: 500, message: `Error checking out book ${book.title}` };
    }
  } catch (error) {
    return { statusCode: 500, message: `Unexpected error: ${error}` };
  }
};

export const returnBook = async (
  bookId: number,
  reserverName: string,
): Promise<CustomGenericResponse> => {
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
      logger.warn(`Reservation for book with id ${bookId} not found for ${reserverName}`);
      return {
        statusCode: 404,
        message: `Reservation for book with id ${bookId} not found for ${reserverName}`,
      };
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      logger.warn(`Book with id ${bookId} not found`);
      return { statusCode: 404, message: `Book with id ${bookId} not found` };
    }

    // Ensures updating both tables happen together
    const transaction = await sequelize.transaction();

    // update both tables together, if there is an error in updating either it will fail (Keeps data the same).
    try {
      // Update books table with more copies
      await book.update({ copies_available: book.copies_available + 1 }, { transaction });

      // remove associated reservation
      await reservation.destroy({ transaction });

      await transaction.commit();

      logger.info(`Successfully returned '${book.title}' for user ${reserverName}`);
      return {
        statusCode: 200,
        message: `Successfully returned'${book.title}' for ${reserverName}`,
      };
    } catch (error) {
      logger.error({ message: `Error returning book ${book.title}`, error: `${error}` });
      await transaction.rollback();
      return { statusCode: 500, message: `Error returning in book ${book.title}` };
    }
  } catch (error) {
    logger.error({ message: `Unexpected error: ${error}`, error: `${error}` });
    return { statusCode: 500, message: `Unexpected error: ${error}` };
  }
};
