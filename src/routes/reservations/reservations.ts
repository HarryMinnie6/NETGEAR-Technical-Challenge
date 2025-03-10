import express from 'express';
const router = express.Router();
import { validateJWTToken } from '../../middleware/validation';
import { checkoutBook, getAllReservations, returnBook } from './queryFunctions';
import { CustomGenericResponse } from '../../types/CustomGenericResponse';

router.get(`/all-reservations`, validateJWTToken, async (req: any, res: any) => {
  const response = await getAllReservations();
  res.status(response.statusCode).json({ message: response.message, data: response.data });
});

// Checkout a book
router.get(`/checkout-book/:id`, validateJWTToken, async (req: any, res: any): Promise<any> => {
  const bookId: number = req.params.id;
  const { reserverName } = req.body;
  const response: CustomGenericResponse = await checkoutBook(bookId, reserverName);
  res.status(response.statusCode).json(response.message);
});

router.post(`/return-book/:id`, validateJWTToken, async (req: any, res: any): Promise<any> => {
  const bookId: number = req.params.id;
  const { reserverName } = req.body;
  const response: CustomGenericResponse = await returnBook(bookId, reserverName);
  res.status(response.statusCode).json(response.message);
});

// find where quantity is > 0

export default router;
