<template>
  <a :href="event.link" target="_blank" rel="noopener noreferrer" class="event-link">
    <div class="event-item" :class="statusClass">

      <!-- banner image -->
      <div class="event-banner">
        <img
          :src="event.image"
          :alt="event.name"
          class="event-image-banner"
          :class="{ 'event-image-banner--past': status === 'past' }"
        />
        <div class="event-overlay" :class="{ 'event-overlay--past': status === 'past' }"></div>
      </div>

      <!-- content -->
      <div class="event-content">
        <!-- status badge -->
        <div class="status-badge" :class="`status-badge--${status}`">
          {{ statusBadgeLabel }}
        </div>
        <div class="event-name">{{ event.name }}</div>
        <p class="event-description">{{ event.description }}</p>

        <div class="event-timer">
          <span class="timer-label">{{ timerLabel }}</span>
          <span class="timer-value" :class="`timer-value--${status}`">{{ formattedTimer }}</span>
        </div>

        <div v-if="status === 'ongoing'" class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>

        <div class="event-duration">
          <div class="time-row">
            <span class="time-label">MAIN</span>
            <span class="time-value">{{ formatUtcTime(event.startTime) }} – {{ formatUtcTime(event.endTime) }}</span>
          </div>
          <div class="time-row">
            <span class="time-label">SERVER</span>
            <span class="time-value">{{ formatServerTime(event.startTime) }} – {{ formatServerTime(event.endTime) }}</span>
          </div>
          <div v-if="showBrowserTime" class="time-row time-row--browser">
            <span class="time-label">LOCAL</span>
            <span class="time-value time-value--browser">{{ formatBrowserTime(event.startTime) }} – {{ formatBrowserTime(event.endTime) }}</span>
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
import { getTzTime as getTzTimeUtil, getTzOffsetMinutes } from '../utils/timezone';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const props = defineProps<{
  event: GameEvent;
  now: dayjs.Dayjs;
  timezone: string;
  serverTimezone: string;
  showBrowserTime?: boolean;
  gameTimezone?: string;
}>();


// Helper to convert database ISO strings timezone-adjusted based on selected server
const getTzTime = (dateStr: string) => {
  return getTzTimeUtil(dateStr, props.timezone, false);
};

const status = computed(() => {
  const start = getTzTime(props.event.startTime);
  const end = getTzTime(props.event.endTime);
  if (props.now.isBefore(start)) return 'upcoming';
  if (props.now.isAfter(end)) return 'past';
  return 'ongoing';
});

const statusClass = computed(() => 'status-' + status.value);

const statusBadgeLabel = computed(() => {
  switch (status.value) {
    case 'ongoing':  return 'Ongoing';
    case 'upcoming': return 'Upcoming';
    case 'past':     return 'Ended';
    default:         return '';
  }
});

const timerLabel = computed(() => {
  switch (status.value) {
    case 'ongoing':  return 'Ends in';
    case 'upcoming': return 'Starts in';
    case 'past':     return 'Ended';
    default:         return '';
  }
});

const formattedTimer = computed(() => {
  let targetDate;
  if (status.value === 'upcoming') {
    targetDate = getTzTime(props.event.startTime);
  } else if (status.value === 'ongoing') {
    targetDate = getTzTime(props.event.endTime);
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
  const start = getTzTime(props.event.startTime);
  const end = getTzTime(props.event.endTime);
  const total = end.diff(start);
  const elapsed = props.now.diff(start);
  return Math.min((elapsed / total) * 100, 100);
});


// MAIN: raw stored time — for wuwaEvents.ts this equals Asia/SEA server clock time
const formatUtcTime = (date: string) => {
  return dayjs.utc(date).format('MM-DD HH:mm');
};

// SERVER: convert from base server time to selected server time using offset diff
// wuwaEvents.ts stores Asia server time as fake-UTC, so we shift by (selected - base)
const formatServerTime = (date: string) => {
  const baseOffset  = getTzOffsetMinutes(props.gameTimezone ?? 'Etc/UTC');
  const selectedOffset = getTzOffsetMinutes(props.timezone);
  const diffMinutes = selectedOffset - baseOffset;
  return dayjs.utc(date).add(diffMinutes, 'minute').format('MM-DD HH:mm');
};

// LOCAL: convert from base server time to browser timezone
// first derive the actual UTC moment, then reinterpret in browser locale
const formatBrowserTime = (date: string) => {
  const baseOffset = getTzOffsetMinutes(props.gameTimezone ?? 'Etc/UTC');
  const actualUtcMs = dayjs.utc(date).valueOf() - baseOffset * 60 * 1000;
  const browserTime = dayjs(actualUtcMs);
  const offset = browserTime.format('Z');
  return `${browserTime.format('MM-DD HH:mm')} (GMT${offset})`;
};
</script>

<style scoped>
.event-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 14px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--elev-3);
}

.event-item {
  position: relative;
  background: var(--md-surface-container);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  min-height: 200px;
}

.event-banner {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.event-image-banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.event-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 20, 0.97) 0%,
    rgba(10, 10, 20, 0.6) 45%,
    rgba(10, 10, 20, 0.15) 75%,
    transparent 100%
  );
  pointer-events: none;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.status-badge--ongoing {
  background: color-mix(in srgb, var(--md-primary) 20%, rgba(0,0,0,0.6));
  color: var(--md-primary);
  border: 1px solid color-mix(in srgb, var(--md-primary) 40%, transparent);
}

.status-badge--upcoming {
  background: rgba(255, 179, 71, 0.18);
  color: #ffb347;
  border: 1px solid rgba(255, 179, 71, 0.35);
}

.status-badge--past {
  background: rgba(255, 255, 255, 0.08);
  color: var(--md-on-surface-variant);
  border: 1px solid var(--md-outline-variant);
}

.event-image-banner--past {
  filter: grayscale(0.6) brightness(0.65);
}

.event-overlay--past {
  background: linear-gradient(
    to top,
    rgba(10, 10, 20, 0.98) 0%,
    rgba(10, 10, 20, 0.72) 45%,
    rgba(10, 10, 20, 0.35) 75%,
    rgba(10, 10, 20, 0.15) 100%
  );
}

.event-content {
  padding: 14px 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.event-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 4px;
  color: #fff;
  line-height: 1.3;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}

.event-description {
  font-size: 0.82em;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.75);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-timer {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.timer-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.6);
}

.timer-value {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.timer-value--ongoing  { color: var(--md-primary); }
.timer-value--upcoming { color: #ffb347; }
.timer-value--past     { color: var(--md-on-surface-variant); }

.progress-bar-container {
  background: rgba(255,255,255,0.15);
  border-radius: var(--radius-full);
  height: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  background: var(--md-primary);
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.event-duration {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.time-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.time-value {
  font-size: 11px;
  color: rgba(255,255,255,0.65);
  text-align: right;
}

.time-row--browser {
  border-top: 1px solid rgba(255,255,255,0.08);
  margin-top: 2px;
  padding-top: 2px;
}

.time-value--browser {
  color: rgba(180, 220, 255, 0.75);
}

.status-past .event-name    { opacity: 0.75; }
.status-past .event-description { opacity: 0.6; }
.status-past .timer-label   { opacity: 0.5; }
.status-past .time-label    { opacity: 0.45; }
.status-past .time-value    { opacity: 0.5; }
</style>