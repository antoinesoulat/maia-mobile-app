const { successResponse } = require('../utils/response');
const authRoutes = require('./auth');
const userRoutes = require('./users');

module.exports = async function routes(app) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });

  app.get('/', async () => successResponse({ message: 'Maia Backend API' }));
  app.get('/health', async () => successResponse({ status: 'ok' }));
};
