const {
  isValidIsoDate,
  normalizeEmail,
  validateLoginCredentials,
  validateRegistration
} = require('./validation');

const validRegistration = {
  birthdate: '1995-01-01',
  cycleLength: 28,
  cycleStartDate: '2020-09-01',
  email: 'runner@example.com',
  goal: 'regularite',
  height: 165,
  level: 'debutante',
  name: 'Maia',
  password: 'Course2026!',
  weight: 60
};

describe('authentication validation', () => {
  test('normalizes an email address', () => {
    expect(normalizeEmail('  RUNNER@Example.COM ')).toBe('runner@example.com');
  });

  test('accepts a complete registration payload', () => {
    expect(validateRegistration(validRegistration)).toBeNull();
  });

  test.each(['course2026!', 'COURSE2026!', 'CourseTest!', 'Course2026'])(
    'rejects a password missing a required character class: %s',
    (password) => {
      expect(validateRegistration({ ...validRegistration, password })).toMatch(/mot de passe/i);
    }
  );

  test('rejects malformed and future dates', () => {
    expect(isValidIsoDate('2026-02-30')).toBe(false);
    expect(isValidIsoDate('2999-01-01')).toBe(false);
  });

  test('keeps login compatible with existing passwords', () => {
    expect(
      validateLoginCredentials({ email: 'runner@example.com', password: 'ancienmotdepasse' })
    ).toBeNull();
  });
});
