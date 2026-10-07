<template>
  <div class="tools">
    <Card class="tool link-card">
      <div class="link-card__text">
        <h2 class="tool__title">PGR TL;DR Indonesia</h2>
        <p class="tool__desc">Guides and short summaries for Punishing: Gray Raven, in Indonesian.</p>
      </div>
      <Button variant="outline" href="https://pgrtldrid.gitbook.io/main" external>
        Open the guide
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14 21 3" /></svg>
      </Button>
    </Card>

    <Card class="tool">
      <div class="tool__header">
        <h2 class="tool__title">S-Rank shard simulator</h2>
        <p class="tool__desc">See how far your shards take an S-Rank construct toward SSS+.</p>
      </div>

      <div class="tool__body tool__split">
        <div class="tool__inputs">
          <div class="field">
            <label for="shard-ppc">Phantom Pain Cage shards</label>
            <input id="shard-ppc" class="input tabular" type="number" v-model.number="ppc" min="0" max="30" aria-describedby="shard-ppc-hint" />
            <p id="shard-ppc-hint" class="field-hint tabular">Max 30. Costs {{ ppcCost.toLocaleString() }} Scars.</p>
          </div>

          <div class="field">
            <label for="shard-voucher">Voucher shop shards</label>
            <input id="shard-voucher" class="input tabular" type="number" v-model.number="voucher" min="0" aria-describedby="shard-voucher-hint" />
            <p id="shard-voucher-hint" class="field-hint tabular">
              804 vouchers each. Costs {{ voucherCost.toLocaleString() }} vouchers<span v-if="voucher > 0">, about {{ voucherMonths }} month(s)</span>.
            </p>
          </div>

          <div class="field">
            <label for="shard-gacha">Gacha duplicates</label>
            <input id="shard-gacha" class="input tabular" type="number" v-model.number="gacha" min="0" aria-describedby="shard-gacha-hint" />
            <p id="shard-gacha-hint" class="field-hint tabular">1 duplicate = 30 shards. Costs {{ gachaCost.toLocaleString() }} BC (60 pity = 15k BC).</p>
          </div>
        </div>

        <div class="result" aria-live="polite">
          <p class="result__label">Rank</p>
          <p class="result__value">{{ currentRankName }}</p>
          <p class="result__sub tabular">{{ totalShards }} of 300 shards</p>

          <div class="rank-track">
            <div
              class="rank-track__bar"
              role="progressbar"
              :aria-valuenow="visualTotal"
              aria-valuemin="0"
              aria-valuemax="300"
              aria-label="Shards toward SSS+"
            >
              <div class="rank-track__fill" :style="{ width: progressPercentage + '%' }"></div>
              <span class="rank-track__tick" style="left: 10%"></span>
              <span class="rank-track__tick" style="left: 40%"></span>
            </div>
            <div class="rank-track__labels tabular" aria-hidden="true">
              <span style="left: 0">S</span>
              <span style="left: 10%">SS</span>
              <span style="left: 40%">SSS</span>
              <span style="right: 0">SSS+</span>
            </div>
          </div>
        </div>
      </div>

      <div class="nodes">
        <h3 class="nodes__title">Node progression</h3>
        <ol class="nodes__list">
          <li
            v-for="node in nodesList"
            :key="node.req"
            class="node"
            :class="{ 'is-reached': totalShards >= node.req }"
          >
            <span class="node__check" aria-hidden="true">
              <svg v-if="totalShards >= node.req" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <span class="node__name">{{ node.name }}</span>
            <Badge v-if="node.isTarget" variant="outline">Target</Badge>
            <span class="sr-only">{{ totalShards >= node.req ? 'reached' : 'not reached' }}</span>
            <span class="node__req tabular">
              {{ node.req }} shards
              <span v-if="node.step > 0" class="node__step">+{{ node.step }}</span>
            </span>
          </li>
        </ol>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, toRefs } from 'vue';
import { usePersisted } from '../composables/usePersisted';
import Card from './ui/Card.vue';
import Button from './ui/Button.vue';
import Badge from './ui/Badge.vue';

// State
const shardInputs = usePersisted('pgrShardSimulator', { ppc: 0, voucher: 0, gacha: 0 });
const { ppc, voucher, gacha } = toRefs(shardInputs);

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

<style scoped src="./tools.css"></style>
<style scoped>
.link-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 16px;
  padding: 16px;
}

.link-card__text {
  flex: 1 1 260px;
}

.rank-track {
  margin-top: 16px;
}

.rank-track__bar {
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: var(--card);
  border: 1px solid var(--border);
  overflow: hidden;
}

.rank-track__fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}

.rank-track__tick {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--fg);
  opacity: 0.35;
}

.rank-track__labels {
  position: relative;
  height: 18px;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-fg);
}

.rank-track__labels span {
  position: absolute;
  top: 0;
}

.rank-track__labels span:nth-child(2),
.rank-track__labels span:nth-child(3) {
  transform: translateX(-50%);
}

.nodes {
  border-top: 1px solid var(--border);
}

.nodes__title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid var(--border);
}

.nodes__list {
  list-style: none;
  max-height: 340px;
  overflow-y: auto;
}

.node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 14px;
}

.node + .node {
  border-top: 1px solid var(--border);
}

.node__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  border: 1px solid var(--input);
}

.node.is-reached .node__check {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--primary-fg);
}

.node__check svg {
  width: 12px;
  height: 12px;
}

.node__name {
  font-weight: 600;
  color: var(--muted-fg);
}

.node.is-reached .node__name {
  color: var(--fg);
}

.node__req {
  margin-left: auto;
  font-size: 13px;
  color: var(--muted-fg);
  white-space: nowrap;
}

.node__step {
  margin-left: 6px;
  font-size: 12px;
}
</style>
