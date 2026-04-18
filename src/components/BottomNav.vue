<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 2 2 12h3v8z"/>
      </svg>
      <span class="nav-label">Home</span>
    </router-link>
    
    <router-link to="/pgr" class="nav-item" :class="{ active: isActive('/pgr') }">
      <img v-if="isActive('/pgr')" src="../assets/images/pgr-logo.svg" class="nav-logo" alt="PGR">
      <span v-else class="nav-text">PGR</span>
      <span class="nav-label">PGR</span>
    </router-link>
    
    <router-link to="/wuwa" class="nav-item" :class="{ active: isActive('/wuwa') }">
      <img v-if="isActive('/wuwa')" src="../assets/images/wuwa-logo.svg" class="nav-logo" alt="WuWa">
      <span v-else class="nav-text">WuWa</span>
      <span class="nav-label">WuWa</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px 0;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  min-height: 48px;
}

.nav-item.active {
  color: var(--accent-wuwa);
}

.nav-item.active[href*="pgr"] {
  color: var(--accent-pgr);
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.nav-text {
  font-size: 14px;
  font-weight: 600;
  opacity: 0;
  position: absolute;
}

.nav-label {
  font-size: 10px;
  margin-top: 2px;
  font-weight: 500;
}
</style>