<template>
  <div class="game-view">

    <!-- Page Header -->
    <div class="page-header">
      <span class="logo-mask logo-mask--wuwa page-header__logo" aria-hidden="true"></span>
      <h1 class="page-title">Wuthering Waves</h1>
    </div>

    <!-- Server Time Card -->
    <ServerTime :config="currentServerConfig" />

    <!-- Server Selector — M3 Segmented Button -->
    <div class="seg-btn-wrapper">
      <div class="seg-btn-group" role="group" aria-label="Select Server">
        <button
          v-for="server in Object.keys(wuwaServerConfigs)"
          :key="server"
          class="seg-btn"
          :class="{ active: selectedServer === server }"
          @click="selectedServer = server"
        >
          {{ server }}
        </button>
      </div>
    </div>

    <!-- Event List -->
    <EventList
      :events="wuwaEvents"
      :timezone="currentServerConfig.timezone"
      :serverTimezone="serverTimezoneLabel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import EventList from '../components/EventList.vue';
import ServerTime from '../components/ServerTime.vue';
import { wuwaEvents } from '../data/wuwaEvents';

const wuwaServerConfigs = {
  America: { name: 'America', timezone: 'Etc/GMT+5', dailyReset: '04:00' },
  Asia:    { name: 'Asia',    timezone: 'Etc/GMT-8', dailyReset: '04:00' },
  Europe:  { name: 'Europe',  timezone: 'Etc/GMT-1', dailyReset: '04:00' },
  SEA:     { name: 'SEA',     timezone: 'Etc/GMT-8', dailyReset: '04:00' },
};

const selectedServer = ref('SEA');

const currentServerConfig = computed(() =>
  wuwaServerConfigs[selectedServer.value as keyof typeof wuwaServerConfigs]
);

const serverTimezoneLabel = computed(() => {
  const tz = currentServerConfig.value.timezone;
  if (tz === 'Etc/UTC') return 'UTC';
  const offset = tz.replace('Etc/GMT', '');
  if (offset.startsWith('-')) return `UTC+${offset.substring(1)}`;
  if (offset.startsWith('+')) return `UTC-${offset.substring(1)}`;
  return 'UTC';
});

onMounted(() => {
  const savedServer = localStorage.getItem('wuwaServer');
  if (savedServer && Object.keys(wuwaServerConfigs).includes(savedServer)) {
    selectedServer.value = savedServer;
  }
});

watch(selectedServer, (newServer) => {
  localStorage.setItem('wuwaServer', newServer);
});
</script>

<style scoped>
.game-view {
  padding-top: 8px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.page-header__logo {
  width: 28px;
  height: 28px;
  color: var(--md-primary);
  flex-shrink: 0;
}

.logo-mask--wuwa {
  -webkit-mask-image: url('../assets/images/wuwa-logo.svg');
  mask-image: url('../assets/images/wuwa-logo.svg');
}

.page-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--md-on-surface);
  letter-spacing: -0.01em;
}

.seg-btn-wrapper {
  margin-bottom: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.seg-btn-wrapper::-webkit-scrollbar { display: none; }

.seg-btn-group {
  display: flex;
  border: 1px solid var(--md-outline);
  border-radius: var(--radius-full);
  overflow: hidden;
  min-width: max-content;
  width: 100%;
}

.seg-btn {
  flex: 1;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  white-space: nowrap;
  position: relative;
}

.seg-btn:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: var(--md-outline);
}

.seg-btn.active::after,
.seg-btn.active + .seg-btn::before {
  display: none;
}

.seg-btn.active {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

.seg-btn:hover:not(.active) {
  background: var(--state-hover);
  color: var(--md-on-surface);
}
</style>