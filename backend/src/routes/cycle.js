const { eq } = require('drizzle-orm');

const { db } = require('../db');
const { cycles, users } = require('../db/schema');
const { getCycleView } = require('../services/cycle');
const { errorResponse, successResponse } = require('../utils/response');
const { isNumberInRange, isValidIsoDate } = require('../utils/validation');

async function findCycle(userId) {
  const [cycle] = await db
    .select({
      cycleLength: cycles.cycleLength,
      cycleStartDate: cycles.cycleStartDate
    })
    .from(cycles)
    .where(eq(cycles.userId, userId))
    .limit(1);

  return cycle;
}

module.exports = async function cycleRoutes(app) {
  app.get('/', { preHandler: app.authenticate }, async (request, reply) => {
    const cycle = await findCycle(request.user.sub);

    if (!cycle) {
      return reply.status(404).send(errorResponse('CYCLE_NOT_FOUND', 'Cycle introuvable.'));
    }

    return successResponse({
      cycle_length: cycle.cycleLength,
      cycle_start_date: cycle.cycleStartDate
    });
  });

  app.get('/view', { preHandler: app.authenticate }, async (request, reply) => {
    const cycle = await findCycle(request.user.sub);

    if (!cycle) {
      return reply.status(404).send(errorResponse('CYCLE_NOT_FOUND', 'Cycle introuvable.'));
    }

    return successResponse(getCycleView(cycle.cycleStartDate, cycle.cycleLength));
  });

  app.put('/', { preHandler: app.authenticate }, async (request, reply) => {
    const cycleStartDate = request.body?.cycle_start_date;
    const cycleLength = Number(request.body?.cycle_length);

    if (
      !isValidIsoDate(cycleStartDate) ||
      !Number.isInteger(cycleLength) ||
      !isNumberInRange(cycleLength, 21, 40)
    ) {
      return reply
        .status(400)
        .send(errorResponse('VALIDATION_ERROR', 'Vérifie la date et la durée du cycle.'));
    }

    const updatedCycle = await db.transaction(async (transaction) => {
      const [cycle] = await transaction
        .update(cycles)
        .set({ cycleLength, cycleStartDate, lastUpdated: new Date() })
        .where(eq(cycles.userId, request.user.sub))
        .returning({ userId: cycles.userId });

      if (!cycle) {
        return null;
      }

      await transaction
        .update(users)
        .set({ cycleLength, cycleStartDate })
        .where(eq(users.id, request.user.sub));

      return cycle;
    });

    if (!updatedCycle) {
      return reply.status(404).send(errorResponse('CYCLE_NOT_FOUND', 'Cycle introuvable.'));
    }

    return successResponse(getCycleView(cycleStartDate, cycleLength));
  });
};
