import React, { useState } from 'react';
import { Plus, Utensils, Droplets, Flame, Clock, Heart, Check, Calculator, Trash2 } from 'lucide-react';
import { LoggedMeal, MealRecipe } from '../types';
import { HEALTHY_MEALS_DATA } from '../data/meals';
import {
  UserProfile,
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
} from '../utils/fitness';

interface NutritionViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  loggedMeals: LoggedMeal[];
  onAddMeal: (meal: LoggedMeal) => void;
  onDeleteMeal: (mealId: string) => void;
  waterLoggedMl: number;
  onUpdateWater: (ml: number) => void;
  caloriesBurnedToday: number;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  userProfile,
  onUpdateProfile,
  loggedMeals,
  onAddMeal,
  onDeleteMeal,
  waterLoggedMl,
  onUpdateWater,
  caloriesBurnedToday,
}) => {
  const [selectedMealCategory, setSelectedMealCategory] = useState<string>('Semua');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<MealRecipe | null>(null);

  // Custom meal input modal state
  const [isAddCustomOpen, setIsAddCustomOpen] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customType, setCustomType] = useState<LoggedMeal['mealType']>('Makan Siang');
  const [customCalories, setCustomCalories] = useState<number>(350);
  const [customProtein, setCustomProtein] = useState<number>(25);
  const [customCarbs, setCustomCarbs] = useState<number>(35);
  const [customFat, setCustomFat] = useState<number>(10);

  // Calculations
  const targetCalories = calculateTargetCalories(userProfile);
  const macrosTarget = calculateMacros(targetCalories, userProfile.goal);

  const totalCaloriesConsumed = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinConsumed = loggedMeals.reduce((acc, m) => acc + m.proteinG, 0);
  const totalCarbsConsumed = loggedMeals.reduce((acc, m) => acc + m.carbsG, 0);
  const totalFatConsumed = loggedMeals.reduce((acc, m) => acc + m.fatG, 0);

  const remainingCalories = targetCalories - totalCaloriesConsumed + caloriesBurnedToday;
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / targetCalories) * 100));

  const filteredRecipes = HEALTHY_MEALS_DATA.filter((r) => {
    if (selectedMealCategory === 'Semua') return true;
    return r.category === selectedMealCategory;
  });

  const handleAddFromRecipe = (recipe: MealRecipe) => {
    const mealType: LoggedMeal['mealType'] = 
      recipe.category === 'Sarapan' ? 'Sarapan' :
      recipe.category === 'Makan Siang' ? 'Makan Siang' :
      recipe.category === 'Makan Malam' ? 'Makan Malam' : 'Camilan';

    onAddMeal({
      id: 'meal-' + Date.now(),
      recipeId: recipe.id,
      name: recipe.name,
      mealType,
      calories: recipe.calories,
      proteinG: recipe.proteinG,
      carbsG: recipe.carbsG,
      fatG: recipe.fatG,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustomMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onAddMeal({
      id: 'custom-' + Date.now(),
      name: customName.trim(),
      mealType: customType,
      calories: Number(customCalories) || 0,
      proteinG: Number(customProtein) || 0,
      carbsG: Number(customCarbs) || 0,
      fatG: Number(customFat) || 0,
      timestamp: new Date().toISOString(),
    });

    setCustomName('');
    setIsAddCustomOpen(false);
  };

  const handleAddWater = (amountMl: number) => {
    onUpdateWater(Math.max(0, waterLoggedMl + amountMl));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Nutrisi & Rekomendasi Menu Sehat
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Menu sehat terukur sesuai target kalori harian ({userProfile.goal === 'lose_weight' ? 'Defisit Kalori' : userProfile.goal === 'gain_muscle' ? 'Surplus Kalori' : 'Pemeliharaan'}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-500" />
            <span>Kalkulator Kalori & BMR</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddCustomOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-xs shadow-emerald-500/20 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Makanan Baru</span>
          </button>
        </div>
      </div>

      {/* Interactive Calorie & BMR Calculator Box */}
      {isCalculatorOpen && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Pengaturan Kebutuhan Kalori Personal
              </h3>
              <p className="text-xs text-slate-500">
                Formula Ilmiah Mifflin-St Jeor menghitung BMR dan TDEE secara presisi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Jenis Kelamin
              </label>
              <select
                value={userProfile.gender}
                onChange={(e) => onUpdateProfile({ ...userProfile, gender: e.target.value as 'male' | 'female' })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="male">Pria</option>
                <option value="female">Wanita</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                value={userProfile.weightKg}
                onChange={(e) => onUpdateProfile({ ...userProfile, weightKg: Number(e.target.value) || 60 })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                value={userProfile.heightCm}
                onChange={(e) => onUpdateProfile({ ...userProfile, heightCm: Number(e.target.value) || 165 })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Usia (tahun)
              </label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => onUpdateProfile({ ...userProfile, age: Number(e.target.value) || 25 })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Tingkat Aktivitas Fisik
              </label>
              <select
                value={userProfile.activityLevel}
                onChange={(e) => onUpdateProfile({ ...userProfile, activityLevel: e.target.value as UserProfile['activityLevel'] })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="sedentary">Sedentary (Jarang / Tanpa Olahraga)</option>
                <option value="light">Ringan (Olahraga 1-3 hari/minggu)</option>
                <option value="moderate">Sedang (Olahraga 3-5 hari/minggu)</option>
                <option value="active">Aktif (Olahraga 6-7 hari/minggu)</option>
                <option value="very_active">Sangat Aktif (Latihan berat 2x sehari)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Target Tubuh
              </label>
              <select
                value={userProfile.goal}
                onChange={(e) => onUpdateProfile({ ...userProfile, goal: e.target.value as UserProfile['goal'] })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="lose_weight">Turunkan Berat Badan (Defisit 500 kcal)</option>
                <option value="maintain">Pertahankan Berat Badan (Keseimbangan TDEE)</option>
                <option value="gain_muscle">Tambah Massa Otot / Lean Bulk (+350 kcal)</option>
              </select>
            </div>
          </div>

          {/* Result summary strip */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-center">
            <div>
              <span className="text-[11px] text-slate-500">BMR Alami</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {calculateBMR(userProfile)} kcal
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500">TDEE Total</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {calculateTDEE(userProfile)} kcal
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500">Target Harian Anda</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {targetCalories} kcal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Nutrition Summary Dashboard Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring & Net Balance */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Anggaran Kalori Harian
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {caloriePercent}%
              </span>
            </div>

            {/* Circular progress with numbers */}
            <div className="flex items-center gap-6 my-2">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-emerald-500 transition-all duration-500"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={(2 * Math.PI * 46) * (1 - Math.min(100, caloriePercent) / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {totalCaloriesConsumed}
                  </span>
                  <span className="block text-[9px] text-slate-400 uppercase">
                    Dikonsumsi
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Target:</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                    {targetCalories} kcal
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Terbakar Latihan:</span>
                  <span className="font-semibold text-orange-500 font-mono tabular-nums">
                    -{caloriesBurnedToday} kcal
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Sisa Kalori:</span>
                  <span className={`font-bold font-mono tabular-nums ${remainingCalories >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {remainingCalories} kcal
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            💡 Pertahankan asupan makanan utuh bernutrisi padat untuk menjaga energi sepanjang hari.
          </p>
        </div>

        {/* Macronutrients Breakdown */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-4">
              Distribusi Makronutrisi
            </span>

            <div className="space-y-4 text-xs">
              {/* Protein */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Protein</span>
                  <span className="font-mono tabular-nums text-slate-500">
                    {totalProteinConsumed}g / {macrosTarget.proteinGrams}g
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalProteinConsumed / macrosTarget.proteinGrams) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Karbohidrat</span>
                  <span className="font-mono tabular-nums text-slate-500">
                    {totalCarbsConsumed}g / {macrosTarget.carbsGrams}g
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalCarbsConsumed / macrosTarget.carbsGrams) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Lemak Sehat</span>
                  <span className="font-mono tabular-nums text-slate-500">
                    {totalFatConsumed}g / {macrosTarget.fatGrams}g
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalFatConsumed / macrosTarget.fatGrams) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Rasio Ideal: 30% Protein · 45% Karbohidrat · 25% Lemak</span>
          </div>
        </div>

        {/* Water Intake Tracker */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pelacak Hidrasi Air
              </span>
              <Droplets className="w-4 h-4 text-cyan-500" />
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {waterLoggedMl}
                </span>
                <span className="text-xs text-slate-400">/ 2.500 ml target</span>
              </div>

              <div className="mt-3 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (waterLoggedMl / 2500) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quick add buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleAddWater(250)}
                className="py-2 px-2 text-center text-xs font-semibold rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 transition-colors cursor-pointer"
              >
                +250 ml (1 Gelas)
              </button>
              <button
                type="button"
                onClick={() => handleAddWater(500)}
                className="py-2 px-2 text-center text-xs font-semibold rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 transition-colors cursor-pointer"
              >
                +500 ml (1 Botol)
              </button>
              <button
                type="button"
                onClick={() => handleAddWater(-250)}
                className="py-2 px-2 text-center text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
              >
                Kurangi 250ml
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {waterLoggedMl >= 2500
              ? '🎉 Target hidrasi hari ini tercapai sempurna!'
              : `Kurang ${2500 - waterLoggedMl} ml lagi untuk memenuhi kebutuhan harian tubuh.`}
          </p>
        </div>
      </div>

      {/* Meals Logged Today List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Catatan Makanan Hari Ini ({loggedMeals.length} Makanan)
          </h3>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            Total {totalCaloriesConsumed} kcal
          </span>
        </div>

        {loggedMeals.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            Belum ada makanan yang dicatat hari ini. Pilih menu rekomendasi di bawah atau klik "Catat Makanan Baru".
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loggedMeals.map((meal) => (
              <div key={meal.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {meal.mealType}
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {meal.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{meal.proteinG}g Protein</span>
                    <span>·</span>
                    <span>{meal.carbsG}g Karbo</span>
                    <span>·</span>
                    <span>{meal.fatG}g Lemak</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm font-mono tabular-nums text-slate-900 dark:text-white">
                    {meal.calories} kcal
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    title="Hapus catatan makanan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Healthy Meals Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Katalog Resep & Rekomendasi Menu Sehat
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Menu sehat kaya nutrisi yang dihitung makronya untuk mendukung target kebugaran Anda.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            {['Semua', 'Sarapan', 'Makan Siang', 'Makan Malam', 'Camilan Sehat'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedMealCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedMealCategory === cat
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {recipe.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {recipe.prepTimeMin}m
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1.5">
                  {recipe.name}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {recipe.healthBenefit}
                </p>

                {/* Macro pill-free strip */}
                <div className="grid grid-cols-4 gap-1 py-2 px-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center text-[10px] mb-3">
                  <div>
                    <span className="text-slate-400 block">Kcal</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">{recipe.calories}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Prot</span>
                    <span className="font-bold font-mono text-blue-500">{recipe.proteinG}g</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Karb</span>
                    <span className="font-bold font-mono text-amber-500">{recipe.carbsG}g</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lmk</span>
                    <span className="font-bold font-mono text-rose-500">{recipe.fatG}g</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRecipeDetail(recipe)}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-center"
                >
                  Resep
                </button>
                <button
                  type="button"
                  onClick={() => handleAddFromRecipe(recipe)}
                  className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-xs cursor-pointer"
                  title="Tambahkan ke jurnal hari ini"
                >
                  + Catat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedRecipeDetail.category} · {selectedRecipeDetail.prepTimeMin} Menit
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedRecipeDetail.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecipeDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                  Khasiat & Manfaat Tubuh:
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedRecipeDetail.healthBenefit}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-2">
                  Bahan-Bahan:
                </span>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  {selectedRecipeDetail.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-2">
                  Langkah Pembuatan:
                </span>
                <ol className="space-y-2 text-slate-600 dark:text-slate-300 list-decimal pl-4">
                  {selectedRecipeDetail.instructions.map((ins, i) => (
                    <li key={i} className="pl-1">
                      {ins}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedRecipeDetail(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddFromRecipe(selectedRecipeDetail);
                  setSelectedRecipeDetail(null);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-emerald-500 text-white shadow-xs"
              >
                Catat Menu Ini (+{selectedRecipeDetail.calories} kcal)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Meal Modal */}
      {isAddCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveCustomMeal}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Catat Makanan Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Nama Makanan
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Nasi Merah + Ayam Bakar"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Waktu Makan
                </label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value as LoggedMeal['mealType'])}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Sarapan">Sarapan</option>
                  <option value="Makan Siang">Makan Siang</option>
                  <option value="Makan Malam">Makan Malam</option>
                  <option value="Camilan">Camilan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Kalori (kcal)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(Number(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-500 mb-1">Protein (g)</label>
                <input
                  type="number"
                  min="0"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(Number(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Karbohidrat (g)</label>
                <input
                  type="number"
                  min="0"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(Number(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Lemak (g)</label>
                <input
                  type="number"
                  min="0"
                  value={customFat}
                  onChange={(e) => setCustomFat(Number(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddCustomOpen(false)}
                className="flex-1 py-2.5 font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 font-semibold rounded-xl bg-emerald-500 text-white shadow-xs"
              >
                Simpan Catatan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
