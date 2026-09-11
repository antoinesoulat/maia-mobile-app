const DAY_IN_MS = 24 * 60 * 60 * 1000;

const phaseLabels = {
  follicular: 'Phase folliculaire',
  luteal: 'Phase lutéale',
  menstrual: 'Phase menstruelle',
  ovulatory: 'Phase ovulatoire'
};

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

function getPhaseRanges(cycleLength) {
  const ovulatoryStart = Math.max(7, cycleLength - 14);
  const ovulatoryEnd = Math.min(cycleLength, ovulatoryStart + 3);

  return [
    { endDay: Math.min(5, cycleLength), phase: 'menstrual', startDay: 1 },
    { endDay: ovulatoryStart - 1, phase: 'follicular', startDay: 6 },
    { endDay: ovulatoryEnd, phase: 'ovulatory', startDay: ovulatoryStart },
    { endDay: cycleLength, phase: 'luteal', startDay: ovulatoryEnd + 1 }
  ].filter(({ endDay, startDay }) => startDay <= endDay);
}

function getCycleView(cycleStartDate, cycleLength, today = new Date()) {
  const initialStart = parseDate(cycleStartDate);
  const currentDate = parseDate(formatDate(today));
  const elapsedDays = Math.max(0, Math.floor((currentDate - initialStart) / DAY_IN_MS));
  const completedCycles = Math.floor(elapsedDays / cycleLength);
  const cycleDay = (elapsedDays % cycleLength) + 1;
  const currentCycleStart = addDays(initialStart, completedCycles * cycleLength);
  const ranges = getPhaseRanges(cycleLength);
  const currentPhase = ranges.find(
    ({ endDay, startDay }) => cycleDay >= startDay && cycleDay <= endDay
  ).phase;

  return {
    cycle_day: cycleDay,
    cycle_length: cycleLength,
    cycle_start_date: formatDate(currentCycleStart),
    current_phase: currentPhase,
    current_phase_label: phaseLabels[currentPhase],
    next_cycle_start_date: formatDate(addDays(currentCycleStart, cycleLength)),
    phase_projections: ranges.map(({ endDay, phase, startDay }) => ({
      end_date: formatDate(addDays(currentCycleStart, endDay - 1)),
      label: phaseLabels[phase],
      phase,
      start_date: formatDate(addDays(currentCycleStart, startDay - 1))
    }))
  };
}

module.exports = { getCycleView, getPhaseRanges };
