const { eq } = require('drizzle-orm');

const { db } = require('../db');
const { users } = require('../db/schema');
const { getCycleView } = require('../services/cycle');
const { getWorkoutRecommendation } = require('../services/workouts');
const { errorResponse, successResponse } = require('../utils/response');

module.exports = async function workoutRoutes(app) {
  app.get('/today', { preHandler: app.authenticate }, async (request, reply) => {
    const [profile] = await db
      .select({
        cycleLength: users.cycleLength,
        cycleStartDate: users.cycleStartDate,
        goal: users.goal,
        level: users.level
      })
      .from(users)
      .where(eq(users.id, request.user.sub))
      .limit(1);

    if (!profile) {
      return reply.status(404).send(errorResponse('USER_NOT_FOUND', 'Utilisateur introuvable.'));
    }

    const cycleView = getCycleView(profile.cycleStartDate, profile.cycleLength);
    return successResponse(getWorkoutRecommendation({ cycleView, ...profile }));
  });
};
