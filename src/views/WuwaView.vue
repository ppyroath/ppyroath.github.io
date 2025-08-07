<template>
  <div class="game-view">
    <ServerTime :config="currentServerConfig" />
    <div class="server-selector-wrapper">
      <label for="server-select">Select Server:</label>
      <select id="server-select" v-model="selectedServer" class="server-select">
        <option v-for="server in Object.keys(wuwaServerConfigs)" :key="server" :value="server">
          {{ server }}
        </option>
      </select>
    </div>
    <EventList :events="wuwaEvents" :timezone="currentServerConfig.timezone" :serverTimezone="serverTimezoneLabel" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import EventList from '../components/EventList.vue';
import ServerTime from '../components/ServerTime.vue';
import { wuwaEvents } from '../data/wuwaEvents';

const wuwaServerConfigs = {
  America: { name: 'America', timezone: 'Etc/GMT+5', dailyReset: '04:00' },
  Asia: { name: 'Asia', timezone: 'Etc/GMT-8', dailyReset: '04:00' },
  Europe: { name: 'Europe', timezone: 'Etc/GMT-1', dailyReset: '04:00' },
  SEA: { name: 'SEA', timezone: 'Etc/GMT-8', dailyReset: '04:00' },
};

const selectedServer = ref('SEA'); // default server

const currentServerConfig = computed(() => {
  return wuwaServerConfigs[selectedServer.value as keyof typeof wuwaServerConfigs];
});

const serverTimezoneLabel = computed(() => {
    const tz = currentServerConfig.value.timezone;
    if (tz === 'Etc/UTC') return 'UTC';
    // Etc/GMT-8 -> UTC+8, Etc/GMT+5 -> UTC-5
    const offset = tz.replace('Etc/GMT', '');
    if (offset.startsWith('-')) {
        return `UTC+${offset.substring(1)}`;
    }
    if (offset.startsWith('+')) {
        return `UTC-${offset.substring(1)}`;
    }
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
  padding-top: 20px;
}

.server-selector-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  background: var(--content-bg);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.server-selector-wrapper label {
  font-weight: bold;
  color: var(--text-color-primary);
}

.server-select {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  background: var(--main-bg);
  color: var(--text-color-primary);
  font-weight: bold;
}
</style>
