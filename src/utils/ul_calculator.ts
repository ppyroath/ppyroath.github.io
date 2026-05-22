/**
 * Tabel Data Union XP (Level 1 - 20)
 * Catatan: Data dari level 21 hingga 80 perlu disalin secara manual dari spreadsheet 
 * karena sistem tidak dapat mengakses isi baris Google Sheets secara langsung.
 */
export const UNION_XP_TABLE: Record<number, number> = {
  1: 400,
  2: 500,
  3: 600,
  4: 1100,
  5: 1200,
  6: 1300,
  7: 1400,
  8: 1500,
  9: 1600,
  10: 1600,
  11: 1650,
  12: 1650,
  13: 1700,
  14: 1700,
  15: 1700,
  16: 1750,
  17: 1750,
  18: 1800,
  19: 1800,
  20: 2300,
  // TODO: Tambahkan sisa data dari level 21 sampai 80 dari Google Sheets
  21: 2400,
  22: 2500,
  23: 2500,
  24: 2500,
  25: 2700,
  26: 2900,
  27: 3000,
  28: 3200,
  29: 3400,
  30: 6500,
  31: 6700,
  32: 6800,
  33: 7200,
  34: 7600,
  35: 8000,
  36: 8400,
  37: 9000,
  38: 9600,
  39: 10000,
  40: 10200,
  41: 10400,
  42: 10600,
  43: 10800,
  44: 11200,
  45: 11600,
  46: 12000,
  47: 12400,
  48: 12800,
  49: 13000,
  50: 13100,
  51: 13300,
  52: 13500,
  53: 13700,
  54: 13900,
  55: 14100,
  56: 14300,
  57: 14500,
  58: 14700,
  59: 15700,
  60: 21600,
  61: 21900,
  62: 22300,
  63: 23000,
  64: 23800,
  65: 24700,
  66: 26100,
  67: 27500,
  68: 29400,
  69: 29400,
  70: 32400,
  71: 32800,
  72: 33500,
  73: 34500,
  74: 35600,
  75: 37200,
  76: 39100,
  77: 41300,
  78: 44100,
  79: 47300,
  80: 0
};

export interface CalculatorState {
  currentLevel: number;
  currentExp: number;
  targetLevel: number;
  dailyRefills: number;      // Asterite refills (1 refill = 60 Waveplates = 600 XP)
  crystalSolvents: number;   // Item Crystal Solvent yang dimiliki (1 Solvent = 60 Waveplates = 600 XP)
}

export interface CalculationResult {
  totalExpNeeded: number;
  expFromSolvents: number;
  remainingExpToFarm: number;
  daysRequired: number;
  estimatedDate: Date;
}

const DAILY_WAVEPLATE_EXP = 240 * 10; // 240 Waveplates per day, 1 waveplate = 10 XP
const DAILY_QUEST_EXP = 2000;         // Guidebook Activity (Dailies)
const EXP_PER_REFILL = 60 * 10;       // 60 Waveplates per Refill
const EXP_PER_SOLVENT = 60 * 10;      // 60 Waveplates per Solvent

export function calculateUnionLeveling(state: CalculatorState): CalculationResult {
  let expNeeded = 0;

  for (let lvl = state.currentLevel; lvl < state.targetLevel; lvl++) {
    expNeeded += UNION_XP_TABLE[lvl] || 0; 
  }
  
  expNeeded -= state.currentExp;
  if (expNeeded < 0) expNeeded = 0;

  const expFromSolvents = state.crystalSolvents * EXP_PER_SOLVENT;
  
  let remainingExpToFarm = expNeeded - expFromSolvents;
  if (remainingExpToFarm < 0) remainingExpToFarm = 0;

  const dailyExpGenerated = DAILY_WAVEPLATE_EXP + DAILY_QUEST_EXP + (state.dailyRefills * EXP_PER_REFILL);

  const daysRequired = Math.ceil(remainingExpToFarm / dailyExpGenerated);
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + daysRequired);

  return {
    totalExpNeeded: expNeeded,
    expFromSolvents,
    remainingExpToFarm,
    daysRequired,
    estimatedDate
  };
}

/*
with open("/mnt/data/wuwa_calculator.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Created ul_calc.ts")*/