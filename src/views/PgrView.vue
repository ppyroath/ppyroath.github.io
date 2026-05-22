<template>
  <div class="game-view">

    <!-- Page Header -->
    <div class="page-header">
      <span class="logo-mask logo-mask--pgr page-header__logo" aria-hidden="true"></span>
      <h1 class="page-title">Punishing: Gray Raven</h1>
    </div>

    <!-- Server Time Card -->
    <ServerTime :config="pgrServerConfig" />

    <!-- Show My Local Time Toggle -->
    <div class="browser-time-toggle">
      <label class="toggle-label">
        <span class="toggle-label-text">Show My Local Time</span>
        <div class="toggle-track" :class="{ active: showBrowserTime }" @click="showBrowserTime = !showBrowserTime">
          <div class="toggle-thumb"></div>
        </div>
      </label>
    </div>

    <!-- Event List -->
    <EventList :events="pgrEvents" :timelineData="pgrTimelineData" timezone="Etc/UTC" serverTimezone="UTC" :showBrowserTime="showBrowserTime" gameTimezone="Etc/UTC" />

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import EventList from '../components/EventList.vue';
import ServerTime from '../components/ServerTime.vue';
import { pgrEvents } from '../data/pgrEvents';
import { pgrTimelineData } from '../data/pgrTimeline';

const pgrServerConfig = {
  name: 'Global',
  timezone: 'Etc/UTC',
  dailyReset: '05:00',
};

const showBrowserTime = ref(false);

onMounted(() => {
  const saved = localStorage.getItem('pgrShowBrowserTime');
  if (saved !== null) showBrowserTime.value = saved === 'true';
});

watch(showBrowserTime, (v) => {
  localStorage.setItem('pgrShowBrowserTime', String(v));
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

.logo-mask--pgr {
  -webkit-mask-image: url('../assets/images/pgr-logo.svg');
  mask-image: url('../assets/images/pgr-logo.svg');
}

.page-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--md-on-surface);
  letter-spacing: -0.01em;
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
