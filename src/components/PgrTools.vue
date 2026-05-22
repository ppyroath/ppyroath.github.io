<template>
  <div class="pgr-tools">
    
    <!-- External Links -->
    <div class="tool-card tldr-card">
      <div class="tldr-content">
        <h2 class="tool-title">PGR TL;DR Indonesia</h2>
        <p class="tool-desc">A comprehensive guide and TL;DR for Punishing: Gray Raven in Indonesian.</p>
      </div>
      <a href="https://pgrtldrid.gitbook.io/main" target="_blank" rel="noopener noreferrer" class="link-btn">
        Visit Web
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="external-icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>
    </div>

    <!-- S-Rank Shard Simulator -->
    <div class="tool-card">
      <h2 class="tool-title">S-Rank Shard Simulator</h2>
      <p class="tool-desc mb-4">Simulate your S-Rank Construct's evolution progress towards SSS+.</p>
      
      <div class="evo-grid">
        
        <!-- Left: Inputs -->
        <div class="evo-inputs space-y-4">
          <div class="input-group">
            <label>
              Phantom Pain Cage (PPC) 
              <span class="max-note">(Max 30)</span>
            </label>
            <input type="number" v-model.number="ppc" min="0" max="30" />
            <div class="cost-info">
              <span>Cost: <span class="cost-val ppc-val">{{ ppcCost.toLocaleString() }}</span> Scars</span>
            </div>
          </div>

          <div class="input-group">
            <label>Voucher Shop (Shards)</label>
            <input type="number" v-model.number="voucher" min="0" />
            <div class="cost-info flex-col">
              <div class="flex-between">
                <span>Cost: <span class="cost-val voucher-val">{{ voucherCost.toLocaleString() }}</span> Vouchers</span>
                <span>(804/ea)</span>
              </div>
              <div v-if="voucher > 0" class="time-est">
                Est. time: <span>{{ voucherMonths }}</span> month(s)
              </div>
            </div>
          </div>

          <div class="input-group">
            <label>
              Gacha Duplicates 
              <span class="max-note gacha-note">(1 Dupe = 30 Shards)</span>
            </label>
            <input type="number" v-model.number="gacha" min="0" />
            <div class="cost-info flex-between">
              <span>Cost: <span class="cost-val gacha-val">{{ gachaCost.toLocaleString() }}</span> BC</span>
              <span>(60 Pity = 15k BC)</span>
            </div>
          </div>
        </div>

        <!-- Right: Progress -->
        <div class="evo-status">
          <div class="status-card">
            <p class="status-label">Current Status</p>
            <h2 class="rank-display">{{ currentRankName }}</h2>
            <p class="total-shards">Total Shards: <span>{{ totalShards }}</span> / 300</p>
          </div>

          <div class="progress-section">
            <div class="progress-labels">
              <span>S</span>
              <span>SS (30)</span>
              <span>SSS (120)</span>
              <span>SSS+ (300)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="marker marker-1"></div>
              <div class="marker marker-2"></div>
              <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </div>
          
          <div class="nodes-container">
            <div class="nodes-header">
              <h3>Node Progression</h3>
            </div>
            <div class="nodes-list">
              <div 
                v-for="node in nodesList" 
                :key="node.req" 
                class="node-item"
                :class="{ 
                  'is-reached': totalShards >= node.req, 
                  'is-target': node.isTarget 
                }"
              >
                <div class="node-left">
                  <div class="node-icon">✓</div>
                  <div class="node-name-wrapper">
                    <span class="node-name">{{ node.name }}</span>
                    <span v-if="node.isTarget" class="target-badge">Target</span>
                  </div>
                </div>
                <div class="node-right">
                  <div class="node-req">{{ node.req }} <span>Total Shards</span></div>
                  <div v-if="node.step > 0" class="node-step">+{{ node.step }} Shards to unlock</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// State
const ppc = ref(0);
const voucher = ref(0);
const gacha = ref(0);

// Watchers for bounds
watch(ppc, (val) => {
  if (val > 30) ppc.value = 30;
  if (val < 0 || isNaN(val)) ppc.value = 0;
});
watch(voucher, (val) => {
  if (val < 0 || isNaN(val)) voucher.value = 0;
});
watch(gacha, (val) => {
  if (val < 0 || isNaN(val)) gacha.value = 0;
});

// Computed Costs
const ppcCost = computed(() => {
  let p = ppc.value || 0;
  if (p <= 10) return p * 10;
  return (10 * 10) + ((p - 10) * 20);
});

const voucherCost = computed(() => (voucher.value || 0) * 804);
const voucherMonths = computed(() => Math.ceil((voucher.value || 0) / 20));
const gachaCost = computed(() => (gacha.value || 0) * 15000);

// Total Shards
const totalShards = computed(() => {
  return (ppc.value || 0) + (voucher.value || 0) + ((gacha.value || 0) * 30);
});

const visualTotal = computed(() => Math.min(totalShards.value, 300));
const progressPercentage = computed(() => (visualTotal.value / 300) * 100);

// Rank Name
const currentRankName = computed(() => {
  const t = totalShards.value;
  if (t >= 300) return "SSS+";
  if (t >= 120) {
    let n = Math.floor((t - 120) / 18);
    return n === 0 ? "SSS" : `SSS${n}`;
  }
  if (t >= 30) {
    let n = Math.floor((t - 30) / 9);
    return n === 0 ? "SS" : `SS${n}`;
  }
  let n = Math.floor(t / 3);
  return n === 0 ? "S0" : `S${n}`;
});

