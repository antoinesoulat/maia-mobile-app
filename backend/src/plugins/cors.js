const cors = require('@fastify/cors');

const { env } = require('../config/env');

module.exports = async function corsPlugin(app) {
  await app.register(cors, {
    origin: env.CORS_ORIGIN
  });
};
