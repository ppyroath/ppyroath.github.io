<template>
  <div id="app" :class="gameClass">
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
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BottomNav from './components/BottomNav.vue';
import pyroathIcon from './assets/images/pyroath.svg';

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
  link.type = 'image/svg+xml';
  link.href = pyroathIcon;
};

onMounted(() => {
  setFavicon();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>