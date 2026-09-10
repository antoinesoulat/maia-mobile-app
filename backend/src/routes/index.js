const { successResponse } = require('../utils/response');
const authRoutes = require('./auth');

module.exports = async function routes(app) {
  app.register(authRoutes, { prefix: '/auth' });

  app.get('/', async () => successResponse({ message: 'Maia Backend API' }));
  app.get('/health', async () => successResponse({ status: 'ok' }));
};
