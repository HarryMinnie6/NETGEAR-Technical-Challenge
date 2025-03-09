import application from '../../src/server';
const request = require('supertest');
import { getAllBooks } from "../../src/routes/books/queryFunctions"
import jwt from 'jsonwebtoken';

describe('Book Routes', () => {
  jest.mock("express-jwt", () => ({
    expressjwt: jest.fn().mockReturnValue((req: any, res: any, next: any) => {
      req.auth = { user: "mockedUser" };
      next();
    }),
  }));

  jest.mock('../../src/routes/books/queryFunctions', () => {
    return {
      getAllBooks: jest.fn().mockResolvedValue({
        statusCode: 200,
        message: 'Books retrieved successfully',
        data: [{ id: 1, title: 'Mock Book 1' }, { id: 2, title: 'Mock Book 2' }],
      }),
    };
  });

  it('should return a 200 response and data when getting all Books', async () => {
    const identifier = "Harry"
    const token = jwt.sign({ identifier }, process.env.JWT_SECRET as string, { expiresIn: "9h" });

    await request(application)
      .get('/api/v1/all-books')
      .set('Authorization', `Bearer ${token}`).then(async () => {
        await getAllBooks().then((dbResponse) => {
          expect(dbResponse.statusCode).toBe(200)
          expect(dbResponse.message).toEqual("Successfully retrieved all books")
        })
      });
  })

  it('should return a 404 response hitting an endpoint that doesnt exist', async () => {
    const identifier = "Harry"
    const token = jwt.sign({ identifier }, process.env.JWT_SECRET as string, { expiresIn: "9h" });

    await request(application)
      .get('/api/v1/not-exist')
      .set('Authorization', `Bearer ${token}`).then(async () => {
        await getAllBooks().then((dbResponse) => {
          console.log("dbResponse", dbResponse)
          expect(dbResponse.statusCode).toBe(200)
          expect(dbResponse.message).toEqual("Successfully retrieved all books")
        })
      });
  })

  it('should return a 404 response hitting an endpoint that doesnt exist', async () => {
    const identifier = "Harry"
    const token = jwt.sign({ identifier }, process.env.JWT_SECRET as string, { expiresIn: "9h" });

    await request(application)
      .get('/api/v1/not-exist')
      .set('Authorization', `Bearer ${token}`).then((res: any) => {
        expect(res.statusCode).toBe(404)
      });
  })
});

describe('Authentication', () => {
  it('should return a 200 response and successful request when using a valid token', async () => {
    const identifier = "Test User"
    const token = jwt.sign({ identifier }, process.env.JWT_SECRET as string, { expiresIn: "9h" });

    await request(application).get('/api/v1/all-books').set('Authorization', `Bearer ${token}`).then((res: any) => {
      expect(res.status).toBe(200);
    });
  });

  it('should return a 401 Unauthorized message when an invalid token is used', async () => {
    const identifier = "Harry"
    const token = jwt.sign({ identifier }, process.env.JWT_SECRET as string, { expiresIn: "9h" });

    await request(application).get('/api/v1/all-books').set('Authorization', `Bearer fake-token`).then((res: any) => {
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("jwt malformed");
      expect(res.body.error).toBe("UnauthorizedError");
    });
  });
});




