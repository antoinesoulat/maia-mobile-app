const { eq } = require('drizzle-orm');

const { db } = require('../db');
const { cycles, users } = require('../db/schema');
const { errorResponse, successResponse } = require('../utils/response');
const {
  ALLOWED_GOALS,
  ALLOWED_LEVELS,
  isNumberInRange,
  isValidIsoDate
} = require('../utils/validation');

const selectUserProfile = {
  birthdate: users.birthdate,
  cycleLength: users.cycleLength,
  cycleStartDate: users.cycleStartDate,
  email: users.email,
  goal: users.goal,
  height: users.height,
  id: users.id,
  level: users.level,
  name: users.name,
  weight: users.weight
};

function buildProfilePayload(body = {}) {
  return {
    birthdate: body.birthdate,
    cycleLength: Number(body.cycle_length),
    cycleStartDate: body.cycle_start_date,
    goal: typeof body.goal === 'string' ? body.goal.trim() : '',
    height: Number(body.height),
    level: typeof body.level === 'string' ? body.level.trim() : '',
    weight: Number(body.weight)
  };
}

function isValidProfile(payload) {
  return (
    isValidIsoDate(payload.birthdate) &&
    isNumberInRange(payload.weight, 30, 300) &&
    isNumberInRange(payload.height, 120, 230) &&
    ALLOWED_LEVELS.has(payload.level) &&
    ALLOWED_GOALS.has(payload.goal) &&
    isValidIsoDate(payload.cycleStartDate) &&
    Number.isInteger(payload.cycleLength) &&
    isNumberInRange(payload.cycleLength, 21, 40)
  );
}

module.exports = async function userRoutes(app) {
  app.get('/me', { preHandler: app.authenticate }, async (request, reply) => {
    const [profile] = await db
      .select(selectUserProfile)
      .from(users)
      .where(eq(users.id, request.user.sub))
      .limit(1);

    if (!profile) {
      return reply.status(404).send(errorResponse('USER_NOT_FOUND', 'Utilisateur introuvable.'));
    }

    return successResponse({ user: profile });
  });

  app.put('/me', { preHandler: app.authenticate }, async (request, reply) => {
    const payload = buildProfilePayload(request.body);

    if (!isValidProfile(payload)) {
      return reply
        .status(400)
        .send(errorResponse('VALIDATION_ERROR', 'Verifie les champs profil et cycle.'));
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        birthdate: payload.birthdate,
        cycleLength: payload.cycleLength,
        cycleStartDate: payload.cycleStartDate,
        goal: payload.goal,
        height: payload.height,
        level: payload.level,
        weight: payload.weight
      })
      .where(eq(users.id, request.user.sub))
      .returning(selectUserProfile);

    if (!updatedUser) {
      return reply.status(404).send(errorResponse('USER_NOT_FOUND', 'Utilisateur introuvable.'));
    }

    await db
      .update(cycles)
      .set({
        cycleLength: payload.cycleLength,
        cycleStartDate: payload.cycleStartDate,
        lastUpdated: new Date()
      })
      .where(eq(cycles.userId, request.user.sub));

    return successResponse({ user: updatedUser });
  });
};
