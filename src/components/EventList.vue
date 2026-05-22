<template>
  <div class="event-list-container">

    <!-- Ongoing -->
    <div v-if="ongoingEvents.length > 0" class="event-category">
      <div class="category-header">
        <span class="category-chip category-chip--ongoing">
          <span class="chip-dot"></span>
          Ongoing
        </span>
        <span class="event-count">{{ ongoingEvents.length }}</span>
      </div>
      <EventItem
        v-for="event in ongoingEvents"
        :key="event.name"
        :event="event"
        :now="currentTime"
        :timezone="props.timezone"
        :serverTimezone="props.serverTimezone"
        :showBrowserTime="props.showBrowserTime"
        :gameTimezone="props.gameTimezone"
      />
    </div>

    <!-- Gantt Chart Timeline -->
    <GanttChart
      v-if="activePatchTimeline"
      :patch="activePatchTimeline"
      :timezone="props.timezone"
      :now="currentTime"
      :showBrowserTime="props.showBrowserTime"
      :gameTimezone="props.gameTimezone"
    />

    <!-- Upcoming -->
    <div class="event-category">
      <div class="category-header">
        <span class="category-chip category-chip--upcoming">
          <span class="chip-dot"></span>
          Upcoming
        </span>
        <span class="event-count">{{ upcomingEvents.length }}</span>
      </div>
      <div v-if="upcomingEvents.length > 0">
        <EventItem
          v-for="event in upcomingEvents"
          :key="event.name"
          :event="event"
          :now="currentTime"
          :timezone="props.timezone"
          :serverTimezone="props.serverTimezone"
          :showBrowserTime="props.showBrowserTime"
          :gameTimezone="props.gameTimezone"
        />
      </div>
      <div v-else class="no-events-message">
        <p>No upcoming events right now.</p>
      </div>
    </div>

    <!-- Past -->
    <div v-if="pastEvents.length > 0" class="event-category">
      <div class="category-header">
        <span class="category-chip category-chip--past">
          <span class="chip-dot"></span>
          Past
        </span>
        <button @click="showPastEvents = !showPastEvents" class="toggle-btn">
          {{ showPastEvents ? 'Hide' : 'Show' }}
        </button>
      </div>

      <div class="past-grid-outer" ref="pastGridOuter" :style="pastWrapStyle">
        <div class="past-events-grid" ref="pastGridEl" :style="pastGridStyle">
          <EventItem
            v-for="event in pastEvents"
            :key="event.name"
            :event="event"
            :now="currentTime"
            :timezone="props.timezone"
            :serverTimezone="props.serverTimezone"
            :showBrowserTime="props.showBrowserTime"
            :gameTimezone="props.gameTimezone"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {
  ref, computed, onMounted, onUnmounted,
  nextTick, watch, watchEffect,
} from 'vue';
import type { GameEvent } from '../data/pgrEvents';
import EventItem from './EventItem.vue';
import GanttChart from './GanttChart.vue';
import type { PatchTimeline } from '../data/wuwaTimeline';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getTzTime as getTzTimeUtil } from '../utils/timezone';

dayjs.extend(utc);

const props = defineProps<{
  events: GameEvent[];
  timelineData?: PatchTimeline[];
  timezone: string;
  serverTimezone: string;
  showBrowserTime?: boolean;
  gameTimezone?: string;
}>();

// Helper to convert database ISO strings timezone-adjusted based on selected server
const getTzTime = (dateStr: string) => {
  return getTzTimeUtil(dateStr, props.timezone, false);
};

// ── Timer ────────────────────────────────────────────────
const showPastEvents = ref(false);
const currentTime = ref(dayjs());
let timer: number;

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = dayjs();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
  pastRO?.disconnect();
});

// ── Event buckets ────────────────────────────────────────
const sortedEvents = computed(() =>
  [...props.events].sort((a, b) => getTzTime(a.startTime).diff(getTzTime(b.startTime)))
);

