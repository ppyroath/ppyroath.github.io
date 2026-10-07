<template>
  <div class="game-view">
    <header class="page-header">
      <div class="page-header__title">
        <span class="logo-mask logo-mask--pgr page-header__logo" aria-hidden="true"></span>
        <h1 class="page-title">Punishing: Gray Raven</h1>
      </div>
      <Tabs v-model="currentTab" :items="tabs" label="Punishing: Gray Raven sections" id-prefix="pgr" />
    </header>

    <ServerTime :config="pgrServerConfig" />

    <div
      v-if="currentTab === 'events'"
      id="pgr-panel-events"
      role="tabpanel"
      aria-labelledby="pgr-tab-events"
    >
      <div class="toolbar toolbar--end">
        <Switch v-model="showBrowserTime" label="Show my local time" id="pgr-local-time" />
      </div>

      <EventList
        :events="pgrEvents"
        :timelineData="pgrTimelineData"
        timezone="Etc/UTC"
        serverTimezone="UTC"
        :showBrowserTime="showBrowserTime"
        gameTimezone="Etc/UTC"
      />
    </div>

    <div
      v-else
      id="pgr-panel-tools"
      role="tabpanel"
      aria-labelledby="pgr-tab-tools"
    >
      <PgrTools />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import EventList from '../components/EventList.vue';
import ServerTime from '../components/ServerTime.vue';
import PgrTools from '../components/PgrTools.vue';
import Tabs from '../components/ui/Tabs.vue';
import Switch from '../components/ui/Switch.vue';
import { pgrEvents } from '../data/pgrEvents';
import { pgrTimelineData } from '../data/pgrTimeline';

const pgrServerConfig = {
  name: 'Global',
  timezone: 'Etc/UTC',
  dailyReset: '05:00',
};

const showBrowserTime = ref(false);
const currentTab = ref('events');
const tabs = [
  { value: 'events', label: 'Events' },
  { value: 'tools',  label: 'Tools' },
];

onMounted(() => {
  const saved = localStorage.getItem('pgrShowBrowserTime');
  if (saved !== null) showBrowserTime.value = saved === 'true';
});

watch(showBrowserTime, (v) => {
  localStorage.setItem('pgrShowBrowserTime', String(v));
});
</script>

<style scoped src="./game-view.css"></style>
