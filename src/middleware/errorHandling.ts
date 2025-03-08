import { logger } from "../utils/logger";

export const erroHandler = (error: any, req: any, res: any, next: any): any => {
	if (error.name === "UnauthorizedError") {
		logger.error({ error: `${error.name}`, message: `${error.message}`, })
		return res.status(401).json({ message: `${error.message}`, error: `${error.name}` });
	}
	logger.error({ error: "Internal Server Error" })
	return res.status(500).json({ error: "Internal Server Error" });
}