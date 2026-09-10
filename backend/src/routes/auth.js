const bcrypt = require('bcrypt');
const { eq } = require('drizzle-orm');

const { db } = require('../db');
const { cycles, notificationSettings, users } = require('../db/schema');
const { errorResponse, successResponse } = require('../utils/response');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

const defaultProfile = () => ({
  birthdate: '1995-01-01',
  weight: 60,
  height: 165,
  level: 'debutante',
  goal: 'regularite',
  cycleStartDate: new Date().toISOString().slice(0, 10),
  cycleLength: 28
});

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const buildRegisterPayload = (body = {}) => {
  const defaults = defaultProfile();

  return {
    email: normalizeEmail(body.email),
    password: body.password || '',
    name: (body.name || '').trim(),
    birthdate: isValidDate(body.birthdate || '') ? body.birthdate : defaults.birthdate,
    weight: Number(body.weight) > 0 ? Number(body.weight) : defaults.weight,
    height: Number(body.height) > 0 ? Number(body.height) : defaults.height,
    level: (body.level || defaults.level).trim(),
    goal: (body.goal || defaults.goal).trim(),
    cycleStartDate: isValidDate(body.cycle_start_date || '')
      ? body.cycle_start_date
      : defaults.cycleStartDate,
    cycleLength:
      Number(body.cycle_length) >= 21 && Number(body.cycle_length) <= 40
        ? Number(body.cycle_length)
        : defaults.cycleLength
  };
};

const validateCredentials = ({ email, password }) => {
  if (!EMAIL_PATTERN.test(email)) {
    return 'Email invalide.';
  }

  if (password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caracteres.';
  }

  return null;
};

module.exports = async function authRoutes(app) {
  app.post('/register', async (request, reply) => {
    const payload = buildRegisterPayload(request.body);
    const credentialError = validateCredentials(payload);

    if (credentialError || payload.name.length < 2) {
      return reply
        .status(400)
        .send(errorResponse('VALIDATION_ERROR', credentialError || 'Le prenom est requis.'));
    }

    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (existingUser) {
      return reply.status(400).send(errorResponse('EMAIL_ALREADY_USED', 'Email deja utilise.'));
    }

    const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const [createdUser] = await db
      .insert(users)
      .values({
        email: payload.email,
        passwordHash,
        name: payload.name,
        birthdate: payload.birthdate,
        weight: payload.weight,
        height: payload.height,
        level: payload.level,
        goal: payload.goal,
        cycleStartDate: payload.cycleStartDate,
        cycleLength: payload.cycleLength
      })
      .returning({ id: users.id });

    await db.insert(cycles).values({
      userId: createdUser.id,
      cycleStartDate: payload.cycleStartDate,
      cycleLength: payload.cycleLength
    });

    await db.insert(notificationSettings).values({
      userId: createdUser.id
    });

    const token = app.jwt.sign({ sub: createdUser.id });

    return reply.status(201).send(successResponse({ token, user: { id: createdUser.id } }));
  });

  app.post('/login', async (request, reply) => {
    const email = normalizeEmail(request.body?.email);
    const password = request.body?.password || '';
    const credentialError = validateCredentials({ email, password });

    if (credentialError) {
      return reply.status(400).send(errorResponse('VALIDATION_ERROR', credentialError));
    }

    const [user] = await db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return reply
        .status(401)
        .send(errorResponse('INVALID_CREDENTIALS', 'Identifiants incorrects.'));
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return reply
        .status(401)
        .send(errorResponse('INVALID_CREDENTIALS', 'Identifiants incorrects.'));
    }

    const token = app.jwt.sign({ sub: user.id });

    return successResponse({ token, user: { id: user.id } });
  });
};
