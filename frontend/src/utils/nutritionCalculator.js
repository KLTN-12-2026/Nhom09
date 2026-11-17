
export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Ít vận động (Dân văn phòng, ít tập thể dục)', multiplier: 1.2 },
  { value: 'light', label: 'Vận động nhẹ (Tập thể dục 1-3 ngày/tuần)', multiplier: 1.375 },
  { value: 'moderate', label: 'Vận động vừa (Tập luyện 3-5 ngày/tuần)', multiplier: 1.55 },
  { value: 'very_active', label: 'Vận động nhiều (Tập luyện 6-7 ngày/tuần)', multiplier: 1.725 },
  { value: 'extra_active', label: 'Vận động cực nhiều (VĐV, lao động nặng)', multiplier: 1.9 },
];

export const GOALS = [
  { value: 'maintain', label: 'Duy trì cân nặng & Sức khỏe', caloOffset: 0, proteinPerKg: 1.6 },
  { value: 'weight_loss', label: 'Giảm mỡ / Giảm cân an toàn', caloOffset: -450, proteinPerKg: 2.0 },
  { value: 'muscle_gain', label: 'Tăng cân / Tăng cơ nạc', caloOffset: 350, proteinPerKg: 2.2 },
  { value: 'eat_clean', label: 'Ăn lành mạnh / Thanh lọc cơ thể', caloOffset: -200, proteinPerKg: 1.6 },
];

export const COMMON_ALLERGIES = [
  'Hải sản (Tôm, Cua, Mực)',
  'Đậu phộng / Lạc',
  'Trứng',
  'Sữa bò / Lactose',
  'Đậu nành',
  'Gluten / Lúa mì',
  'Mè / Vừng',
  'Thịt bò',
];

export const calculateBMR = ({ weight, height, age, gender }) => {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);

  if (!w || !h || !a) return null;

  const isMale = gender === 'male' || gender === 'Nam';

  const base = 10 * w + 6.25 * h - 5 * a;
  return Math.round(isMale ? base + 5 : base - 161);
};

export const calculateTDEE = (bmr, activityLevel = 'sedentary') => {
  if (!bmr) return null;
  const level = ACTIVITY_LEVELS.find((item) => item.value === activityLevel) || ACTIVITY_LEVELS[0];
  return Math.round(bmr * level.multiplier);
};

export const calculateBMI = (weight, height) => {
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100;
  if (!w || !h || h <= 0) return null;

  const bmi = parseFloat((w / (h * h)).toFixed(1));
  let category;
  let color;

  if (bmi < 18.5) {
    category = 'Thiếu cân (Underweight)';
    color = 'text-amber-500';
  } else if (bmi <= 22.9) {
    category = 'Bình thường (Chuẩn lý tưởng)';
    color = 'text-emerald-500';
  } else if (bmi <= 24.9) {
    category = 'Thừa cân / Tiền béo phì';
    color = 'text-orange-500';
  } else {
    category = 'Béo phì';
    color = 'text-rose-500';
  }

  return { bmi, category, color };
};

export const calculateMacroGoals = (profile) => {
  if (!profile?.weight || !profile?.height || !profile?.age) return null;

  const bmr = calculateBMR(profile);
  if (!bmr) return null;

  const tdee = calculateTDEE(bmr, profile.activityLevel || 'sedentary');
  const bmiInfo = calculateBMI(profile.weight, profile.height);

  const goalObj = GOALS.find((g) => g.value === profile.goal) || GOALS[0];
  const targetCalories = Math.max(1200, tdee + goalObj.caloOffset);

  const weight = parseFloat(profile.weight);
  const targetProteinGrams = Math.round(weight * goalObj.proteinPerKg);
  const proteinCalories = targetProteinGrams * 4;

  const fatCalories = Math.round(targetCalories * 0.25);
  const targetFatGrams = Math.round(fatCalories / 9);

  const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const targetCarbGrams = Math.round(carbCalories / 4);

  return {
    bmr,
    tdee,
    targetCalories,
    bmi: bmiInfo?.bmi,
    bmiCategory: bmiInfo?.category,
    bmiColor: bmiInfo?.color,
    macros: {
      protein: { grams: targetProteinGrams, calories: proteinCalories, percent: Math.round((proteinCalories / targetCalories) * 100) },
      fat: { grams: targetFatGrams, calories: fatCalories, percent: Math.round((fatCalories / targetCalories) * 100) },
      carbs: { grams: targetCarbGrams, calories: carbCalories, percent: Math.round((carbCalories / targetCalories) * 100) },
    },
  };
};

export const checkFoodHealthConflict = (food, healthProfile) => {
  if (!food || !healthProfile) return { hasConflict: false, warnings: [] };

  const warnings = [];

  const userAllergies = Array.isArray(healthProfile.allergies)
    ? healthProfile.allergies
    : typeof healthProfile.allergies === 'string'
    ? healthProfile.allergies.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const foodIngredients = Array.isArray(food.ingredients) ? food.ingredients : [];
  const foodWarningFor = Array.isArray(food.warningFor) ? food.warningFor : [];
  const foodName = food.name || '';

  const allergyKeywordsMap = {
    'hải sản': ['tôm', 'cua', 'mực', 'ghẹ', 'nghêu', 'sò', 'hàu', 'ốc', 'seafood'],
    'đậu phộng': ['đậu phộng', 'lạc', 'peanut'],
    'trứng': ['trứng', 'egg', 'lòng đỏ', 'lòng trắng'],
    'sữa': ['sữa', 'bơ', 'phô mai', 'cheese', 'milk', 'lactose'],
    'đậu nành': ['đậu nành', 'đậu phụ', 'tàu hũ', 'soy'],
    'gluten': ['bột mì', 'lúa mì', 'gluten'],
    'mè': ['mè', 'vừng', 'sesame'],
    'thịt bò': ['thịt bò', 'bò'],
  };

  userAllergies.forEach((allergy) => {
    const allergyLower = allergy.toLowerCase();

    let matchedKeywords = [allergyLower];
    Object.entries(allergyKeywordsMap).forEach(([key, list]) => {
      if (allergyLower.includes(key)) {
        matchedKeywords = [...matchedKeywords, ...list];
      }
    });

    const isMatchIngredient = foodIngredients.some((ing) =>
      matchedKeywords.some((kw) => ing.toLowerCase().includes(kw))
    );
    const isMatchName = matchedKeywords.some((kw) => foodName.toLowerCase().includes(kw));

    if (isMatchIngredient || isMatchName) {
      warnings.push({
        type: 'allergy',
        level: 'danger',
        title: `Phát hiện dị ứng: ${allergy}`,
        message: `Món "${foodName}" có thể chứa thành phần liên quan đến [${allergy}] trong danh mục dị ứng của bạn.`,
      });
    }
  });

  const userConditions = Array.isArray(healthProfile.conditions)
    ? healthProfile.conditions
    : typeof healthProfile.conditions === 'string'
    ? healthProfile.conditions.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  userConditions.forEach((condition) => {
    const conditionLower = condition.toLowerCase();
    const isWarningMatch = foodWarningFor.some((wf) => {
      const wfLower = wf.toLowerCase();
      return wfLower.includes(conditionLower) || conditionLower.includes(wfLower);
    });

    if (isWarningMatch) {
      warnings.push({
        type: 'condition',
        level: 'warning',
        title: `Cảnh báo sức khỏe: ${condition}`,
        message: `Món "${foodName}" có chỉ định lưu ý đối với người có bệnh lý [${condition}].`,
      });
    }
  });

  return {
    hasConflict: warnings.length > 0,
    warnings,
  };
};

