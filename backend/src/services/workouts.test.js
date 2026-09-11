const { getWorkoutRecommendation } = require('./workouts');

describe('workout recommendation', () => {
  test('reduces effort during the menstrual phase', () => {
    expect(
      getWorkoutRecommendation({
        cycleView: { current_phase: 'menstrual' },
        goal: 'regularite',
        level: 'debutante'
      })
    ).toMatchObject({ duration: 15, intensity: 'low', type: 'run' });
  });

  test('increases duration for an advanced endurance profile during ovulation', () => {
    expect(
      getWorkoutRecommendation({
        cycleView: { current_phase: 'ovulatory' },
        goal: 'endurance',
        level: 'avancee'
      })
    ).toMatchObject({ duration: 55, intensity: 'high', type: 'run' });
  });
});
