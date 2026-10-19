/**
 * Pure fitness calculations & utilities
 * Decoupled from React for high testability and deterministic assertions
 */

export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
}

export interface MacroSplit {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  calories: number;
}

export interface BMICategory {
  bmi: number;
  category: 'Kurus' | 'Ideal / Normal' | 'Kelebihan Berat' | 'Obesitas';
  color: string;
  idealWeightRange: { min: number; max: number };
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 */
export function calculateBMR(profile: UserProfile): number {
  const { gender, weightKg, heightCm, age } = profile;
  // Mifflin-St Jeor:
  // Men: BMR = (10 * weight) + (6.25 * height) - (5 * age) + 5
  // Women: BMR = (10 * weight) + (6.25 * height) - (5 * age) - 161
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

/**
 * Activity multiplier for Total Daily Energy Expenditure (TDEE)
 */
export const ACTIVITY_MULTIPLIERS: Record<UserProfile['activityLevel'], number> = {
  sedentary: 1.2,       // Sedikit atau tanpa olahraga
  light: 1.375,         // Olahraga ringan 1-3 hari/minggu
  moderate: 1.55,       // Olahraga sedang 3-5 hari/minggu
  active: 1.725,        // Olahraga berat 6-7 hari/minggu
  very_active: 1.9,     // Olahraga sangat berat & pekerjaan fisik
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const multiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate target daily calories based on goal
 */
export function calculateTargetCalories(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  if (profile.goal === 'lose_weight') {
    // 500 kcal deficit, minimum safe floor
    const minCalories = profile.gender === 'male' ? 1500 : 1200;
    return Math.max(minCalories, Math.round(tdee - 500));
  }
  if (profile.goal === 'gain_muscle') {
    return Math.round(tdee + 350);
  }
  return tdee;
}

/**
 * Calculate recommended macronutrient distribution (Protein, Carbs, Fat)
 */
export function calculateMacros(targetCalories: number, goal: UserProfile['goal']): MacroSplit {
  let proteinRatio = 0.25;
  let fatRatio = 0.25;
  let carbsRatio = 0.50;

  if (goal === 'gain_muscle') {
    proteinRatio = 0.30;
    fatRatio = 0.25;
    carbsRatio = 0.45;
  } else if (goal === 'lose_weight') {
    proteinRatio = 0.35;
    fatRatio = 0.25;
    carbsRatio = 0.40;
  }

  // 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal
  const proteinGrams = Math.round((targetCalories * proteinRatio) / 4);
  const fatGrams = Math.round((targetCalories * fatRatio) / 9);
  const carbsGrams = Math.round((targetCalories * carbsRatio) / 4);

  return {
    proteinGrams,
    carbsGrams,
    fatGrams,
    calories: targetCalories,
  };
}

/**
 * Calculate Body Mass Index (BMI) and Classification
 */
export function calculateBMI(weightKg: number, heightCm: number): BMICategory {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category: BMICategory['category'] = 'Ideal / Normal';
  let color = 'text-emerald-500';

  if (bmi < 18.5) {
    category = 'Kurus';
    color = 'text-amber-500';
  } else if (bmi >= 18.5 && bmi < 25.0) {
    category = 'Ideal / Normal';
    color = 'text-emerald-500';
  } else if (bmi >= 25.0 && bmi < 30.0) {
    category = 'Kelebihan Berat';
    color = 'text-orange-500';
  } else {
    category = 'Obesitas';
    color = 'text-rose-500';
  }

  // Normal BMI range is 18.5 to 24.9
  const idealMin = Number((18.5 * heightM * heightM).toFixed(1));
  const idealMax = Number((24.9 * heightM * heightM).toFixed(1));

  return {
    bmi,
    category,
    color,
    idealWeightRange: { min: idealMin, max: idealMax },
  };
}

/**
 * Determine Heart Rate Zone based on BPM and age
 */
export interface HeartRateZone {
  name: string;
  range: string;
  minBpm: number;
  maxBpm: number;
  color: string;
  benefit: string;
}

export function getHeartRateZone(bpm: number, age: number = 28): HeartRateZone {
  const maxHR = 220 - age;
  const pct = (bpm / maxHR) * 100;

  if (pct < 50) {
    return {
      name: 'Istirahat (Rest)',
      range: `< ${Math.round(maxHR * 0.5)} BPM`,
      minBpm: 0,
      maxBpm: Math.round(maxHR * 0.5),
      color: 'text-slate-400',
      benefit: 'Pemulihan dan relaksasi sistem saraf',
    };
  }
  if (pct < 60) {
    return {
      name: 'Pemanasan (Warm Up)',
      range: `${Math.round(maxHR * 0.5)} - ${Math.round(maxHR * 0.6)} BPM`,
      minBpm: Math.round(maxHR * 0.5),
      maxBpm: Math.round(maxHR * 0.6),
      color: 'text-blue-500',
      benefit: 'Mempersiapkan otot & meningkatkan aliran darah',
    };
  }
  if (pct < 70) {
    return {
      name: 'Pembakaran Lemak (Fat Burn)',
      range: `${Math.round(maxHR * 0.6)} - ${Math.round(maxHR * 0.7)} BPM`,
      minBpm: Math.round(maxHR * 0.6),
      maxBpm: Math.round(maxHR * 0.7),
      color: 'text-emerald-500',
      benefit: 'Zona optimal pembakaran cadangan lemak tubuh',
    };
  }
  if (pct < 85) {
    return {
      name: 'Kardio Aerobik (Cardio)',
      range: `${Math.round(maxHR * 0.7)} - ${Math.round(maxHR * 0.85)} BPM`,
      minBpm: Math.round(maxHR * 0.7),
      maxBpm: Math.round(maxHR * 0.85),
      color: 'text-amber-500',
      benefit: 'Meningkatkan daya tahan jantung & paru-paru',
    };
  }
  return {
    name: 'Puncak / Anaerobik (Peak)',
    range: `> ${Math.round(maxHR * 0.85)} BPM`,
    minBpm: Math.round(maxHR * 0.85),
    maxBpm: maxHR,
    color: 'text-rose-500',
    benefit: 'Meningkatkan batas VO2 max & performa kecepatan',
  };
}

/**
 * Check which badges are unlocked given stats
 */
export interface UserStats {
  streakDays: number;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  totalWaterLoggedMl: number;
  communityPostsCount: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'workout' | 'streak' | 'nutrition' | 'community';
  unlocked: boolean;
  progress: number; // 0 to 100
}

export function evaluateBadges(stats: UserStats): Badge[] {
  return [
    {
      id: 'first_step',
      title: 'Langkah Pertama',
      description: 'Selesaikan latihan perdana Anda',
      icon: 'Footprints',
      category: 'workout',
      unlocked: stats.totalWorkouts >= 1,
      progress: Math.min(100, Math.round((stats.totalWorkouts / 1) * 100)),
    },
    {
      id: 'streak_3',
      title: 'Disiplin Awal',
      description: 'Pertahankan streak latihan selama 3 hari berturut-turut',
      icon: 'Flame',
      category: 'streak',
      unlocked: stats.streakDays >= 3,
      progress: Math.min(100, Math.round((stats.streakDays / 3) * 100)),
    },
    {
      id: 'streak_7',
      title: 'Pejuang 7 Hari',
      description: 'Konsisten berolahraga selama 1 minggu penuh',
      icon: 'Trophy',
      category: 'streak',
      unlocked: stats.streakDays >= 7,
      progress: Math.min(100, Math.round((stats.streakDays / 7) * 100)),
    },
    {
      id: 'burn_500',
      title: 'Pembakar Kalori',
      description: 'Bakar total 500 kcal melalui latihan',
      icon: 'Zap',
      category: 'workout',
      unlocked: stats.totalCaloriesBurned >= 500,
      progress: Math.min(100, Math.round((stats.totalCaloriesBurned / 500) * 100)),
    },
    {
      id: 'burn_2000',
      title: 'Mesin Pembakar',
      description: 'Bakar total 2.000 kcal akumulatif',
      icon: 'Award',
      category: 'workout',
      unlocked: stats.totalCaloriesBurned >= 2000,
      progress: Math.min(100, Math.round((stats.totalCaloriesBurned / 2000) * 100)),
    },
    {
      id: 'hydrate_master',
      title: 'Pahlawan Hidrasi',
      description: 'Catat konsumsi air minum hingga 10.000 ml',
      icon: 'Droplets',
      category: 'nutrition',
      unlocked: stats.totalWaterLoggedMl >= 10000,
      progress: Math.min(100, Math.round((stats.totalWaterLoggedMl / 10000) * 100)),
    },
    {
      id: 'community_voice',
      title: 'Pemberi Motivasi',
      description: 'Bagikan 1 kiriman motivasi di forum komunitas',
      icon: 'MessageSquare',
      category: 'community',
      unlocked: stats.communityPostsCount >= 1,
      progress: Math.min(100, Math.round((stats.communityPostsCount / 1) * 100)),
    },
  ];
}
