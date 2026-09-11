const { and, eq, sql } = require('drizzle-orm');

const { db } = require('../db');
const { sessions } = require('../db/schema');
const { successResponse } = require('../utils/response');

const roundDistance = (value) => Math.round(Number(value) * 1000) / 1000;

module.exports = async function statsRoutes(app) {
  app.get('/me', { preHandler: app.authenticate }, async (request) => {
    const [stats] = await db
      .select({
        averageDistance: sql`coalesce(avg(${sessions.distance}), 0)`,
        totalDistance: sql`coalesce(sum(${sessions.distance}), 0)`,
        totalSessions: sql`count(*)`
      })
      .from(sessions)
      .where(and(eq(sessions.userId, request.user.sub), eq(sessions.status, 'completed')));

    return successResponse({
      average_distance: roundDistance(stats.averageDistance),
      total_distance: roundDistance(stats.totalDistance),
      total_sessions: Number(stats.totalSessions)
    });
  });
};
