export const WUWA_ASCENSION_STAGES = [
  { from: 1,  to: 20, shell: 0, specialty: 0, boss: 0, commonTier: 1, commonCount: 0 },
  { from: 20, to: 40, shell: 5000, specialty: 0, boss: 0, commonTier: 1, commonCount: 4 },
  { from: 40, to: 50, shell: 10000, specialty: 4, boss: 3, commonTier: 2, commonCount: 4 },
  { from: 50, to: 60, shell: 15000, specialty: 8, boss: 6, commonTier: 2, commonCount: 8 },
  { from: 60, to: 70, shell: 20000, specialty: 12, boss: 9, commonTier: 3, commonCount: 4 },
  { from: 70, to: 80, shell: 40000, specialty: 16, boss: 12, commonTier: 3, commonCount: 8 },
  { from: 80, to: 90, shell: 80000, specialty: 20, boss: 16, commonTier: 4, commonCount: 4 }
];

const WUWA_LEVEL_XP = [
  0, 0, 400, 400, 500, 600, 700, 900, 1000, 1200, 1300, 1500, 1700, 2000, 2200, 
  2400, 2700, 3000, 3300, 3600, 3900, 4300, 4600, 5000, 5400, 5800, 6300, 6700, 
  7200, 7700, 8200, 8700, 9300, 9800, 10400, 11000, 11700, 12300, 13000, 13700, 
  14400, 15100, 15900, 16700, 17500, 18300, 19200, 20000, 20900, 21900, 22800, 
  23800, 24800, 25800, 26900, 28000, 29100, 30300, 31400, 32600, 33900, 35100, 
  36400, 37700, 39100, 40500, 41900, 43300, 44800, 46300, 47900, 49500, 51100, 
  52800, 54500, 56200, 58000, 59800, 61600, 63500, 65400, 67400, 69400, 71400, 
  73500, 75600, 77800, 80000, 82300, 84600, 86900
];

export const WUWA_LEVEL_XP_CUMULATIVE: Record<number, number> = {};
let cumXp = 0;
for (let i = 1; i <= 90; i++) {
  cumXp += WUWA_LEVEL_XP[i] || 0;
  WUWA_LEVEL_XP_CUMULATIVE[i] = cumXp;
}

export const WUWA_FORTE_UPGRADES: Record<number, { shell: number; skillTier: number; skillCount: number; commonTier: number; commonCount: number; weekly: number }> = {
  2:  { shell: 1500,   skillTier: 1, skillCount: 2, commonTier: 1, commonCount: 2, weekly: 0 },
  3:  { shell: 2000,   skillTier: 1, skillCount: 3, commonTier: 1, commonCount: 3, weekly: 0 },
  4:  { shell: 4500,   skillTier: 2, skillCount: 2, commonTier: 2, commonCount: 2, weekly: 0 },
  5:  { shell: 6000,   skillTier: 2, skillCount: 3, commonTier: 2, commonCount: 3, weekly: 0 },
  6:  { shell: 16000,  skillTier: 3, skillCount: 3, commonTier: 3, commonCount: 3, weekly: 0 },
  7:  { shell: 30000,  skillTier: 3, skillCount: 5, commonTier: 3, commonCount: 2, weekly: 1 },
  8:  { shell: 50000,  skillTier: 4, skillCount: 2, commonTier: 4, commonCount: 2, weekly: 1 },
  9:  { shell: 70000,  skillTier: 4, skillCount: 3, commonTier: 4, commonCount: 3, weekly: 1 },
  10: { shell: 100000, skillTier: 4, skillCount: 6, commonTier: 4, commonCount: 4, weekly: 1 }
};

export const WUWA_STAT_BONUS_1 = { shell: 50000, skillTier: 3, skillCount: 3, commonTier: 3, commonCount: 3, weekly: 0 };
export const WUWA_STAT_BONUS_2 = { shell: 100000, skillTier: 4, skillCount: 3, commonTier: 4, commonCount: 3, weekly: 1 };
export const WUWA_INHERENT_1 = { shell: 10000, skillTier: 2, skillCount: 3, commonTier: 2, commonCount: 3, weekly: 1 };
export const WUWA_INHERENT_2 = { shell: 20000, skillTier: 3, skillCount: 3, commonTier: 3, commonCount: 3, weekly: 1 };

export const WUWA_LEVEL_OPTIONS = [1, 20, 40, 50, 60, 70, 80, 90];
export const WUWA_FORTE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export interface ForteState {
  current: number;
  target: number;
}

export interface AscensionCalcState {
  currentLevel: number;
  targetLevel: number;
  basicAttack: ForteState;
  resonanceSkill: ForteState;
  resonanceLiberation: ForteState;
  forteCircuit: ForteState;
  introSkill: ForteState;
  
