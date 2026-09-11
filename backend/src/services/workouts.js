const intensityByPhase = {
  follicular: 'progressive',
  luteal: 'moderate',
  menstrual: 'low',
  ovulatory: 'high'
};

const titleByPhase = {
  follicular: 'Course progressive',
  luteal: 'Footing modéré',
  menstrual: 'Footing récupération',
  ovulatory: 'Séance dynamique'
};

const durationByLevel = {
  avancee: 40,
  debutante: 20,
  intermediaire: 30
};

const phaseDurationAdjustment = {
  follicular: 5,
  luteal: 0,
  menstrual: -5,
  ovulatory: 10
};

function getWorkoutRecommendation({ cycleView, goal, level }) {
  const phase = cycleView.current_phase;
  const goalAdjustment = goal === 'endurance' ? 5 : 0;

  return {
    date: new Date().toISOString().slice(0, 10),
    duration: Math.max(
      15,
      durationByLevel[level] + phaseDurationAdjustment[phase] + goalAdjustment
    ),
    intensity: intensityByPhase[phase],
    phase,
    title: titleByPhase[phase],
    type: 'run'
  };
}

module.exports = { getWorkoutRecommendation };
