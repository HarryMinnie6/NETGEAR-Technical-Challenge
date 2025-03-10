import express from 'express';
const router = express.Router();
import { validateJWTToken } from '../../middleware/validation';
import { logger } from '../../utils/logger';
import { addBook, deletebook, getAllBooks, updateBook } from './queryFunctions';
import { pool } from '../../utils/dbConfig';
import { CustomGenericResponse } from '../../types/CustomGenericResponse';

// add a book  (CREATE)
router.post(`/add-book`, validateJWTToken, async (req: any, res: any) => {
  const { title, author, genre, published_date, total_copies } = req.body;
  const response = await addBook(title, author, genre, published_date, total_copies);
  res.status(response.statusCode).json({ message: response.message, data: response.data });
});

//get all books (READ)
router.get(`/all-books`, validateJWTToken, async (req: any, res: any) => {
  const response = await getAllBooks();
  res.status(response.statusCode).json({ message: response.message, data: response.data });
});

//get single book  (READ)
router.get(`/books/:id`, validateJWTToken, async (req: any, res: any): Promise<any> => {
  const bookId: number = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if (result.rows.length > 0) {
      logger.info(`Successfully found book with id ${bookId}`);
      res
        .status(200)
        .json({ message: `Successfully found book with id ${bookId}`, data: result.rows[0] });
    } else {
      return res.status(404).json({ message: `No book found with id: ${bookId}` });
    }
  } catch (error) {
    logger.error({ message: `Internal Server Error`, error: error });
    res.status(500).send({ message: `Internal Server Error` });
  }
});

// Delete a book (DELETE)
router.delete(`/delete-book/:id`, validateJWTToken, async (req: any, res: any) => {
  const bookId: number = req.params.id;
  const response: CustomGenericResponse = await deletebook(bookId);
  res.status(response.statusCode).json(response.message);
});

// Update a book (UPDATE)
router.put('/update-book/:id', validateJWTToken, async (req: any, res: any) => {
  const bookId: number = req.params.id;
  const { title, author, published_date, genre } = req.body;
  const response = await updateBook(bookId, { title, author, genre, published_date });
  return res.status(response.statusCode).json({ message: response.message, data: response.data });
});

export default router;
