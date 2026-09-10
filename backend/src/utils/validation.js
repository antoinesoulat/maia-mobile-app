const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_LEVELS = new Set(['debutante', 'intermediaire', 'avancee']);
const ALLOWED_GOALS = new Set(['regularite', 'endurance', 'performance']);

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const isValidEmail = (value) => value.length <= 254 && EMAIL_PATTERN.test(value);

const isStrongPassword = (value) =>
  typeof value === 'string' &&
  value.length >= 8 &&
  value.length <= 128 &&
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

const isValidIsoDate = (value, { allowFuture = false } = {}) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;

  return isRealDate && (allowFuture || date <= new Date());
};

const isNumberInRange = (value, min, max) =>
  Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max;

const validateLoginCredentials = ({ email, password }) => {
  if (!isValidEmail(email)) {
    return 'E-mail invalide.';
  }

  if (typeof password !== 'string' || password.length === 0 || password.length > 128) {
    return 'Mot de passe invalide.';
  }

  return null;
};

const validateRegistration = (payload) => {
  if (!isValidEmail(payload.email)) {
    return 'E-mail invalide.';
  }

  if (!isStrongPassword(payload.password)) {
    return 'Le mot de passe doit contenir 8 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial.';
  }

  if (payload.name.length < 2 || payload.name.length > 50) {
    return 'Le prénom doit contenir entre 2 et 50 caractères.';
  }

  if (!isValidIsoDate(payload.birthdate)) {
    return 'Date de naissance invalide.';
  }

  if (!isNumberInRange(payload.weight, 30, 300)) {
    return 'Poids invalide.';
  }

  if (!isNumberInRange(payload.height, 120, 230)) {
    return 'Taille invalide.';
  }

  if (!ALLOWED_LEVELS.has(payload.level) || !ALLOWED_GOALS.has(payload.goal)) {
    return 'Niveau ou objectif invalide.';
  }

  if (!isValidIsoDate(payload.cycleStartDate)) {
    return 'Date de cycle invalide.';
  }

  if (!Number.isInteger(payload.cycleLength) || !isNumberInRange(payload.cycleLength, 21, 40)) {
    return 'La durée du cycle doit être comprise entre 21 et 40 jours.';
  }

  return null;
};

module.exports = {
  ALLOWED_GOALS,
  ALLOWED_LEVELS,
  isNumberInRange,
  isStrongPassword,
  isValidEmail,
  isValidIsoDate,
  normalizeEmail,
  validateLoginCredentials,
  validateRegistration
};
