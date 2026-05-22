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

    <!-- Show My Local Time Toggle -->
    <div class="browser-time-toggle">
      <label class="toggle-label" :for="'browser-time-wuwa'">
        <span class="toggle-label-text">Show My Local Time</span>
        <div class="toggle-track" :class="{ active: showBrowserTime }" @click="showBrowserTime = !showBrowserTime">
          <div class="toggle-thumb"></div>
        </div>
      </label>
    </div>

    <!-- Event List -->
    <EventList
      :events="wuwaEvents"
      :timelineData="wuwaTimelineData"
      :timezone="currentServerConfig.timezone"
      :serverTimezone="serverTimezoneLabel"
      :showBrowserTime="showBrowserTime"
      gameTimezone="Etc/GMT-8"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import EventList from '../components/EventList.vue';
import ServerTime from '../components/ServerTime.vue';
import { wuwaEvents } from '../data/wuwaEvents';
import { wuwaTimelineData } from '../data/wuwaTimeline';

const wuwaServerConfigs = {
  America: { name: 'America', timezone: 'Etc/GMT+5', dailyReset: '04:00' },
  Asia:    { name: 'Asia',    timezone: 'Etc/GMT-8', dailyReset: '04:00' },
  Europe:  { name: 'Europe',  timezone: 'Etc/GMT-1', dailyReset: '04:00' },
  SEA:     { name: 'SEA',     timezone: 'Etc/GMT-8', dailyReset: '04:00' },
};

const selectedServer = ref('SEA');
const showBrowserTime = ref(false);

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
  const savedBrowserTime = localStorage.getItem('wuwaShowBrowserTime');
  if (savedBrowserTime !== null) {
    showBrowserTime.value = savedBrowserTime === 'true';
  }
});

watch(selectedServer, (newServer) => {
  localStorage.setItem('wuwaServer', newServer);
});

watch(showBrowserTime, (v) => {
  localStorage.setItem('wuwaShowBrowserTime', String(v));
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
  margin-bottom: 12px;
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

/* ── Browser-time toggle ── */
.browser-time-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.toggle-label-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  transition: color 0.2s ease;
}

.toggle-track {
  width: 38px;
  height: 22px;
  border-radius: var(--radius-full);
  background: var(--md-surface-container-high);
  border: 1px solid var(--md-outline-variant);
  position: relative;
  transition: background 0.25s ease, border-color 0.25s ease;
  flex-shrink: 0;
}

.toggle-track.active {
  background: var(--md-primary);
  border-color: var(--md-primary);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--md-on-surface-variant);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s ease;
}

.toggle-track.active .toggle-thumb {
  transform: translateX(16px);
  background: var(--md-on-primary);
}

.toggle-label:hover .toggle-label-text {
  color: var(--md-on-surface);
}
</style>