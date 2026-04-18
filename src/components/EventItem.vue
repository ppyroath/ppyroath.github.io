<template>
  <a :href="event.link" target="_blank" rel="noopener noreferrer" class="event-link">
    <div class="event-item" :class="statusClass">
      <div :style="status === 'past' ? { backgroundImage: 'url(' + event.image + ')', backgroundSize: 'cover', backgroundPosition: 'center' } : {}" :class="status === 'past' ? 'event-bg-banner' : ''">
        <img v-if="status !== 'past'" :src="event.image" :alt="event.name" class="event-image-banner" />
      </div>
      <div v-if="status !== 'past'" class="event-overlay"></div>
      <div class="event-content">
        <div class="event-name">{{ event.name }}</div>
        <p class="event-description">{{ event.description }}</p>
        <div class="event-timer">
          <span class="timer-label">{{ timerLabel }}:</span> <span class="timer-value">{{ formattedTimer }}</span>
        </div>
        <div v-if="status === 'ongoing'" class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="event-duration">
          <div class="time-row">
            <span class="time-label">Server:</span>
            <span class="time-value">{{ formatServerTime(event.startTime) }} ~ {{ formatServerTime(event.endTime) }}</span>
          </div>
          <div class="time-row">
            <span class="time-label">Local:</span>
            <span class="time-value">{{ formatLocalTime(event.startTime) }} ~ {{ formatLocalTime(event.endTime) }}</span>
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

  const days = d.days();
  const hours = d.hours();
  const minutes = d.minutes();
  const seconds = d.seconds();

  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0 || days > 0) result += `${hours}h `;
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
    return dayjs.utc(date).format('MM-DD HH:mm');
  }
  const wallTime = date.slice(0, -1);
  return dayjs.tz(wallTime, props.timezone).format('MM-DD HH:mm');
};

const formatLocalTime = (date: string) => {
  if (props.timezone === 'Etc/UTC') {
    return dayjs.utc(date).format('MM-DD HH:mm');
  }
  const wallTime = date.slice(0, -1);
  return dayjs.tz(wallTime, props.timezone).local().format('MM-DD HH:mm');
};
</script>

<style scoped>
.event-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-link:hover {
  transform: translateY(-2px);
}

.event-item {
  position: relative;
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.event-image-banner {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
}

.event-bg-banner {
  position: absolute;
  inset: 0;
  border-radius: 12px;
}

.event-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 15, 0.95) 0%,
    rgba(10, 10, 15, 0.6) 40%,
    rgba(10, 10, 15, 0.3) 70%,
    transparent 100%
  );
  pointer-events: none;
}

.event-content {
  padding: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.status-past .event-content {
  position: relative;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  
}

.event-name {
  font-weight: 700;
  font-size: 1.1em;
  margin-bottom: 4px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  line-height: 1.3;
}

.event-description {
  font-size: 0.85em;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-timer {
  margin-bottom: 8px;
}

.timer-label {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.7);
}

.timer-value {
  font-size: 1.1em;
  font-weight: 700;
  color: #fff;
}

.status-ongoing .timer-value {
  color: var(--accent-wuwa);
}

.status-upcoming .timer-value {
  color: #ff9800;
}

.status-past .timer-value {
  color: rgba(255, 255, 255, 0.5);
}

.progress-bar-container {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  height: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  background: var(--accent-wuwa);
  height: 100%;
  transition: width 0.3s ease;
}

.event-duration {
  font-size: 0.75em;
  color: rgba(255, 255, 255, 0.6);
}

.time-row {
  display: flex;
  justify-content: space-between;
}

.time-label {
  font-weight: 600;
}

@media (max-width: 480px) {
  .event-image-banner {
    aspect-ratio: 2/1;
  }
  
  .event-content {
    padding: 12px;
  }
  
  .event-name {
    font-size: 1em;
  }
  
  .event-description {
    font-size: 0.8em;
  }
}
</style>