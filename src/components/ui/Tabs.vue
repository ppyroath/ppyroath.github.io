<template>
  <div class="tabs" role="tablist" :aria-label="label" @keydown="onKeydown">
    <button
      v-for="item in items"
      :key="item.value"
      :id="`${idPrefix}-tab-${item.value}`"
      ref="buttons"
      type="button"
      role="tab"
      class="tab"
      :aria-selected="modelValue === item.value"
      :aria-controls="`${idPrefix}-panel-${item.value}`"
      :tabindex="modelValue === item.value ? 0 : -1"
      @click="emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const props = defineProps<{
  modelValue: string;
  items: { value: string; label: string }[];
  label: string;
  idPrefix: string;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const buttons = ref<HTMLButtonElement[]>([]);

// Arrow keys move between tabs, per the WAI-ARIA tabs pattern.
const onKeydown = async (e: KeyboardEvent) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!keys.includes(e.key)) return;
  e.preventDefault();
  const i = props.items.findIndex(t => t.value === props.modelValue);
  const n = props.items.length;
  const next =
    e.key === 'ArrowRight' ? (i + 1) % n :
    e.key === 'ArrowLeft'  ? (i - 1 + n) % n :
    e.key === 'Home'       ? 0 : n - 1;
  emit('update:modelValue', props.items[next].value);
  await nextTick();
  buttons.value[next]?.focus();
};
</script>

<style scoped>
.tabs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: var(--muted);
  border-radius: var(--radius-lg);
}

.tab {
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--muted-fg);
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
}

.tab:hover {
  color: var(--fg);
}

.tab[aria-selected='true'] {
  background: var(--bg);
  color: var(--fg);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
}

/* Touch screens get 44px tap targets */
@media (pointer: coarse) {
  .tab { height: 44px; }
}
</style>
