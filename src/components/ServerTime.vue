<template>
  <div class="server-time-card">
    <div class="time-grid">
      <div class="time-item">
        <span class="time-label">{{ config.name }} Server</span>
        <span class="time-value">{{ serverTime }}</span>
      </div>
      <div class="time-item">
        <span class="time-label">Local Reset</span>
        <span class="time-value">{{ localResetTime }}</span>
      </div>
      <div class="time-item">
        <span class="time-label">Reset In</span>
        <span class="time-value time-value--accent">{{ timeUntilReset }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
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
  const nowInServerTz = dayjs().tz(props.config.timezone);
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
  const nowInServerTz = now.tz(props.config.timezone);
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
.server-time-card {
  background: var(--md-surface-container);
  border-radius: var(--radius-xl);
  padding: 20px 16px;
  margin-bottom: 16px;
  box-shadow: var(--elev-1);
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  text-align: center;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.time-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--md-on-surface-variant);
  line-height: 1.2;
}

.time-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--md-on-surface);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.time-value--accent {
  color: var(--md-primary);
}

@media (max-width: 360px) {
  .time-value {
    font-size: 1rem;
  }
}
</style>