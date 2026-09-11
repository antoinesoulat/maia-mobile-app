const { getCycleView, getPhaseRanges } = require('./cycle');

describe('cycle calculation', () => {
  test.each([
    ['2026-09-01', 'menstrual', 1],
    ['2026-09-06', 'follicular', 6],
    ['2026-09-14', 'ovulatory', 14],
    ['2026-09-18', 'luteal', 18],
    ['2026-09-29', 'menstrual', 1]
  ])('maps %s to the expected phase', (today, phase, cycleDay) => {
    const result = getCycleView('2026-09-01', 28, new Date(`${today}T12:00:00Z`));

    expect(result.current_phase).toBe(phase);
    expect(result.cycle_day).toBe(cycleDay);
  });

  test('covers every day for supported cycle lengths', () => {
    for (let cycleLength = 21; cycleLength <= 40; cycleLength += 1) {
      const ranges = getPhaseRanges(cycleLength);
      const coveredDays = ranges.flatMap(({ endDay, startDay }) =>
        Array.from({ length: endDay - startDay + 1 }, (_, index) => startDay + index)
      );

      expect(coveredDays).toEqual(Array.from({ length: cycleLength }, (_, index) => index + 1));
    }
  });
});
