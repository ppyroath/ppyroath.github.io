<template>
  <a :href="event.link" target="_blank" rel="noopener noreferrer" class="event-link">
    <div class="event-item" :class="statusClass">
      <img :src="event.image" :alt="event.name" class="event-image-banner" />
      <div class="event-content">
        <div class="event-name">{{ event.name }}</div>
        <p class="event-description">{{ event.description }}</p>
        <div class="event-timer">
          <span>{{ timerLabel }}:</span> {{ formattedTimer }}
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="event-duration">
          <div class="time-row">
            <span class="time-label">Server:</span>
            <span class="time-value">
              {{ formatServerTime(event.startTime) }} ~ {{ formatServerTime(event.endTime) }} ({{ serverTimezone }})
            </span>
          </div>
          <div class="time-row">
            <span class="time-label">Local:</span>
            <span class="time-value">
              {{ formatLocalTime(event.startTime) }} ~ {{ formatLocalTime(event.endTime) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GameEvent } from '../data/pgrEvents';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const props = defineProps<{
  event: GameEvent;
  now: dayjs.Dayjs;
  timezone: string;
  serverTimezone: string;
}>();

const status = computed(() => {
  const start = dayjs(props.event.startTime);
  const end = dayjs(props.event.endTime);
  if (props.now.isBefore(start)) return 'upcoming';
  if (props.now.isAfter(end)) return 'past';
  return 'ongoing';
});

const statusClass = computed(() => 'status-' + status.value);

const timerLabel = computed(() => {
  switch (status.value) {
    case 'ongoing': return 'Ends in';
    case 'upcoming': return 'Starts in';
    case 'past': return 'Ended';
    default: return '';
  }
});

const formattedTimer = computed(() => {
  let targetDate;
  if (status.value === 'upcoming') {
    targetDate = dayjs(props.event.startTime);
  } else if (status.value === 'ongoing') {
    targetDate = dayjs(props.event.endTime);
  } else {
    return 'Already ended';
  }

  if (targetDate.isBefore(props.now)) {
    return status.value === 'ongoing' ? 'Ending now' : 'Already ended';
  }

  const diff = targetDate.diff(props.now);
  const d = dayjs.duration(diff);

  const years = d.years();
  const months = d.months();
  const days = d.days();
  const hours = d.hours();
  const minutes = d.minutes();
  const seconds = d.seconds();

  let result = '';
  if (years > 0) result += `${years}y `;
  if (months > 0) result += `${months}m `;
  if (days > 0) result += `${days}d `;
  if (hours > 0 || days > 0 || months > 0 || years > 0) result += `${hours}h `;
  
  result += `${minutes}m ${seconds}s`;

  return result.trim();
});

const progress = computed(() => {
  if (status.value !== 'ongoing') return 0;
  const start = dayjs(props.event.startTime);
  const end = dayjs(props.event.endTime);
  const total = end.diff(start);
  const elapsed = props.now.diff(start);
  return Math.min((elapsed / total) * 100, 100);
});

const formatServerTime = (date: string) => {
  if (props.timezone === 'Etc/UTC') {
    return dayjs.utc(date).format('YYYY-MM-DD HH:mm:ss');
  }
  const wallTime = date.slice(0, -1);
  return dayjs.tz(wallTime, props.timezone).format('YYYY-MM-DD HH:mm:ss');
};

const formatLocalTime = (date: string) => {
  let correctTimeObject;

  if (props.timezone === 'Etc/UTC') {
    correctTimeObject = dayjs.utc(date);
  } else {
    const wallTime = date.slice(0, -1);
    correctTimeObject = dayjs.tz(wallTime, props.timezone);
  }

  return correctTimeObject.local().format('YYYY-MM-DD HH:mm:ss');
};
</script>

<style scoped>
.event-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s ease-in-out;
  height: 100%; 
}

.event-link:hover {
  transform: translateY(-5px);
}

.event-item {
  background: var(--content-bg);
  color: var(--text-color-primary);
  border-left: 5px solid #ccc;
  transition: background-color 0.3s, border-color 0.3s;
  height: 100%; 
  display: flex;
  flex-direction: column;
}

.event-image-banner {
  width: 100%;
  height: 150px;
  object-fit: cover;
  flex-shrink: 0; 
}

.event-content {
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
}

.event-description {
  flex-grow: 1; 
}

.status-ongoing { border-left-color: var(--accent-color); }
.status-upcoming { border-left-color: #ff9800; }
.status-past { border-left-color: #555; }

.event-name {
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 10px;
}

.event-description {
  font-size: 0.9em;
  margin-bottom: 10px;
  color: var(--text-color-secondary);
}

.event-timer {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.event-timer span {
  font-weight: bold;
}

.progress-bar-container {
  background: var(--main-bg);
  border-radius: 5px;
  height: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  background: var(--accent-color);
  height: 100%;
  transition: width 0.2s ease;
}

.event-duration {
  font-size: 0.9em;
  color: var(--text-color-secondary);
  text-align: right;
}

.time-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-label {
  font-weight: bold;
  margin-right: 10px;
}

.time-value {
  text-align: right;
}
</style>
