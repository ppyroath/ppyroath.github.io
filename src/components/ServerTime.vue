<template>
  <dl class="server-time">
    <div class="stat">
      <dt class="stat__label">{{ config.name }} server time</dt>
      <dd class="stat__value tabular">{{ serverTime }}</dd>
    </div>
    <div class="stat">
      <dt class="stat__label">Daily reset, your time</dt>
      <dd class="stat__value tabular">{{ localResetTime }}</dd>
    </div>
    <div class="stat stat--focus">
      <dt class="stat__label">Reset in</dt>
      <dd class="stat__value tabular">{{ timeUntilReset }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { getTzOffsetMinutes } from '../utils/timezone';

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(advancedFormat);

interface ServerConfig {
  name: string;
  timezone: string;
  dailyReset: string; // "HH:mm"
}

const props = defineProps<{
  config: ServerConfig;
}>();

const serverTime = ref('');
const timeUntilReset = ref('');
let intervalId: number;

const nextResetTime = computed(() => {
  const offset = getTzOffsetMinutes(props.config.timezone);
  const nowInServerTz = dayjs.utc().utcOffset(offset);
  const [resetHour, resetMinute] = props.config.dailyReset.split(':').map(Number);
  let nextReset = nowInServerTz
    .hour(resetHour)
    .minute(resetMinute)
    .second(0)
    .millisecond(0);

  if (nowInServerTz.isAfter(nextReset)) {
    nextReset = nextReset.add(1, 'day');
  }
  return nextReset;
});

const localResetTime = computed(() => {
  return nextResetTime.value.local().format('HH:mm');
});

const updateTimes = () => {
  const now = dayjs();
  const offset = getTzOffsetMinutes(props.config.timezone);
  const nowInServerTz = now.utc().utcOffset(offset);
  serverTime.value = nowInServerTz.format('HH:mm:ss');

  const diff = nextResetTime.value.diff(nowInServerTz);
  const d = dayjs.duration(diff);
  timeUntilReset.value = `${String(d.hours()).padStart(2, '0')}:${String(d.minutes()).padStart(2, '0')}:${String(d.seconds()).padStart(2, '0')}`;
};

onMounted(() => {
  updateTimes();
  intervalId = window.setInterval(updateTimes, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.server-time {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--card);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  min-width: 0;
}

.stat + .stat {
  border-left: 1px solid var(--border);
}

.stat__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-fg);
  line-height: 1.3;
}

.stat__value {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* The reset countdown is what people open the page for */
.stat--focus .stat__value {
  color: var(--primary);
}

@media (max-width: 480px) {
  .stat {
    padding: 12px;
  }
  .stat__value {
    font-size: 1.05rem;
  }
}
</style>
