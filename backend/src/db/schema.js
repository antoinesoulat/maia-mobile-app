const {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar
} = require('drizzle-orm/pg-core');

const sessionStatus = pgEnum('session_status', ['active', 'completed']);

const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  birthdate: date('birthdate').notNull(),
  weight: real('weight').notNull(),
  height: real('height').notNull(),
  level: varchar('level', { length: 64 }).notNull(),
  goal: varchar('goal', { length: 128 }).notNull(),
  cycleStartDate: date('cycle_start_date').notNull(),
  cycleLength: integer('cycle_length').notNull(),
  refreshToken: varchar('refresh_token', { length: 512 }),
  notificationEnabled: boolean('notification_enabled').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  distance: real('distance'),
  duration: integer('duration'),
  averagePace: real('average_pace'),
  status: sessionStatus('status').default('active').notNull()
});

const cycles = pgTable('cycles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  cycleStartDate: date('cycle_start_date').notNull(),
  cycleLength: integer('cycle_length').notNull(),
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow().notNull()
});

const notificationSettings = pgTable('notification_settings', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  workoutNotifications: boolean('workout_notifications').default(true).notNull(),
  cycleNotifications: boolean('cycle_notifications').default(true).notNull(),
  socialNotifications: boolean('social_notifications').default(false).notNull(),
  preferredTime: integer('preferred_time').default(18).notNull()
});

module.exports = {
  cycles,
  notificationSettings,
  sessions,
  sessionStatus,
  users
};
