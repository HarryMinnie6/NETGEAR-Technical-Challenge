import express from 'express';
const application = express();
import dotenv from 'dotenv';
import { API_PREFIX } from './constants/constants';

dotenv.config();
application.use(express.json());

// Route Imports
import generaTokenRoute from './routes/authentication/generateToken';
import bookRoute from './routes/books/books';
import reservationsRoute from './routes/reservations/reservations';
import { erroHandler } from './middleware/errorHandling';

// Routes
application.use(`/${API_PREFIX}`, generaTokenRoute);
application.use(`/${API_PREFIX}`, bookRoute);
application.use(`/${API_PREFIX}`, reservationsRoute);

// Returns a nice message for the user here
application.use(erroHandler);

export default application;