// Node List Generation
const TARGET_NODES = ['S5', 'SS3', 'SSS3', 'SSS6'];
const rankPhases = [
  { rank: 'S', baseShards: 0, shardsPerNode: 3, nextRankShards: 30 },
  { rank: 'SS', baseShards: 30, shardsPerNode: 9, nextRankShards: 120 },
  { rank: 'SSS', baseShards: 120, shardsPerNode: 18, nextRankShards: 300 }
];

const nodesList = computed(() => {
  const list = [];
  list.push({ name: 'S0', req: 0, step: 0, isTarget: false });

  rankPhases.forEach(phase => {
    for (let i = 1; i <= 10; i++) {
      let nodeName = `${phase.rank}${i}`;
      if (i === 10) {
        if (phase.rank === 'S') nodeName = 'SS0';
        else if (phase.rank === 'SS') nodeName = 'SSS0';
        else if (phase.rank === 'SSS') nodeName = 'SSS+';
      }

      let req = phase.baseShards + (i * phase.shardsPerNode);
      let isTarget = TARGET_NODES.includes(`${phase.rank}${i}`);
      
      let displayName = nodeName;
      if (displayName === 'SS0') displayName = 'SS (Rank Up)';
      if (displayName === 'SSS0') displayName = 'SSS (Rank Up)';

      list.push({ name: displayName, req, step: phase.shardsPerNode, isTarget });
    }
  });
  return list;
});

</script>

<style scoped>
.pgr-tools {
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

.tldr-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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

.link-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
}

.link-btn:hover {
  background: var(--state-hover);
}

.evo-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.space-y-4 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--md-surface-container-high);
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--md-outline-variant);
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--md-on-surface);
}

.max-note {
  font-size: 0.7rem;
  color: var(--md-primary);
  margin-left: 4px;
}
.gacha-note {
  color: #fb923c;
}

.input-group input {
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline);
  border-radius: var(--radius-sm);
  padding: 8px;
  color: var(--md-on-surface);
  font-size: 0.95rem;
  outline: none;
}
.input-group input:focus {
  border-color: var(--pgr-primary);
}

.cost-info {
  font-size: 0.75rem;
  color: var(--md-on-surface-variant);
  margin-top: 4px;
}
.flex-col { display: flex; flex-direction: column; gap: 4px; }
.flex-between { display: flex; justify-content: space-between; }

.cost-val { font-weight: 700; }
.ppc-val { color: var(--md-primary); }
.voucher-val { color: var(--md-primary); }
.gacha-val { color: #fb923c; }

.time-est {
  text-align: right;
  color: #c084fc;
  font-weight: 600;
}

/* Status */
.status-card {
  background: var(--md-surface-container-high);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}
.status-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--pgr-primary), #3b82f6);
}

.status-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--md-on-surface-variant);
  margin-bottom: 4px;
}
.rank-display {
  font-size: 3rem;
  font-weight: 800;
  color: var(--md-on-surface);
  background: linear-gradient(90deg, var(--pgr-primary), #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}
.total-shards {
  font-size: 1rem;
  color: var(--md-on-surface-variant);
}
.total-shards span {
  font-weight: 700;
  color: var(--md-on-surface);
}

/* Progress Bar */
.progress-section {
  margin-bottom: 24px;
}
.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--md-on-surface-variant);
  margin-bottom: 8px;
  padding: 0 4px;
}
.progress-bar-bg {
  height: 12px;
  background: var(--md-surface-container-high);
  border-radius: var(--radius-full);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--md-outline-variant);
}
.marker {
  position: absolute;
  top: 0; bottom: 0;
  width: 1px;
  background: var(--md-outline);
  z-index: 1;
}
.marker-1 { left: 10%; }
.marker-2 { left: 40%; }
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pgr-primary), #3b82f6, #c084fc);
  border-radius: var(--radius-full);
  transition: width 0.5s ease-out;
  position: relative;
  z-index: 0;
}

/* Nodes List */
.nodes-container {
  background: var(--md-surface-container-high);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  height: 350px;
}
.nodes-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--md-outline-variant);
}
.nodes-header h3 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--md-on-surface);
}
.nodes-list {
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nodes-list::-webkit-scrollbar { width: 6px; }
.nodes-list::-webkit-scrollbar-track { background: transparent; }
.nodes-list::-webkit-scrollbar-thumb { background: var(--md-outline-variant); border-radius: 3px; }

.node-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  transition: all 0.3s ease;
}

.node-item.is-target {
  border-color: var(--pgr-primary);
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.2);
}

.node-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.node-icon {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--md-surface-container-highest);
  border: 1px solid var(--md-outline);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem;
  color: transparent;
  transition: all 0.3s ease;
}

.node-item.is-reached .node-icon {
  background: #10b981;
  border-color: #059669;
  color: #fff;
}

.node-item.is-reached {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.node-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--md-on-surface-variant);
}

.node-item.is-reached .node-name {
  color: #34d399;
}
.node-item.is-target .node-name {
  color: var(--pgr-primary);
}

.target-badge {
  font-size: 0.6rem;
  padding: 2px 4px;
  background: rgba(56, 189, 248, 0.15);
  color: var(--pgr-primary);
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 700;
}

.node-right {
  text-align: right;
}
.node-req {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--md-on-surface);
}
.node-req span {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--md-on-surface-variant);
}
.node-step {
  font-size: 0.65rem;
  color: var(--md-on-surface-variant);
  margin-top: 2px;
}

/* Responsive */
@media (min-width: 768px) {
  .evo-grid {
    flex-direction: row;
  }
  .evo-inputs {
    flex: 1;
  }
  .evo-status {
    flex: 1.5;
  }
}
</style>
