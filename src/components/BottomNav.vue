<template>
  <nav class="bottom-nav" aria-label="Main">
    <router-link
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="[`nav-item--${item.key}`, { active: isActive(item.path) }]"
      :aria-current="isActive(item.path) ? 'page' : undefined"
    >
      <svg v-if="item.key === 'home'" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
      <span v-else class="logo-mask nav-icon" :class="`logo-mask--${item.key}`" aria-hidden="true"></span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const items = [
  { key: 'home', path: '/',     label: 'Home' },
  { key: 'wuwa', path: '/wuwa', label: 'WuWa' },
  { key: 'pgr',  path: '/pgr',  label: 'PGR' },
];

const isActive = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  height: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: var(--bg);
  border-top: 1px solid var(--border);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--muted-fg);
  font-size: 12px;
  font-weight: 600;
  transition: color 0.15s ease;
}

.nav-item.active {
  color: var(--fg);
}

.nav-icon {
  width: 22px;
  height: 22px;
}

.nav-icon.logo-mask {
  width: 44px;
}

.nav-item--wuwa.active .nav-icon { color: var(--wuwa); }
.nav-item--pgr.active .nav-icon  { color: var(--pgr); }

.nav-item:focus-visible {
  outline-offset: -4px;
}

@media (min-width: 720px) {
  .bottom-nav {
    display: none;
  }
}
</style>
