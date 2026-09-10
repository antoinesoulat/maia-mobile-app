const { eq } = require('drizzle-orm');

const { db } = require('../db');
const { cycles, users } = require('../db/schema');
const { errorResponse, successResponse } = require('../utils/response');

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

const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');

function buildProfilePayload(body = {}) {
  const cycleLength = Number(body.cycle_length);

  return {
    birthdate: isValidDate(body.birthdate) ? body.birthdate : null,
    cycleLength: cycleLength >= 21 && cycleLength <= 40 ? cycleLength : null,
    cycleStartDate: isValidDate(body.cycle_start_date) ? body.cycle_start_date : null,
    goal: (body.goal || '').trim(),
    height: Number(body.height) > 0 ? Number(body.height) : null,
    level: (body.level || '').trim(),
    weight: Number(body.weight) > 0 ? Number(body.weight) : null
  };
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

    if (
      !payload.birthdate ||
      !payload.weight ||
      !payload.height ||
      !payload.level ||
      !payload.goal ||
      !payload.cycleStartDate ||
      !payload.cycleLength
    ) {
      return reply
        .status(400)
        .send(errorResponse('VALIDATION_ERROR', 'Complete les champs profil et cycle.'));
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
