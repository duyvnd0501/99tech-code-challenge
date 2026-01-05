import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product API',
      version: '1.0.0',
      description: 'A simple Express Library API',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./src/routes.ts'],
};

export const specs = swaggerJsdoc(options);
