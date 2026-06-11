const jwt = require('@fastify/jwt');

const { env } = require('../config/env');
const { errorResponse } = require('../utils/response');

module.exports = async function jwtPlugin(app) {
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '7d'
    }
  });

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send(errorResponse('UNAUTHORIZED', 'Unauthorized'));
    }
  });
};
