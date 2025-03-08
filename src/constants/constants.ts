import dotenv from "dotenv";
dotenv.config();

export const APP_CONSTANTS = {
    apiVersion: "v1",
    port: process.env.PORT
}
;
export const API_PREFIX = `api/${APP_CONSTANTS.apiVersion}`; 