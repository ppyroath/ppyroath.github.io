<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <header>
      <div class="header-content">
        <div class="title-area">
          <router-link to="/" class="home-link">Pyroath</router-link>
        </div>
        <nav>
          <router-link to="/pgr">PGR</router-link>
          <router-link to="/wuwa">WuWa</router-link>
        </nav>
        <div class="controls-area">
          <button @click="toggleDarkMode" class="theme-toggle">
            <font-awesome-icon :icon="isDarkMode ? faSun : faMoon" />
          </button>
        </div>
      </div>
    </header>
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import Footer from './components/Footer.vue';
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

// --- drak mode logic ---
const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.className = isDarkMode.value ? 'dark-mode' : '';
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

onMounted(() => {
  setFavicon();
  //load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.body.className = 'dark-mode';
  }
});
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

header {
  background: var(--header-bg);
  color: var(--header-text);
  padding: 0 2em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 60px;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.title-area {
  position: absolute;
  left: 0;
}

.controls-area {
  position: absolute;
  right: 0;
}

.title-area .home-link {
  font-size: 1.4em;
  font-weight: bold;
  color: var(--text-color-primary);
  text-decoration: none;
}

nav a {
  font-weight: bold;
  color: var(--text-color-secondary);
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

nav a:hover {
  background-color: var(--hover-bg);
}

nav a.router-link-exact-active {
  color: var(--accent-color);
}

.theme-toggle {
  background: var(--button-bg);
  color: var(--button-text);
  border: 1px solid var(--border-color);
  width: 40px;
  height: 40px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.theme-toggle:hover {
  background: var(--hover-bg);
}
</style>
