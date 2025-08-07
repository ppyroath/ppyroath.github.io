<template>
  <div>
    <div class="local-time-display">
      <span class="label">Your Local Time:</span>
      <span class="value">{{ localTime }}</span>
      <span class="date-value">({{ localDate }})</span>
    </div>
    <div class="time-info-card">
      <div class="time-grid">
        <div class="time-item">
          <span class="label">{{ config.name }} Server Time</span>
          <span class="value">{{ serverTime }}</span>
        </div>
        <div class="time-item">
          <span class="label">Local Reset Time</span>
          <span class="value">{{ localResetTime }}</span>
        </div>
        <div class="time-item">
          <span class="label">Daily Reset In</span>
          <span class="value">{{ timeUntilReset }}</span>
        </div>
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

const localTime = ref('');
const localDate = ref('');
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
  return nextResetTime.value.local().format('HH:mm:ss');
});

const updateTimes = () => {
  const now = dayjs();
  localTime.value = now.format('HH:mm:ss');
  localDate.value = now.format('YYYY-MM-DD');

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
.local-time-display {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.1em;
  color: var(--text-color-secondary);
}
.local-time-display .label {
  font-weight: bold;
  color: var(--text-color-primary);
  margin-right: 8px;
}
.local-time-display .value {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  margin-right: 8px;
}
.local-time-display .date-value {
  font-size: 0.9em;
}

.time-info-card {
  background: var(--content-bg);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  text-align: center;
}

.time-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.9em;
  color: var(--text-color-secondary);
  margin-bottom: 5px;
  font-weight: bold;
}

.value {
  font-size: 1.5em;
  color: var(--text-color-primary);
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}
</style>
