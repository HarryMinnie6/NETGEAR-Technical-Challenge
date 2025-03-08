import express from "express";
import { generateAndCacheToken } from "../../utils/cacheConfig";
import { logger } from "../../utils/logger";
const router = express.Router();

/*
  This can be reworked to a login as it has caching for the token 
  to reduce the number of calls to generate a token.

  NOTE: This is needed to access the other routes as they are protected 
  and are validated via "validateJWTToken".
*/

router.post(`/generate-jwt-token`, (req: any, res: any) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: "An identifier is required" });

  try {
    logger.info({ message: "Generating JWT Token" });
    const token: string = generateAndCacheToken(identifier);

    res.status(200).json({ message: "JWT Token Generated", token });
    logger.info({ message: "JWT Token Generated" });
  } catch (error) {
    logger.error({ message: "Error generating authentication token", error: `${error}` });
    res.status(500).json({ message: "Error generating authentication token", error: `${error}` });
  }
});

export default router;