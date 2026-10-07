<template>
  <a
    :href="event.link"
    target="_blank"
    rel="noopener noreferrer"
    class="event-card"
    :class="[statusClass, { 'event-card--compact': compact }]"
  >
    <div class="event-media">
      <img :src="event.image" alt="" class="event-image" loading="lazy" />
    </div>

    <div class="event-body">
      <div class="event-head">
        <Badge :variant="badgeVariant">{{ statusBadgeLabel }}</Badge>
        <span v-if="status !== 'past'" class="event-timer">
          <span class="event-timer__label">{{ timerLabel }}</span>
          <span class="event-timer__value tabular">{{ formattedTimer }}</span>
        </span>
      </div>

      <h3 class="event-name">{{ event.name }}</h3>
      <p v-if="!compact" class="event-description">{{ event.description }}</p>

      <div
        v-if="status === 'ongoing'"
        class="progress"
        role="progressbar"
        :aria-valuenow="Math.round(progress)"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`${event.name} progress`"
      >
        <div class="progress__bar" :style="{ width: progress + '%' }"></div>
      </div>

      <dl class="event-times tabular">
        <div class="event-times__row">
          <dt>Main</dt>
          <dd>{{ formatUtcTime(event.startTime) }} to {{ formatUtcTime(event.endTime) }}</dd>
        </div>
        <div v-if="!compact" class="event-times__row">
          <dt>Server</dt>
          <dd>{{ formatServerTime(event.startTime) }} to {{ formatServerTime(event.endTime) }}</dd>
        </div>
        <div v-if="showBrowserTime && !compact" class="event-times__row">
          <dt>Local</dt>
          <dd>{{ formatBrowserTime(event.startTime) }} to {{ formatBrowserTime(event.endTime) }}</dd>
        </div>
      </dl>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GameEvent } from '../data/pgrEvents';
import dayjs from 'dayjs';
import Badge from './ui/Badge.vue';
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
  compact?: boolean;
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

const badgeVariant = computed(() =>
  status.value === 'ongoing' ? 'primary' : status.value === 'upcoming' ? 'outline' : 'secondary'
);

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
  const days = Math.floor(d.asDays());
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
.event-card {
  display: flex;
  flex-direction: column;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: border-color 0.15s ease;
}

.event-card:hover {
  border-color: color-mix(in srgb, var(--fg) 25%, var(--border));
}

.event-media {
  aspect-ratio: 16 / 6;
  background: var(--muted);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.status-past .event-image {
  filter: grayscale(0.8);
  opacity: 0.7;
}

.event-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 16px;
}

.event-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.event-timer {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-size: 13px;
}

.event-timer__label {
  color: var(--muted-fg);
}

.event-timer__value {
  font-weight: 700;
  color: var(--fg);
}

.event-name {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.event-description {
  font-size: 14px;
  color: var(--muted-fg);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress {
  height: 6px;
  border-radius: 999px;
  background: var(--muted);
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: var(--primary);
  border-radius: inherit;
  transition: width 0.3s ease;
}

.event-times {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.event-times__row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.event-times dt {
  color: var(--muted-fg);
  flex-shrink: 0;
}

.event-times dd {
  text-align: right;
  min-width: 0;
}

/* Compact variant for the past-events grid: a row with a thumbnail,
   so a long archive stays scannable */
.event-card--compact {
  flex-direction: row;
  align-items: stretch;
}

.event-card--compact .event-media {
  flex: 0 0 112px;
  aspect-ratio: auto;
  min-height: 72px;
  border-bottom: none;
  border-right: 1px solid var(--border);
}

.event-card--compact .event-body {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  gap: 4px;
  justify-content: center;
}

.event-card--compact .event-head {
  display: none;
}

.event-card--compact .event-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-card--compact .event-times {
  font-size: 12px;
  padding-top: 0;
  border-top: none;
}

.event-card--compact .event-times__row {
  justify-content: flex-start;
}

.event-card--compact .event-times dt {
  display: none;
}

.event-card--compact .event-times dd {
  text-align: left;
}

.status-past .event-name,
.status-past .event-times dd {
  color: var(--muted-fg);
}
</style>
