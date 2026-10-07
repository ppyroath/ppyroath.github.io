<template>
  <div class="game-view">
    <header class="page-header">
      <div class="page-header__title">
        <span class="logo-mask logo-mask--wuwa page-header__logo" aria-hidden="true"></span>
        <h1 class="page-title">Wuthering Waves</h1>
      </div>
      <Tabs v-model="currentTab" :items="tabs" label="Wuthering Waves sections" id-prefix="wuwa" />
    </header>

    <ServerTime :config="currentServerConfig" />

    <div
      v-if="currentTab === 'events'"
      id="wuwa-panel-events"
      role="tabpanel"
      aria-labelledby="wuwa-tab-events"
    >
      <div class="toolbar">
        <SegmentedControl
          v-model="selectedServer"
          :options="Object.keys(wuwaServerConfigs)"
          label="Server"
          class="toolbar__servers"
        />
        <Switch v-model="showBrowserTime" label="Show my local time" id="wuwa-local-time" />
      </div>

      <EventList
        :events="wuwaEvents"
        :timelineData="wuwaTimelineData"
        :timezone="currentServerConfig.timezone"
        :serverTimezone="serverTimezoneLabel"
        :showBrowserTime="showBrowserTime"
        gameTimezone="Etc/GMT-8"
      />
    </div>

    <div
      v-else
      id="wuwa-panel-tools"
      role="tabpanel"
      aria-labelledby="wuwa-tab-tools"
    >
      <WuwaTools />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import EventList from '../components/EventList.vue';
import ServerTime from '../components/ServerTime.vue';
import WuwaTools from '../components/WuwaTools.vue';
import Tabs from '../components/ui/Tabs.vue';
import SegmentedControl from '../components/ui/SegmentedControl.vue';
import Switch from '../components/ui/Switch.vue';
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
const currentTab = ref('events');
const tabs = [
  { value: 'events', label: 'Events' },
  { value: 'tools',  label: 'Tools' },
];

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

<style scoped src="./game-view.css"></style>
