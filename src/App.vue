<template>
  <div id="app" :class="gameClass">
    <AppHeader />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import BottomNav from './components/BottomNav.vue';
import pyroathIcon from './assets/images/pyroath.png';

const route = useRoute();

const gameClass = computed(() => {
  if (route.path.startsWith('/wuwa')) return 'game-wuwa';
  if (route.path.startsWith('/pgr')) return 'game-pgr';
  return '';
});

const setFavicon = () => {
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.type = 'image/png';
  link.href = pyroathIcon;
};

onMounted(() => {
  setFavicon();
});
</script>

<style scoped>
.app-main {
  flex: 1;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 20px 16px calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0px) + 24px);
  overflow-x: clip;
}

@media (min-width: 720px) {
  .app-main {
    padding: 32px 16px 48px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
