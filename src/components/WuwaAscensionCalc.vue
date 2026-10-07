<template>
  <Card class="tool">
    <div class="tool__header">
      <h2 class="tool__title">Resonator ascension and Forte calculator</h2>
      <p class="tool__desc">Materials needed to level a Resonator and their skills.</p>
    </div>

    <div class="tool__body tool__split">
      <div class="tool__inputs">
        <fieldset class="group">
          <legend class="subheading">Level</legend>
          <div class="form-grid">
            <div class="field">
              <label for="asc-current-level">Current</label>
              <select id="asc-current-level" class="select tabular" v-model.number="state.currentLevel">
                <option v-for="opt in levelOptions" :key="`c_${opt}`" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div class="field">
              <label for="asc-target-level">Target</label>
              <select id="asc-target-level" class="select tabular" v-model.number="state.targetLevel">
                <option v-for="opt in levelOptions" :key="`t_${opt}`" :value="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset class="group">
          <legend class="subheading">Forte levels</legend>
          <div class="forte-table">
            <div class="forte-row forte-row--head" aria-hidden="true">
              <span></span><span>Current</span><span>Target</span>
            </div>
            <div class="forte-row" v-for="(forte, key) in forteDefs" :key="key">
              <span class="forte-name">{{ forte.label }}</span>
              <select class="select tabular" v-model.number="state[key].current" :aria-label="`${forte.label} current level`">
                <option v-for="opt in forteOptions" :key="`fc_${opt}`" :value="opt">Lv. {{ opt }}</option>
              </select>
              <select class="select tabular" v-model.number="state[key].target" :aria-label="`${forte.label} target level`">
                <option v-for="opt in forteOptions" :key="`ft_${opt}`" :value="opt">Lv. {{ opt }}</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset class="group">
          <legend class="subheading">Bonus stats and inherent skills</legend>
          <div class="form-grid">
            <div class="field">
              <label for="asc-sb1">Stat bonus 1 nodes</label>
              <select id="asc-sb1" class="select tabular" v-model.number="state.statBonus1Nodes">
                <option v-for="n in 5" :key="`sb1_${n-1}`" :value="n-1">{{ n-1 }} of 4</option>
              </select>
            </div>
            <div class="field">
              <label for="asc-sb2">Stat bonus 2 nodes</label>
              <select id="asc-sb2" class="select tabular" v-model.number="state.statBonus2Nodes">
                <option v-for="n in 5" :key="`sb2_${n-1}`" :value="n-1">{{ n-1 }} of 4</option>
              </select>
            </div>
          </div>
          <div class="checks">
            <label class="checkbox">
              <input type="checkbox" v-model="state.inherentSkill1" />
              Unlock inherent skill 1
            </label>
            <label class="checkbox">
              <input type="checkbox" v-model="state.inherentSkill2" />
              Unlock inherent skill 2
            </label>
          </div>
        </fieldset>
      </div>

      <div class="result" aria-live="polite">
        <p class="result__label">Shell Credits</p>
        <p class="result__value tabular">{{ result.shellCredits.toLocaleString() }}</p>
        <p class="result__sub tabular">{{ result.characterXp.toLocaleString() }} Resonator XP</p>

        <dl class="result__list tabular" v-if="hasPotions">
          <div v-if="result.potions.premium > 0"><dt>Premium Resonance Potion</dt><dd>{{ result.potions.premium }}</dd></div>
          <div v-if="result.potions.advanced > 0"><dt>Advanced Resonance Potion</dt><dd>{{ result.potions.advanced }}</dd></div>
          <div v-if="result.potions.medium > 0"><dt>Medium Resonance Potion</dt><dd>{{ result.potions.medium }}</dd></div>
          <div v-if="result.potions.basic > 0"><dt>Basic Resonance Potion</dt><dd>{{ result.potions.basic }}</dd></div>
        </dl>

        <h3 class="result__group">Ascension</h3>
        <dl class="result__list result__list--tight tabular">
          <div><dt>Regional specialty</dt><dd>{{ result.specialty }}</dd></div>
          <div><dt>Boss drop</dt><dd>{{ result.bossDrop }}</dd></div>
        </dl>

        <h3 class="result__group">Common drops (level and Forte)</h3>
        <dl class="result__list result__list--tight tabular">
          <div><dt>LF, tier 1</dt><dd>{{ result.commonDrops.t1 }}</dd></div>
          <div><dt>MF, tier 2</dt><dd>{{ result.commonDrops.t2 }}</dd></div>
          <div><dt>HF, tier 3</dt><dd>{{ result.commonDrops.t3 }}</dd></div>
          <div><dt>FF, tier 4</dt><dd>{{ result.commonDrops.t4 }}</dd></div>
        </dl>

        <h3 class="result__group">Forte materials</h3>
        <dl class="result__list result__list--tight tabular">
          <div><dt>Skill material, tier 1</dt><dd>{{ result.forteDrops.t1 }}</dd></div>
          <div><dt>Skill material, tier 2</dt><dd>{{ result.forteDrops.t2 }}</dd></div>
          <div><dt>Skill material, tier 3</dt><dd>{{ result.forteDrops.t3 }}</dd></div>
          <div><dt>Skill material, tier 4</dt><dd>{{ result.forteDrops.t4 }}</dd></div>
          <div><dt>Weekly boss drop</dt><dd>{{ result.weeklyBossDrop }}</dd></div>
        </dl>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePersisted } from '../composables/usePersisted';
import { 
  WUWA_LEVEL_OPTIONS, 
  WUWA_FORTE_OPTIONS, 
  calculateAscensionMaterials, 
  type AscensionCalcState 
} from '../utils/wuwa_ascension_calc';
import Card from './ui/Card.vue';

const levelOptions = WUWA_LEVEL_OPTIONS;
const forteOptions = WUWA_FORTE_OPTIONS;

const forteDefs = {
  basicAttack: { label: 'Basic Attack' },
  resonanceSkill: { label: 'Resonance Skill' },
  resonanceLiberation: { label: 'Resonance Liberation' },
  forteCircuit: { label: 'Forte Circuit' },
  introSkill: { label: 'Intro Skill' }
} as const;

const state = usePersisted<AscensionCalcState>('wuwaAscensionCalc', {
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
  const safeState = JSON.parse(JSON.stringify(state)) as typeof state;
  
  if (safeState.targetLevel < safeState.currentLevel) safeState.targetLevel = safeState.currentLevel;
  for (const key of Object.keys(forteDefs)) {
    const k = key as keyof typeof forteDefs;
    if (safeState[k].target < safeState[k].current) safeState[k].target = safeState[k].current;
  }
  
  return calculateAscensionMaterials(safeState);
});

const hasPotions = computed(() => {
  const p = result.value.potions;
  return p.premium + p.advanced + p.medium + p.basic > 0;
});
</script>

<style scoped src="./tools.css"></style>
<style scoped>
.group {
  border: none;
  min-width: 0;
}

.forte-table {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.forte-row {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) 1fr 1fr;
  align-items: center;
  gap: 8px;
}

.forte-row--head {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-fg);
}

.forte-name {
  font-size: 14px;
  font-weight: 500;
}

.checks {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.result__group {
  margin-top: 16px;
  font-size: 13px;
  font-weight: 700;
}

.result__list--tight {
  margin-top: 6px;
  padding-top: 0;
  border-top: none;
}
</style>
