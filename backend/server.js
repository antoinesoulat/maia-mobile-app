require('dotenv').config();

const { buildApp } = require('./src/app');
const { env } = require('./src/config/env');

const start = async () => {
  const app = buildApp({ logger: env.NODE_ENV !== 'test' });

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Server listening on ${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
