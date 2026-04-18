<template>
  <div id="app">
    <main>
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
import { onMounted } from 'vue';
import BottomNav from './components/BottomNav.vue';
import pyroathIcon from './assets/images/pyroath.svg';

const setFavicon = () => {
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = pyroathIcon;
};

onMounted(() => {
  setFavicon();
});
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-primary);
}

main {
  flex: 1;
  padding: 16px;
  padding-bottom: 80px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>