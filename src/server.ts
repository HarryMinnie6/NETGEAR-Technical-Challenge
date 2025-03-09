import express from "express";
const application = express();
import dotenv from "dotenv";
import { logger } from "./utils/logger";
import { API_PREFIX, APP_CONSTANTS } from "./constants/constants";

dotenv.config();
application.use(express.json());

// Route Imports
import generaTokenRoute from "./routes/authentication/generateToken"
import bookRoute from "./routes/books/books"
import { erroHandler } from "./middleware/errorHandling";

// Routes
application.use(`/${API_PREFIX}`, generaTokenRoute)
application.use(`/${API_PREFIX}`, bookRoute)

// Returns a nice message for the user here
application.use(erroHandler);

export default application;