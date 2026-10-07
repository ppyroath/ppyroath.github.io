<template>
  <header class="app-header">
    <div class="app-header__inner">
      <router-link to="/" class="brand">
        <img :src="pyroathIcon" alt="" class="brand__logo" />
        <span class="brand__name">Pyroath</span>
      </router-link>

      <nav class="header-nav" aria-label="Games">
        <router-link
          v-for="game in games"
          :key="game.path"
          :to="game.path"
          class="header-nav__link"
          active-class="is-active"
        >
          {{ game.label }}
        </router-link>
      </nav>

      <ThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import pyroathIcon from '../assets/images/pyroath.png';
import ThemeToggle from './ThemeToggle.vue';

const games = [
  { key: 'wuwa', path: '/wuwa', label: 'Wuthering Waves' },
  { key: 'pgr',  path: '/pgr',  label: 'Punishing: Gray Raven' },
];
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-h);
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 0 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -0.02em;
}

.brand__logo {
  width: 24px;
  height: 24px;
}

.header-nav {
  display: none;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  flex: 1;
}

.header-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  color: var(--muted-fg);
  transition: background 0.15s ease, color 0.15s ease;
}

.header-nav__link:hover {
  color: var(--fg);
  background: var(--muted);
}

.header-nav__link.is-active {
  color: var(--fg);
  background: var(--muted);
}

.app-header :deep(.theme-toggle) {
  margin-left: auto;
}

@media (min-width: 720px) {
  .header-nav {
    display: flex;
  }
  .app-header :deep(.theme-toggle) {
    margin-left: 0;
  }
}
</style>
