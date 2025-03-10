import { expressjwt } from 'express-jwt';
import { API_PREFIX } from '../constants/constants';

export const validateJWTToken = expressjwt({
  secret: () => {
    return `${process.env.JWT_SECRET}`;
  },
  algorithms: ['HS256'],
  requestProperty: 'auth',
}).unless({ path: [`/${API_PREFIX}/generate-jwt-token`] });
