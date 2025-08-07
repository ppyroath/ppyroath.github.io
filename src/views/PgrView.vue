<template>
  <div class="game-view">
    <ServerTime :config="pgrServerConfig" />
    <EventList :events="pgrEvents" timezone="Etc/UTC" serverTimezone="UTC" />
  </div>
</template>

<script setup lang="ts">
import EventList from '../components/EventList.vue';
import ServerTime from '../components/ServerTime.vue';
import { pgrEvents } from '../data/pgrEvents';

const pgrServerConfig = {
  name: 'Global',
  timezone: 'Etc/UTC',
  dailyReset: '07:00',
};
</script>

<style scoped>
.game-view {
  padding-top: 20px;
}
</style>