  // New nodes
  statBonus1Nodes: number; // 0 to 4
  statBonus2Nodes: number; // 0 to 4
  inherentSkill1: boolean;
  inherentSkill2: boolean;
}

export interface AscensionCalcResult {
  shellCredits: number;
  characterXp: number;
  potions: {
    premium: number;  // 20k
    advanced: number; // 8k
    medium: number;   // 3k
    basic: number;    // 1k
  };
  specialty: number;
  bossDrop: number;
  commonDrops: { t1: number; t2: number; t3: number; t4: number; };
  forteDrops: { t1: number; t2: number; t3: number; t4: number; };
  weeklyBossDrop: number;
}

export function calculateAscensionMaterials(state: AscensionCalcState): AscensionCalcResult {
  const result: AscensionCalcResult = {
    shellCredits: 0,
    characterXp: 0,
    potions: { premium: 0, advanced: 0, medium: 0, basic: 0 },
    specialty: 0,
    bossDrop: 0,
    commonDrops: { t1: 0, t2: 0, t3: 0, t4: 0 },
    forteDrops: { t1: 0, t2: 0, t3: 0, t4: 0 },
    weeklyBossDrop: 0
  };

  const addCommon = (tier: number, count: number) => {
    if (tier === 1) result.commonDrops.t1 += count;
    if (tier === 2) result.commonDrops.t2 += count;
    if (tier === 3) result.commonDrops.t3 += count;
    if (tier === 4) result.commonDrops.t4 += count;
  };

  const addForte = (tier: number, count: number) => {
    if (tier === 1) result.forteDrops.t1 += count;
    if (tier === 2) result.forteDrops.t2 += count;
    if (tier === 3) result.forteDrops.t3 += count;
    if (tier === 4) result.forteDrops.t4 += count;
  };

  // 1. Calculate Level & Ascension Costs
  if (state.targetLevel > state.currentLevel) {
    // XP & Potions
    const startXp = WUWA_LEVEL_XP_CUMULATIVE[state.currentLevel] || 0;
    const targetXp = WUWA_LEVEL_XP_CUMULATIVE[state.targetLevel] || 0;
    const expNeeded = Math.max(0, targetXp - startXp);
    result.characterXp = expNeeded;

    if (expNeeded > 0) {
      let expTotal = Math.ceil(expNeeded / 1000) * 1000;
      result.shellCredits += (expTotal / 1000) * 350; // 350 shell per 1k XP

      result.potions.premium = Math.floor(expTotal / 20000);
      expTotal %= 20000;
      result.potions.advanced = Math.floor(expTotal / 8000);
      expTotal %= 8000;
      result.potions.medium = Math.floor(expTotal / 3000);
      expTotal %= 3000;
      result.potions.basic = Math.floor(expTotal / 1000);
    }

    // Ascensions
    for (const stage of WUWA_ASCENSION_STAGES) {
      if (state.currentLevel < stage.to && state.targetLevel >= stage.to) {
        result.shellCredits += stage.shell;
        result.specialty += stage.specialty;
        result.bossDrop += stage.boss;
        addCommon(stage.commonTier, stage.commonCount);
      }
    }
  }

  // 2. Calculate Forte Costs
  const fortes = [
    state.basicAttack,
    state.resonanceSkill,
    state.resonanceLiberation,
    state.forteCircuit,
    state.introSkill,
  ];

  for (const forte of fortes) {
    if (forte.target > forte.current) {
      for (let lvl = forte.current + 1; lvl <= forte.target; lvl++) {
        const upgrade = WUWA_FORTE_UPGRADES[lvl];
        if (upgrade) {
          result.shellCredits += upgrade.shell;
          addCommon(upgrade.commonTier, upgrade.commonCount);
          addForte(upgrade.skillTier, upgrade.skillCount);
          result.weeklyBossDrop += upgrade.weekly;
        }
      }
    }
  }

  // 3. Bonus Stats
  const applyBonus = (bonusNode: any, count: number) => {
    result.shellCredits += bonusNode.shell * count;
    addCommon(bonusNode.commonTier, bonusNode.commonCount * count);
    addForte(bonusNode.skillTier, bonusNode.skillCount * count);
    result.weeklyBossDrop += bonusNode.weekly * count;
  };

  if (state.statBonus1Nodes > 0) applyBonus(WUWA_STAT_BONUS_1, state.statBonus1Nodes);
  if (state.statBonus2Nodes > 0) applyBonus(WUWA_STAT_BONUS_2, state.statBonus2Nodes);
  if (state.inherentSkill1) applyBonus(WUWA_INHERENT_1, 1);
  if (state.inherentSkill2) applyBonus(WUWA_INHERENT_2, 1);

  return result;
}
