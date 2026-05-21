const { successResponse } = require('../utils/response');

module.exports = async function routes(app) {
  app.get('/', async () => successResponse({ message: 'Maia Backend API' }));
  app.get('/health', async () => successResponse({ status: 'ok' }));
};
