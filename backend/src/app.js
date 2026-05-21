const fastify = require('fastify');

const corsPlugin = require('./plugins/cors');
const jwtPlugin = require('./plugins/jwt');
const routes = require('./routes');
const { errorResponse } = require('./utils/response');

const buildApp = (options = {}) => {
  const app = fastify(options);

  app.register(corsPlugin);
  app.register(jwtPlugin);
  app.register(routes);

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    const statusCode = error.statusCode || 500;
    const code = statusCode === 400 ? 'VALIDATION_ERROR' : 'SERVER_ERROR';
    const message = statusCode === 400 ? 'Validation error' : 'Server error';

    return reply.status(statusCode).send(errorResponse(code, message));
  });

  return app;
};

module.exports = { buildApp };
