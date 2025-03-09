import application from './server';
import { logger } from "./utils/logger";
import { APP_CONSTANTS } from "./constants/constants";

application.listen(APP_CONSTANTS.port, () => {
  logger.info(`Server is running on port: ${APP_CONSTANTS.port}`);
});