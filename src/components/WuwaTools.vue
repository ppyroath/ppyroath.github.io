<template>
  <div class="tools">
    <Card class="tool">
      <div class="tool__header">
        <h2 class="tool__title">Union Level calculator</h2>
        <p class="tool__desc">How many days until you reach a target Union Level.</p>
      </div>

      <div class="tool__body tool__split">
        <div class="tool__inputs">
          <div class="form-grid">
            <div class="field">
              <label for="ul-current-level">Current level</label>
              <input id="ul-current-level" class="input tabular" type="number" v-model.number="state.currentLevel" min="1" max="79" />
            </div>
            <div class="field">
              <label for="ul-current-exp">Current EXP</label>
              <input id="ul-current-exp" class="input tabular" type="number" v-model.number="state.currentExp" min="0" />
            </div>
            <div class="field">
              <label for="ul-target-level">Target level</label>
              <input id="ul-target-level" class="input tabular" type="number" v-model.number="state.targetLevel" :min="state.currentLevel + 1" max="80" />
            </div>
            <div class="field">
              <label for="ul-refills">Daily Asterite refills</label>
              <input id="ul-refills" class="input tabular" type="number" v-model.number="state.dailyRefills" min="0" max="6" />
            </div>
            <div class="field">
              <label for="ul-solvents">Crystal Solvents</label>
              <input id="ul-solvents" class="input tabular" type="number" v-model.number="state.crystalSolvents" min="0" />
            </div>
          </div>

          <ul class="note">
            <li>1 Asterite refill = 60 Waveplates = 600 Union EXP</li>
            <li>1 Crystal Solvent = 60 Waveplates = 600 Union EXP</li>
            <li>Daily quests give a fixed 2,000 EXP</li>
          </ul>
        </div>

        <div v-if="result" class="result" aria-live="polite">
          <p class="result__label">Days required</p>
          <p class="result__value tabular">{{ result.daysRequired }}</p>
          <p class="result__sub">Around {{ result.estimatedDate.toLocaleDateString() }}</p>

          <dl class="result__list tabular">
            <div><dt>Total EXP needed</dt><dd>{{ result.totalExpNeeded.toLocaleString() }}</dd></div>
            <div><dt>From Crystal Solvents</dt><dd>{{ result.expFromSolvents.toLocaleString() }}</dd></div>
            <div><dt>Left to farm</dt><dd>{{ result.remainingExpToFarm.toLocaleString() }}</dd></div>
          </dl>
        </div>
      </div>
    </Card>

    <WuwaAscensionCalc />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { usePersisted } from '../composables/usePersisted';
import { calculateUnionLeveling } from '../utils/ul_calculator';
import type { CalculatorState, CalculationResult } from '../utils/ul_calculator';
import WuwaAscensionCalc from './WuwaAscensionCalc.vue';
import Card from './ui/Card.vue';

const state = usePersisted<CalculatorState>('wuwaUnionLevelCalc', {
  currentLevel: 10,
  currentExp: 0,
  targetLevel: 20,
  dailyRefills: 0,
  crystalSolvents: 0
});

const result = ref<CalculationResult | null>(null);

const calculate = () => {
  const safeState = { ...state };
  
  if (!safeState.currentLevel || safeState.currentLevel < 1) safeState.currentLevel = 1;
  if (!safeState.targetLevel || safeState.targetLevel > 80) safeState.targetLevel = 80;
  
  result.value = calculateUnionLeveling(safeState);
};

// Real-time calculation
watch(state, () => {
  calculate();
}, { deep: true });

onMounted(() => {
  calculate();
});
</script>

<style scoped src="./tools.css"></style>