const ongoingEvents = computed(() =>
  sortedEvents.value.filter(e => {
    const start = getTzTime(e.startTime);
    const end   = getTzTime(e.endTime);
    return currentTime.value.isAfter(start) && currentTime.value.isBefore(end);
  })
);

const upcomingEvents = computed(() =>
  sortedEvents.value.filter(e => getTzTime(e.startTime).isAfter(currentTime.value))
);

const pastEvents = computed(() =>
  sortedEvents.value
    .filter(e => getTzTime(e.endTime).isBefore(currentTime.value))
    .sort((a, b) => getTzTime(b.endTime).diff(getTzTime(a.endTime)))
);

const activePatchTimeline = computed(() => {
  if (!props.timelineData || props.timelineData.length === 0) return null;
  return props.timelineData.find(patch => {
    const start = getTzTime(patch.startTime);
    const end = getTzTime(patch.endTime);
    return currentTime.value.isAfter(start) && currentTime.value.isBefore(end);
  }) || props.timelineData[0];
});


// ── Past grid proportional scaling ──────────────────────
const PAST_GRID_REF_WIDTH = 700;

const pastGridOuter = ref<HTMLElement | null>(null);
const pastGridEl    = ref<HTMLElement | null>(null);
const pastScale     = ref(1);
const pastWrapHeight = ref(0);
let   pastRO: ResizeObserver | null = null;

const updatePastScale = () => {
  if (!pastGridOuter.value || !pastGridEl.value) return;

  const availW = pastGridOuter.value.clientWidth;
  const scale  = Math.min(1, availW / PAST_GRID_REF_WIDTH);
  pastScale.value = scale;

  const naturalH = pastGridEl.value.scrollHeight;
  pastWrapHeight.value = Math.ceil(naturalH * scale);
};

const pastGridStyle = computed(() => {
  if (pastScale.value >= 1) {
    return { width: '100%' };
  }
  return {
    width:           `${PAST_GRID_REF_WIDTH}px`,
    transformOrigin: 'top left',
    transform:       `scale(${pastScale.value})`,
  };
});

const pastWrapStyle = computed(() => ({
  height:     showPastEvents.value ? `${pastWrapHeight.value}px` : '0px',
  opacity:    showPastEvents.value ? '1' : '0',
  overflow:   'hidden',
  transition: 'height 0.35s ease, opacity 0.25s ease',
}));

watchEffect(() => {
  if (pastGridOuter.value && !pastRO) {
    pastRO = new ResizeObserver(updatePastScale);
    pastRO.observe(pastGridOuter.value);
    updatePastScale();
  }
});

watch(showPastEvents, async (visible) => {
  if (visible) {
    await nextTick();
    updatePastScale();
  }
});
</script>

<style scoped>
.event-list-container {
  max-width: 800px;
  margin: 0 auto;
}

.event-category {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-chip--ongoing {
  background: color-mix(in srgb, var(--md-primary) 16%, transparent);
  color: var(--md-primary);
}
.category-chip--ongoing .chip-dot {
  background: var(--md-primary);
  box-shadow: 0 0 6px var(--md-primary);
}

.category-chip--upcoming {
  background: rgba(255, 179, 71, 0.14);
  color: #ffb347;
}
.category-chip--upcoming .chip-dot {
  background: #ffb347;
}

.category-chip--past {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
}
.category-chip--past .chip-dot {
  background: var(--md-on-surface-dim);
}

.event-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface-dim);
  background: var(--md-surface-container-high);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.toggle-btn {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}
.toggle-btn:hover {
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface);
}

.no-events-message {
  text-align: center;
  padding: 32px;
  background: var(--md-surface-container-low);
  border-radius: var(--radius-lg);
  color: var(--md-on-surface-variant);
  font-size: 14px;
}

.past-grid-outer {
  width: 100%;
}

.past-events-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  align-items: stretch;
}

.past-events-grid :deep(.event-link) {
  margin-bottom: 0;
}

.past-events-grid :deep(.event-item) {
  min-height: 170px;
}

.past-events-grid :deep(.event-name) {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.past-events-grid :deep(.event-description) {
  -webkit-line-clamp: 1;
}
</style>