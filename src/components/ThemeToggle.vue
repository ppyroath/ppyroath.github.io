<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="`Theme: ${labels[pref]}. Switch to ${labels[nextPref]}`"
    :title="`Theme: ${labels[pref]}`"
    @click="cycle"
  >
    <!-- system -->
    <svg v-if="pref === 'system'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>
    <!-- light -->
    <svg v-else-if="pref === 'light'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
    <!-- dark -->
    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme, type ThemePref } from '../composables/useTheme';

const { pref, cycle } = useTheme();

const labels: Record<ThemePref, string> = { system: 'System', light: 'Light', dark: 'Dark' };
const order: ThemePref[] = ['system', 'light', 'dark'];
const nextPref = computed(() => order[(order.indexOf(pref.value) + 1) % order.length]);
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg);
  color: var(--fg);
  transition: background 0.15s ease;
}

.theme-toggle:hover {
  background: var(--muted);
}

.theme-toggle svg {
  width: 18px;
  height: 18px;
}

/* Touch screens get 44px tap targets */
@media (pointer: coarse) {
  .theme-toggle { width: 44px; height: 44px; }
}
</style>
