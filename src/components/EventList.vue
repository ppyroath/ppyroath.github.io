<template>
  <div class="event-list-container">
    <div v-if="ongoingEvents.length > 0" class="event-category">
      <h2>Ongoing</h2>
      <EventItem v-for="event in ongoingEvents" :key="event.name" :event="event" :now="currentTime" :timezone="props.timezone" :serverTimezone="props.serverTimezone" />
    </div>
    <div class="event-category">
      <div class="category-header">
        <h2>Upcoming</h2>
      </div>
      <div v-if="upcomingEvents.length > 0">
        <EventItem v-for="event in upcomingEvents" :key="event.name" :event="event" :now="currentTime" :timezone="props.timezone" :serverTimezone="props.serverTimezone" />
      </div>
      <div v-else class="no-events-message">
        <p>No upcoming events at the moment.</p>
      </div>
    </div>
    <div v-if="pastEvents.length > 0" class="event-category">
      <div class="category-header">
        <h2>Past</h2>
        <button @click="showPastEvents = !showPastEvents" class="toggle-past-btn">
          {{ showPastEvents ? 'Hide' : 'Show' }}
        </button>
      </div>
      <transition name="fade">
        <div v-if="showPastEvents" class="past-events-grid">
          <EventItem v-for="event in pastEvents" :key="event.name" :event="event" :now="currentTime" :timezone="props.timezone" :serverTimezone="props.serverTimezone" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { GameEvent } from '../data/pgrEvents';
import EventItem from './EventItem.vue';
import dayjs from 'dayjs';

const props = defineProps<{
  events: GameEvent[];
  timezone: string;
  serverTimezone: string;
}>();

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

const sortedEvents = computed(() => 
  [...props.events].sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
);

const ongoingEvents = computed(() => 
  sortedEvents.value.filter(e => {
    const start = dayjs(e.startTime);
    const end = dayjs(e.endTime);
    return currentTime.value.isAfter(start) && currentTime.value.isBefore(end);
  })
);

const upcomingEvents = computed(() => 
  sortedEvents.value.filter(e => dayjs(e.startTime).isAfter(currentTime.value))
);

const pastEvents = computed(() => 
  sortedEvents.value.filter(e => dayjs(e.endTime).isBefore(currentTime.value))
    .sort((a, b) => dayjs(b.endTime).diff(dayjs(a.endTime))) //show most recently ended first
);

</script>

<style scoped>
.no-events-message {
  text-align: center;
  padding: 40px;
  background-color: var(--content-bg-alt);
  border-radius: 8px;
  margin-top: 20px;
  color: var(--text-color-secondary);
}

.event-list-container {
  max-width: 800px;
  margin: 0 auto;
}

.event-category h2 {
  font-size: 1.5em;
  color: var(--text-color-primary);
  padding-bottom: 10px;
  margin: 0;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 20px;
}

.toggle-past-btn {
  background: var(--button-bg);
  color: var(--button-text);
  border: 1px solid var(--border-color);
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}
.toggle-past-btn:hover {
  background: var(--hover-bg);
}

.past-events-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  align-items: stretch;
}


.past-events-grid :deep(.event-link) {
  margin-bottom: 0;
}
.past-events-grid :deep(.event-image-banner) {
  height: 100px;
}
.past-events-grid :deep(.event-content) {
  padding: 12px;
}
.past-events-grid :deep(.event-name) {
  font-size: 1em;
  margin-bottom: 5px;
}
.past-events-grid :deep(.event-description) {
  font-size: 0.85em;
  margin-bottom: 8px;
}
.past-events-grid :deep(.event-timer) {
  font-size: 1em;
  margin-bottom: 8px;
}
.past-events-grid :deep(.event-duration) {
  font-size: 0.8em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .past-events-grid {
    grid-template-columns: 1fr;
  }
}
</style>