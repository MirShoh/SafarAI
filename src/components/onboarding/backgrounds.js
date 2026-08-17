// Rotated across onboarding screens so the backdrop keeps changing instead of
// reusing one photo (or worse, falling back to plain white) as the user
// moves from step to step.
export const ONBOARDING_BACKGROUNDS = [
  "/images/aksaray-shahrisabz.jpg", // tarixiy obida
  "/images/kitob-mountains.jpg", // tog'li hudud
  "/images/qashqadaryo-river.jpg", // suvli manzara
  "/images/kitob-dovoni.jpg", // tog' dovoni
  "/images/qarshi-bridge.jpg", // shahar / tarix
  "/images/qashqadaryo-osh.jpg", // milliy taom
];

export function backgroundFor(index) {
  return ONBOARDING_BACKGROUNDS[index % ONBOARDING_BACKGROUNDS.length];
}
