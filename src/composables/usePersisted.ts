import { reactive, watch } from 'vue';

/**
 * A reactive object that is saved to localStorage and restored on the next
 * visit. Saved keys that no longer exist in `defaults` are ignored, and any
 * value with a different type falls back to the default.
 */
export function usePersisted<T extends object>(key: string, defaults: T): T {
  const state = reactive(structuredClone(defaults)) as T;

  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (saved && typeof saved === 'object') {
      for (const k of Object.keys(defaults) as (keyof T)[]) {
        const value = saved[k as string];
        if (value !== undefined && typeof value === typeof defaults[k]) {
          state[k] = value;
        }
      }
    }
  } catch { /* storage blocked or corrupt; keep defaults */ }

  watch(state, (value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
  }, { deep: true });

  return state;
}
