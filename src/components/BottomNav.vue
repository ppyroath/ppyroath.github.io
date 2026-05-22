<template>
  <nav class="bottom-nav">

    <!-- Home -->
    <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
      <div class="nav-indicator">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path v-if="isActive('/')"
            d="M10 20v-6h4v6h5v-8h3L12 2 2 12h3v8z" />
          <path v-else
            d="M12 2.1L2 12h3v8h6v-5h2v5h6v-8h3L12 2.1zm0 2.83L19 12h-1v7h-4v-5H10v5H6v-7H5L12 4.93z" />
        </svg>
      </div>
    </router-link>

    <!-- PGR -->
    <router-link to="/pgr" class="nav-item nav-item--pgr" :class="{ active: isActive('/pgr') }">
      <div class="nav-indicator">
        <span class="logo-mask logo-mask--pgr nav-logo-icon" aria-hidden="true"></span>
      </div>
    </router-link>

    <!-- WuWa -->
    <router-link to="/wuwa" class="nav-item nav-item--wuwa" :class="{ active: isActive('/wuwa') }">
      <div class="nav-indicator">
        <span class="logo-mask logo-mask--wuwa nav-logo-icon" aria-hidden="true"></span>
      </div>
    </router-link>

  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

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
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  height: 80px;
  padding-bottom: env(safe-area-inset-bottom, 0);
  background: var(--md-surface-container);
  border-top: 1px solid var(--md-outline-variant);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-decoration: none;
  color: var(--md-on-surface-variant);
  gap: 4px;
  padding: 10px 4px 8px;
  transition: color 0.2s ease;
}

.nav-item.active {
  color: var(--md-on-surface);
}

.nav-item--pgr.active {
  color: var(--pgr-primary);
}
.nav-item--wuwa.active {
  color: var(--wuwa-primary);
}

.nav-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 32px;
  border-radius: var(--radius-full);
  transition: background 0.25s ease;
}

.nav-item.active .nav-indicator {
  background: var(--md-primary-container);
}
.nav-item--pgr.active .nav-indicator {
  background: var(--pgr-primary-container);
}
.nav-item--wuwa.active .nav-indicator {
  background: var(--wuwa-primary-container);
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-logo-icon {
  width: 22px;
  height: 22px;
}

.logo-mask--pgr {
  -webkit-mask-image: url('../assets/images/pgr-logo.svg');
  mask-image: url('../assets/images/pgr-logo.svg');
}

.logo-mask--wuwa {
  -webkit-mask-image: url('../assets/images/wuwa-logo.svg');
  mask-image: url('../assets/images/wuwa-logo.svg');
}

</style>