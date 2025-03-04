import express from "express";
import dotenv from "dotenv";
import { logger } from "./utils/logger";
import { expressjwt } from "express-jwt";
import { APP_CONSTANTS } from "./constants/constants";
import { generateAndCacheToken } from "./utils/cacheConfig";

dotenv.config();
const application = express();
application.use(express.json());

const PORT = process.env.PORT as string;
const API_PREFIX: string = `api/${APP_CONSTANTS.apiVersion}`

const validateJWTToken = expressjwt({
  secret: () => {
    return `${process.env.JWT_SECRET}`;
  },
  algorithms: ["HS256"],
  requestProperty: "auth",
}).unless({ path: [`/${API_PREFIX}/generate-jwt-token`] });

/*
  This can be reworked to a login as it has caching for the token 
  to reduce the number of calls to generate a token.

  NOTE: This is needed to access the other routes as they are protected 
  and are validated via "validateJWTToken".
*/
application.post(`/${API_PREFIX}/generate-jwt-token`, (req: any, res: any) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: "An identifier is required" });

  try {
    const token: string = generateAndCacheToken(identifier);

    res.status(200).json({ message: "Login successful", token });
    logger.info({ message: "Login successful", });
  } catch (error) {
    logger.error({ message: "Error generating authentication token", error: `${error}` });
    res.status(500).json({ message: "Error generating authentication token", error: `${error}` });
  }
});

application.get(`/${API_PREFIX}/protected`, validateJWTToken, (req: any, res: any) => {
  try {
    logger.info("Accessing protected route");
    res.status(200).json({
      message: "This is a protected route, SUCCESSFUL after authentication"
    });
    logger.info("Successfully accessed protected route");

  } catch (error) {
    logger.error({ error: `${error}`, message: `Route: /${API_PREFIX}/protected}` });
    res.status(500).json({ error: `${error}`, message: "Internal Server Error" });
  }
});

application.get(`/${API_PREFIX}/protected2`, validateJWTToken, (req: any, res: any) => {
  try {
    logger.info("Accessing protected route");
    res.status(200).json({
      message: "This is a protected route, SUCCESSFUL after authentication"
    });
    logger.info("Successfully accessed protected route");

  } catch (error) {
    logger.error({ error: `${error}`, message: `Route: /${API_PREFIX}/protected}` });
    res.status(500).json({ error: `${error}`, message: "Internal Server Error" });
  }
});

// Returns a nice message for the user here
application.use((error: any, req: any, res: any, next: any) => {
  if (error.name === "UnauthorizedError") {
    logger.error({ error: `${error.name}`, message: `${error.message}`, })
    return res.status(401).json({ message: `${error.message}`, error: `${error.name}` });
  }
  logger.error({ error: "Internal Server Error" })
  return res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
application.listen(PORT, () => {
  logger.info(`Server is running on port: ${PORT}`);
});
