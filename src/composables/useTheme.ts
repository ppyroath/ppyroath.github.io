import { ref, watch } from 'vue';

export type ThemePref = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');

const readPref = (): ThemePref => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch { /* storage blocked */ }
  return 'system';
};

const pref = ref<ThemePref>(readPref());

const apply = () => {
  const dark = pref.value === 'dark' || (pref.value === 'system' && media.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
};

watch(pref, (value) => {
  try { localStorage.setItem(STORAGE_KEY, value); } catch { /* storage blocked */ }
  apply();
});

media.addEventListener('change', apply);
apply();

const ORDER: ThemePref[] = ['system', 'light', 'dark'];

export function useTheme() {
  const cycle = () => {
    pref.value = ORDER[(ORDER.indexOf(pref.value) + 1) % ORDER.length];
  };
  return { pref, cycle };
}
