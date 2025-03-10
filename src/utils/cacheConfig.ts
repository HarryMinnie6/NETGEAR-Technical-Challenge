import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';
import { logger } from './logger';

// Time-To-Live 9 hours, same as JWT 'expiresIn' time
const tokenCache = new NodeCache({ stdTTL: 32400 });

export const generateAndCacheToken = (identifier: string): string => {
  let cachedToken: string | undefined = tokenCache.get(identifier);

  if (cachedToken) {
    logger.info(`Cached token found for: ${identifier}`);
    return cachedToken as string;
  }

  logger.info(`Caching token for: ${identifier}`);
  const token = jwt.sign({ identifier }, process.env.JWT_SECRET as string, { expiresIn: '9h' });
  tokenCache.set(identifier, token);
  logger.info(`Cached token for: ${identifier}`);
  return token;
};
