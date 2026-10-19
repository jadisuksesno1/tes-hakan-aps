import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  calculateBMI,
  getHeartRateZone,
  evaluateBadges,
} from './fitness.ts';
import type { UserProfile } from './fitness.ts';

test('calculateBMR correctly computes male and female baseline metabolism', () => {
  const maleProfile: UserProfile = {
    gender: 'male',
    age: 25,
    weightKg: 70,
    heightCm: 175,
    activityLevel: 'moderate',
    goal: 'maintain',
  };
  // (10 * 70) + (6.25 * 175) - (5 * 25) + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> 1674
  const bmrMale = calculateBMR(maleProfile);
  assert.equal(bmrMale, 1674);

  const femaleProfile: UserProfile = {
    ...maleProfile,
    gender: 'female',
  };
  // 1673.75 - 5 - 161 = 1507.75 -> 1508
  const bmrFemale = calculateBMR(femaleProfile);
  assert.equal(bmrFemale, 1508);
});

test('calculateTDEE and calculateTargetCalories adjust for goals accurately', () => {
  const profile: UserProfile = {
    gender: 'male',
    age: 30,
    weightKg: 80,
    heightCm: 180,
    activityLevel: 'moderate', // 1.55 multiplier
    goal: 'lose_weight',
  };
  // BMR = 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
  // TDEE = 1780 * 1.55 = 2759
  const tdee = calculateTDEE(profile);
  assert.equal(tdee, 2759);

  // Lose weight should have ~500 deficit
  const targetDeficit = calculateTargetCalories(profile);
  assert.equal(targetDeficit, 2259);

  // Gain muscle should have +350 surplus
  const bulkProfile: UserProfile = { ...profile, goal: 'gain_muscle' };
  assert.equal(calculateTargetCalories(bulkProfile), 2759 + 350);
});

test('calculateMacros yields valid protein, carbs, and fat distributions', () => {
  const macros = calculateMacros(2000, 'lose_weight');
  assert.ok(macros.proteinGrams > 0);
  assert.ok(macros.carbsGrams > 0);
  assert.ok(macros.fatGrams > 0);
  assert.equal(macros.calories, 2000);
});

test('calculateBMI correctly identifies categories and ranges', () => {
  // 70kg at 1.75m -> BMI 22.9 (Ideal / Normal)
  const normal = calculateBMI(70, 175);
  assert.equal(normal.bmi, 22.9);
  assert.equal(normal.category, 'Ideal / Normal');
  assert.ok(normal.idealWeightRange.min < 70 && normal.idealWeightRange.max > 70);

  // 95kg at 1.75m -> BMI 31.0 (Obesitas)
  const obese = calculateBMI(95, 175);
  assert.equal(obese.category, 'Obesitas');

  // 50kg at 1.75m -> BMI 16.3 (Kurus)
  const under = calculateBMI(50, 175);
  assert.equal(under.category, 'Kurus');
});

test('getHeartRateZone maps BPM to appropriate intensity zones', () => {
  const restZone = getHeartRateZone(65, 30);
  assert.ok(restZone.name.includes('Istirahat') || restZone.name.includes('Pemanasan'));

  const fatBurnZone = getHeartRateZone(125, 30);
  assert.ok(fatBurnZone.name.includes('Pembakaran Lemak'));

  const peakZone = getHeartRateZone(175, 30);
  assert.ok(peakZone.name.includes('Puncak'));
});

test('evaluateBadges unlocks badges based on criteria', () => {
  const freshStats = {
    streakDays: 0,
    totalWorkouts: 0,
    totalCaloriesBurned: 0,
    totalWaterLoggedMl: 0,
    communityPostsCount: 0,
  };
  const initialBadges = evaluateBadges(freshStats);
  assert.equal(initialBadges.every(b => !b.unlocked), true);

  const activeStats = {
    streakDays: 7,
    totalWorkouts: 5,
    totalCaloriesBurned: 1200,
    totalWaterLoggedMl: 12000,
    communityPostsCount: 2,
  };
  const unlockedBadges = evaluateBadges(activeStats);
  const firstStep = unlockedBadges.find(b => b.id === 'first_step');
  const streak7 = unlockedBadges.find(b => b.id === 'streak_7');
  const hydrate = unlockedBadges.find(b => b.id === 'hydrate_master');
  const community = unlockedBadges.find(b => b.id === 'community_voice');

  assert.equal(firstStep?.unlocked, true);
  assert.equal(streak7?.unlocked, true);
  assert.equal(hydrate?.unlocked, true);
  assert.equal(community?.unlocked, true);
});
