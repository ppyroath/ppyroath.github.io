<template>
  <div class="tool-card asc-card">
    
    <div class="asc-layout">
      <!-- Left Column: Inputs -->
      <div class="asc-inputs">
        <h2 class="tool-title">Resonator Ascension & Forte Calculator</h2>
        <p class="tool-desc mb-4">Calculate materials needed to level up characters and their skills.</p>
        
        <!-- Level Goal -->
        <div class="section-box">
          <h3 class="section-title">LEVEL GOAL</h3>
          <div class="form-grid">
            <div class="input-group">
              <label>Current Level</label>
              <select v-model.number="state.currentLevel">
                <option v-for="opt in levelOptions" :key="`c_${opt}`" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>Target Level</label>
              <select v-model.number="state.targetLevel">
                <option v-for="opt in levelOptions" :key="`t_${opt}`" :value="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Forte Levels -->
        <div class="section-box">
          <h3 class="section-title">FORTE (TALENT) LEVELS</h3>
          <p class="info-text mb-4">5 skills: Basic Attack, Resonance Skill, Resonance Liberation, Forte Circuit, Intro Skill. Each goes 1 → 10.</p>
          
          <div class="forte-grid" v-for="(forte, key) in forteDefs" :key="key">
            <div class="forte-label">{{ forte.label }}</div>
            <div class="form-grid">
              <div class="input-group">
                <label>current</label>
                <select v-model.number="state[key].current">
                  <option v-for="opt in forteOptions" :key="`fc_${opt}`" :value="opt">Lv. {{ opt }}</option>
                </select>
              </div>
              <div class="input-group">
                <label>target</label>
                <select v-model.number="state[key].target">
                  <option v-for="opt in forteOptions" :key="`ft_${opt}`" :value="opt">Lv. {{ opt }}</option>
                </select>
              </div>
            </div>
          </div>

          <h3 class="section-title mt-4 mb-2">BONUS STATS & INHERENT SKILLS</h3>
          <div class="form-grid">
            <div class="input-group">
              <label>Stat Bonus 1 Nodes (Max 4)</label>
              <select v-model.number="state.statBonus1Nodes">
                <option v-for="n in 5" :key="`sb1_${n-1}`" :value="n-1">{{ n-1 }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>Stat Bonus 2 Nodes (Max 4)</label>
              <select v-model.number="state.statBonus2Nodes">
                <option v-for="n in 5" :key="`sb2_${n-1}`" :value="n-1">{{ n-1 }}</option>
              </select>
            </div>
          </div>
          
          <div class="checkbox-group mt-3">
            <label class="checkbox-label">
              <input type="checkbox" v-model="state.inherentSkill1" />
              Unlock Inherent Skill 1
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="state.inherentSkill2" />
              Unlock Inherent Skill 2
            </label>
          </div>
        </div>
      </div>

      <!-- Right Column: Output -->
      <div class="asc-outputs">
        <h3 class="section-title mb-4">TOTAL MATERIALS NEEDED</h3>
        
        <!-- Currency & Potions -->
        <div class="result-group">
          <div class="result-group-title">CURRENCY & POTIONS</div>
          <div class="result-item">
            <span class="res-label">Shell Credits</span>
            <span class="res-val highlight">{{ result.shellCredits.toLocaleString() }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">Resonator XP</span>
            <span class="res-val highlight">{{ result.characterXp.toLocaleString() }}</span>
          </div>
          <div class="result-item" v-if="result.potions.premium > 0">
            <span class="res-label">Premium Resonance Potion</span>
            <span class="res-val">{{ result.potions.premium }}</span>
          </div>
          <div class="result-item" v-if="result.potions.advanced > 0">
            <span class="res-label">Advanced Resonance Potion</span>
            <span class="res-val">{{ result.potions.advanced }}</span>
          </div>
          <div class="result-item" v-if="result.potions.medium > 0">
            <span class="res-label">Medium Resonance Potion</span>
            <span class="res-val">{{ result.potions.medium }}</span>
          </div>
          <div class="result-item" v-if="result.potions.basic > 0">
            <span class="res-label">Basic Resonance Potion</span>
            <span class="res-val">{{ result.potions.basic }}</span>
          </div>
        </div>

        <!-- Ascension -->
        <div class="result-group">
          <div class="result-group-title">ASCENSION</div>
          <div class="result-item">
            <span class="res-label">Specialty (regional)</span>
            <span class="res-val">{{ result.specialty }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">Boss Drop</span>
            <span class="res-val">{{ result.bossDrop }}</span>
          </div>
        </div>

        <!-- Common Drops -->
        <div class="result-group">
          <div class="result-group-title">COMMON DROPS (LEVEL + FORTE)</div>
          <div class="result-item">
            <span class="res-label">LF (Tier 1)</span>
            <span class="res-val">{{ result.commonDrops.t1 }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">MF (Tier 2)</span>
            <span class="res-val">{{ result.commonDrops.t2 }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">HF (Tier 3)</span>
            <span class="res-val">{{ result.commonDrops.t3 }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">FF (Tier 4)</span>
            <span class="res-val">{{ result.commonDrops.t4 }}</span>
          </div>
        </div>

        <!-- Forte Skill Materials -->
        <div class="result-group">
          <div class="result-group-title">FORTE SKILL MATERIALS</div>
          <div class="result-item">
            <span class="res-label">Skill Material (T1)</span>
            <span class="res-val">{{ result.forteDrops.t1 }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">Skill Material (T2)</span>
            <span class="res-val">{{ result.forteDrops.t2 }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">Skill Material (T3)</span>
            <span class="res-val">{{ result.forteDrops.t3 }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">Skill Material (T4)</span>
            <span class="res-val">{{ result.forteDrops.t4 }}</span>
          </div>
          <div class="result-item">
            <span class="res-label">Weekly Boss Drop</span>
            <span class="res-val">{{ result.weeklyBossDrop }}</span>
          </div>
        </div>

        <!-- Summary -->
        <div class="summary-box">
          Total: {{ result.shellCredits.toLocaleString() }} Shell Credits, 
          {{ result.characterXp.toLocaleString() }} Resonator XP.
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { 
  WUWA_LEVEL_OPTIONS, 
  WUWA_FORTE_OPTIONS, 
  calculateAscensionMaterials, 
  type AscensionCalcState 
} from '../utils/wuwa_ascension_calc';

const levelOptions = WUWA_LEVEL_OPTIONS;
const forteOptions = WUWA_FORTE_OPTIONS;

const forteDefs = {
  basicAttack: { label: 'Basic Attack' },
  resonanceSkill: { label: 'Resonance Skill' },
  resonanceLiberation: { label: 'Resonance Liberation' },
  forteCircuit: { label: 'Forte Circuit' },
  introSkill: { label: 'Intro Skill' }
} as const;

const state = reactive<AscensionCalcState>({
  currentLevel: 1,
  targetLevel: 90,
  basicAttack: { current: 1, target: 10 },
  resonanceSkill: { current: 1, target: 10 },
  resonanceLiberation: { current: 1, target: 10 },
  forteCircuit: { current: 1, target: 10 },
  introSkill: { current: 1, target: 10 },
  statBonus1Nodes: 0,
  statBonus2Nodes: 0,
  inherentSkill1: false,
  inherentSkill2: false
});

const result = computed(() => {
  // Fix constraints automatically if user selects invalid options
  if (state.targetLevel < state.currentLevel) state.targetLevel = state.currentLevel;
  for (const key of Object.keys(forteDefs)) {
    const k = key as keyof typeof forteDefs;
    if (state[k].target < state[k].current) state[k].target = state[k].current;
  }
  return calculateAscensionMaterials(state);
});
</script>

<style scoped>
.asc-card {
  padding: 0;
  overflow: hidden;
}

.asc-layout {
  display: flex;
  flex-direction: column;
}

.asc-inputs {
  padding: 20px;
  flex: 1;
}

.asc-outputs {
  background: var(--md-surface-container-high);
  padding: 20px;
  border-top: 1px solid var(--md-outline-variant);
  flex: 0.8;
}

@media (min-width: 768px) {
  .asc-layout {
    flex-direction: row;
  }
  .asc-outputs {
    border-top: none;
    border-left: 1px solid var(--md-outline-variant);
  }
}

.tool-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--md-on-surface);
  margin-bottom: 4px;
}

.tool-desc {
  font-size: 0.85rem;
  color: var(--md-on-surface-variant);
}

.mb-4 {
  margin-bottom: 16px;
}

.section-box {
  background: var(--md-surface-container-high);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--wuwa-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.info-text {
  font-size: 0.75rem;
  color: var(--md-on-surface-variant);
  line-height: 1.4;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--md-on-surface-variant);
}

.input-group select {
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  color: var(--md-on-surface);
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

.input-group select:focus {
  border-color: var(--wuwa-primary);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--md-on-surface);
  cursor: pointer;
}

.checkbox-label input {
  accent-color: var(--wuwa-primary);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 20px;
}

.mb-2 {
  margin-bottom: 8px;
}

.forte-grid {
  margin-bottom: 16px;
}

.forte-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--md-on-surface);
  margin-bottom: 8px;
}

/* Outputs */
.result-group {
  margin-bottom: 16px;
}

.result-group-title {
  font-size: 0.7rem;
  color: var(--md-on-surface-variant);
  margin-bottom: 8px;
  font-weight: 600;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--md-surface-container);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 4px;
  font-size: 0.85rem;
}

.res-label {
  color: var(--md-on-surface);
  font-weight: 600;
}

.res-val {
  color: var(--pgr-primary); /* Uses similar cyan color from PGR for consistency or wuwa primary */
  font-weight: 700;
}

.res-val.highlight {
  color: var(--wuwa-primary);
}

.summary-box {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 12px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--md-on-surface);
  line-height: 1.5;
  margin-top: 24px;
}
</style>
