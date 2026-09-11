const assert = require('node:assert/strict');

const { eq } = require('drizzle-orm');

const { buildApp } = require('../src/app');
const { db, pool } = require('../src/db');
const { cycles, notificationSettings, users } = require('../src/db/schema');

async function run() {
  const app = buildApp();
  const email = `auth-smoke-${Date.now()}@example.com`;
  let createdUserId;

  try {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        cycle_length: 28,
        cycle_start_date: new Date().toISOString().slice(0, 10),
        email,
        goal: 'regularite',
        level: 'debutante',
        name: 'Test Maïa',
        password: 'Course2026!'
      }
    });

    assert.equal(response.statusCode, 201, response.body);
    const { token } = response.json().data;

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    assert.ok(user?.id, 'The registration did not create a user.');
    createdUserId = user.id;

    const [cycle] = await db
      .select({ userId: cycles.userId })
      .from(cycles)
      .where(eq(cycles.userId, user.id));
    assert.equal(cycle?.userId, user.id, 'The registration did not create cycle data.');

    const [settings] = await db
      .select({ userId: notificationSettings.userId })
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, user.id));
    assert.equal(
      settings?.userId,
      user.id,
      'The registration did not create notification settings.'
    );

    const authorization = { authorization: `Bearer ${token}` };
    const cycleViewResponse = await app.inject({
      headers: authorization,
      method: 'GET',
      url: '/cycle/view'
    });
    assert.equal(cycleViewResponse.statusCode, 200, cycleViewResponse.body);
    assert.ok(cycleViewResponse.json().data.current_phase);

    const cycleUpdateResponse = await app.inject({
      headers: authorization,
      method: 'PUT',
      payload: { cycle_length: 30, cycle_start_date: '2026-09-01' },
      url: '/cycle'
    });
    assert.equal(cycleUpdateResponse.statusCode, 200, cycleUpdateResponse.body);
    assert.equal(cycleUpdateResponse.json().data.cycle_length, 30);

    const workoutResponse = await app.inject({
      headers: authorization,
      method: 'GET',
      url: '/workouts/today'
    });
    assert.equal(workoutResponse.statusCode, 200, workoutResponse.body);
    assert.equal(workoutResponse.json().data.type, 'run');
    assert.ok(workoutResponse.json().data.duration >= 15);

    process.stdout.write('Authentication database smoke test passed.\n');
  } finally {
    if (createdUserId) {
      await db.delete(users).where(eq(users.id, createdUserId));
    }

    await app.close();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
