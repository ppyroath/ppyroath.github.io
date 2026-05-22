<template>
  <div class="wuwa-tools">
    <div class="tool-card">
      <h2 class="tool-title">Union Level Calculator</h2>
      <p class="tool-desc">Calculate how many days it takes to reach your target Union Level.</p>

      <!-- Info Box -->
      <div class="info-box">
        <h3 class="info-title">💡 Additional Info</h3>
        <p class="info-text">
          - <b>1 Asterite Refill</b> = 60 Waveplates = 600 Union EXP.<br>
          - <b>1 Crystal Solvent</b> = 60 Waveplates = 600 Union EXP.<br>
          - Daily Quests yield a fixed 2000 EXP.
        </p>
      </div>

      <div class="form-grid">
        <div class="input-group">
          <label>Current Level</label>
          <input type="number" v-model.number="state.currentLevel" min="1" max="79" />
        </div>
        <div class="input-group">
          <label>Current EXP</label>
          <input type="number" v-model.number="state.currentExp" min="0" />
        </div>
        <div class="input-group">
          <label>Target Level</label>
          <input type="number" v-model.number="state.targetLevel" :min="state.currentLevel + 1" max="80" />
        </div>
        <div class="input-group">
          <label>Daily Refills (Asterite)</label>
          <input type="number" v-model.number="state.dailyRefills" min="0" max="6" />
        </div>
        <div class="input-group">
          <label>Crystal Solvents</label>
          <input type="number" v-model.number="state.crystalSolvents" min="0" />
        </div>
      </div>

      <div v-if="result" class="result-box">
        <div class="result-item">
          <span class="result-label">Total EXP Needed:</span>
          <span class="result-value">{{ result.totalExpNeeded.toLocaleString() }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">EXP from Solvents:</span>
          <span class="result-value">{{ result.expFromSolvents.toLocaleString() }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Remaining EXP to Farm:</span>
          <span class="result-value">{{ result.remainingExpToFarm.toLocaleString() }}</span>
        </div>
        <div class="result-item highlight">
          <span class="result-label">Days Required:</span>
          <span class="result-value">{{ result.daysRequired }} Days</span>
        </div>
        <div class="result-item">
          <span class="result-label">Estimated Date:</span>
          <span class="result-value">{{ result.estimatedDate.toLocaleDateString() }}</span>
        </div>
      </div>
    </div>

    <!-- Ascension Calculator -->
    <WuwaAscensionCalc />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { calculateUnionLeveling } from '../utils/ul_calculator';
import type { CalculatorState, CalculationResult } from '../utils/ul_calculator';
import WuwaAscensionCalc from './WuwaAscensionCalc.vue';

const state = reactive<CalculatorState>({
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

<style scoped>
.wuwa-tools {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
}

.tool-card {
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-lg);
  padding: 16px;
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
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--md-on-surface-variant);
}

.input-group input {
  background: var(--md-surface-container-high);
  border: 1px solid var(--md-outline);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  color: var(--md-on-surface);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-group input:focus {
  border-color: var(--wuwa-primary);
}

.info-box {
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  padding: 12px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
}

.info-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 4px;
}

.info-text {
  font-size: 0.75rem;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.info-text b {
  color: var(--md-on-surface);
}

.result-box {
  margin-top: 20px;
  padding: 16px;
  background: var(--md-surface-container-high);
  border-radius: var(--radius-md);
  border: 1px solid var(--md-outline-variant);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--md-on-surface-variant);
}

.result-item .result-value {
  font-weight: 600;
  color: var(--md-on-surface);
}

.result-item.highlight {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--md-outline-variant);
}

.result-item.highlight .result-label {
  font-weight: 700;
  color: var(--md-on-surface);
}

.result-item.highlight .result-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--wuwa-primary);
}
</style>
