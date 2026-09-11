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
