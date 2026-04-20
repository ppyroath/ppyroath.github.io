<template>
  <div class="game-view">

    <!-- Page Header -->
    <div class="page-header">
      <span class="logo-mask logo-mask--pgr page-header__logo" aria-hidden="true"></span>
      <h1 class="page-title">Punishing: Gray Raven</h1>
    </div>

    <!-- Server Time Card -->
    <ServerTime :config="pgrServerConfig" />

    <!-- Event List -->
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
  dailyReset: '05:00',
};
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
</style>
