<template>
  <div class="event-list">

    <section v-if="ongoingEvents.length > 0" class="event-section" aria-labelledby="ongoing-heading">
      <h2 id="ongoing-heading" class="section-heading">
        Ongoing <span class="section-count tabular">{{ ongoingEvents.length }}</span>
      </h2>
      <div class="event-stack">
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
    </section>

    <GanttChart
      v-if="activePatchTimeline"
      :patch="activePatchTimeline"
      :timezone="props.timezone"
      :now="currentTime"
      :showBrowserTime="props.showBrowserTime"
      :gameTimezone="props.gameTimezone"
    />

    <section class="event-section" aria-labelledby="upcoming-heading">
      <h2 id="upcoming-heading" class="section-heading">
        Upcoming <span class="section-count tabular">{{ upcomingEvents.length }}</span>
      </h2>
      <div v-if="upcomingEvents.length > 0" class="event-stack">
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
      <p v-else class="empty-state">
        No upcoming events announced yet. They appear here once the official news lists them.
      </p>
    </section>

    <section v-if="pastEvents.length > 0" class="event-section" aria-labelledby="past-heading">
      <div class="section-heading-row">
        <h2 id="past-heading" class="section-heading">
          Past <span class="section-count tabular">{{ pastEvents.length }}</span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          :aria-expanded="showPastEvents"
          aria-controls="past-events"
          @click="showPastEvents = !showPastEvents"
        >
          {{ showPastEvents ? 'Hide past events' : 'Show past events' }}
        </Button>
      </div>

      <div v-if="showPastEvents" id="past-events" class="past-grid">
        <EventItem
          v-for="event in pastEvents"
          :key="event.name"
          :event="event"
          :now="currentTime"
          :timezone="props.timezone"
          :serverTimezone="props.serverTimezone"
          :showBrowserTime="props.showBrowserTime"
          :gameTimezone="props.gameTimezone"
          compact
        />
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { GameEvent } from '../data/pgrEvents';
import EventItem from './EventItem.vue';
import Button from './ui/Button.vue';
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


</script>

<style scoped>
.event-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
}

.section-heading-row .section-heading {
  margin-bottom: 0;
}

.section-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted-fg);
}

.event-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  padding: 24px 16px;
  border: 1px dashed var(--border);
  border-radius: var(--radius-xl);
  color: var(--muted-fg);
  font-size: 14px;
  text-align: center;
}

.past-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

@media (min-width: 560px) {
  .past-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
