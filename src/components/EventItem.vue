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

<!--og styling
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
-->


<!--glassmorphism styling 1-->
<style scoped>
.event-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease;
  height: 100%;
  position: relative;
  background: var(--content-bg);
}

.event-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.event-item {
  background: var(--content-bg);
  color: var(--text-color-primary);
  border-left: 5px solid #ccc;
  transition: background-color 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box; 
}


.event-image-banner {
  width: 100%;
  aspect-ratio: 16/9; 
  object-fit: cover;
  flex-shrink: 0;
  display: block;
}

.event-content {
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  z-index: 2;
  box-sizing: border-box;
}


.status-ongoing {
  border-left: none;
  min-height: 280px; 
  justify-content: flex-end;
}

.status-ongoing .event-image-banner {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 1;
  object-fit: cover; 
  aspect-ratio: auto;
}

.status-ongoing .event-content {
  background: color-mix(in srgb, var(--content-bg), transparent 25%);
  
  @supports not (background: color-mix(in srgb, red, blue)) {
    background: rgba(255, 255, 255, 0.75);
  }

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  border-top: 1px solid rgba(128, 128, 128, 0.2);

  flex-grow: 0;
  width: 100%;
  position: relative;
}

:global(.dark-mode) .status-ongoing .event-content {
   @supports not (background: color-mix(in srgb, red, blue)) {
      background: rgba(30, 30, 30, 0.75);
   }
   border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.status-upcoming { border-left-color: #ff9800; }
.status-past { border-left-color: #555; }

.event-name {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 5px;
  line-height: 1.3;
}

.status-ongoing .event-name {
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.event-description {
  font-size: 0.9em;
  margin-bottom: 10px;
  color: var(--text-color-secondary);
  
  display: -webkit-box;
  -line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-ongoing .event-description {
  opacity: 0.9;
  color: inherit; 
}

.event-timer {
  margin-bottom: 8px;
  font-size: 1.1em;
  font-weight: bold;
}

.progress-bar-container {
  background: rgba(128,128,128,0.2);
  border-radius: 4px;
  height: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  background: var(--accent-color);
  height: 100%;
  transition: width 0.2s ease;
  box-shadow: 0 0 8px var(--accent-color);
}

.event-duration {
  font-size: 0.8em;
  text-align: right;
  opacity: 0.8;
}

.time-row {
  display: flex;
  justify-content: space-between;
}
</style>

<!--glassmorphism styling 2
<style scoped>
.event-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease;
  height: 100%;
  position: relative;
  background: var(--content-bg);
  transform: translateZ(0); 
}

.event-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.event-item {
  background: var(--content-bg);
  color: var(--text-color-primary);
  border-left: 5px solid #ccc;
  transition: background-color 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.event-image-banner {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
}

.event-content {
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  z-index: 2;
  box-sizing: border-box;
}

.status-ongoing {
  --glass-bg: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.6) 0%, 
    rgba(255, 255, 255, 0.1) 100%
  );
  --glass-border: rgba(255, 255, 255, 0.4);
  --glass-blur: 20px; 
  --glass-saturate: 160%; 
  --glass-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  --glass-text: inherit;
  
  --glass-text-shadow: inherit; 

  border-left: none;
  min-height: 280px; 
}

:global(.dark-mode) .status-ongoing {
  --glass-bg: linear-gradient(
    135deg, 
    rgba(30, 30, 30, 0.85) 0%, 
    rgba(30, 30, 30, 0.4) 100%
  );
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  --glass-text: #f0f0f0;
  --glass-saturate: 120%; 
  
  --glass-text-shadow: 0 2px 4px rgba(0, 0, 0, 0.95); 
}

.status-ongoing .event-image-banner {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 1;
  object-fit: cover;
  aspect-ratio: auto;
}

.status-ongoing .event-content {
  position: absolute;
  bottom: 0; 
  left: 0;
  width: 100%;
  
  bottom: -5px; 
  padding-bottom: 22px;
  background: var(--glass-bg);
  color: var(--glass-text);
  
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  
  border-top: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);

  flex-grow: 0;
  
  border-top-left-radius: 12px; 
  border-top-right-radius: 12px;
}

.status-upcoming { border-left-color: #ff9800; }
.status-past { border-left-color: #555; }

.event-name {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 5px;
  line-height: 1.3;
}

.status-ongoing .event-name {
  text-shadow: var(--glass-text-shadow);
}

.event-description {
  font-size: 0.9em;
  margin-bottom: 10px;
  color: var(--text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-ongoing .event-description {
  color: var(--glass-text);
  opacity: 0.95;
  text-shadow: var(--glass-text-shadow);
}

.event-timer {
  margin-bottom: 8px;
  font-size: 1.1em;
  font-weight: bold;
}

.status-ongoing .event-timer {
  text-shadow: var(--glass-text-shadow);
}

.progress-bar-container {
  background: rgba(128,128,128,0.3);
  border-radius: 4px;
  height: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  background: var(--accent-color);
  height: 100%;
  transition: width 0.2s ease;
  box-shadow: 0 0 10px var(--accent-color);
}

.event-duration {
  font-size: 0.8em;
  text-align: right;
  opacity: 0.8;
  color: inherit;
  text-shadow: var(--glass-text-shadow);
}

.time-row {
  display: flex;
  justify-content: space-between;
}

/*.time-label {
  font-weight: bold;
}*/

</style>
-->