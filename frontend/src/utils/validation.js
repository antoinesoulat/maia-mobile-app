export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRules = [
  { key: 'length', label: '8 caractères minimum', test: (value) => value.length >= 8 },
  { key: 'lowercase', label: '1 lettre minuscule', test: (value) => /[a-z]/.test(value) },
  { key: 'uppercase', label: '1 lettre majuscule', test: (value) => /[A-Z]/.test(value) },
  { key: 'number', label: '1 chiffre', test: (value) => /\d/.test(value) },
  {
    key: 'special',
    label: '1 caractère spécial',
    test: (value) => /[^A-Za-z0-9]/.test(value)
  }
];

export function isValidEmail(value) {
  const email = value.trim();
  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

export function isStrongPassword(value) {
  return value.length <= 128 && passwordRules.every((rule) => rule.test(value));
}

export function isValidIsoDate(value, { allowFuture = false } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;

  return isRealDate && (allowFuture || date <= new Date());
}

export function isNumberInRange(value, min, max) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max;
}
