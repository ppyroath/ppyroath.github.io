<template>
  <div class="segmented" role="radiogroup" :aria-label="label" @keydown="onKeydown">
    <button
      v-for="option in options"
      :key="option"
      ref="buttons"
      type="button"
      role="radio"
      class="segment"
      :aria-checked="modelValue === option"
      :tabindex="modelValue === option ? 0 : -1"
      @click="emit('update:modelValue', option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: string[];
  label: string;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const buttons = ref<HTMLButtonElement[]>([]);

// Arrow keys move the selection, per the WAI-ARIA radio group pattern.
const onKeydown = async (e: KeyboardEvent) => {
  const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
  const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
  if (!forward && !back) return;
  e.preventDefault();
  const n = props.options.length;
  const i = props.options.indexOf(props.modelValue);
  const next = forward ? (i + 1) % n : (i - 1 + n) % n;
  emit('update:modelValue', props.options[next]);
  await nextTick();
  buttons.value[next]?.focus();
};
</script>

<style scoped>
.segmented {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.segment {
  height: 36px;
  padding: 0 12px;
  border: none;
  background: var(--bg);
  color: var(--muted-fg);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
}

.segment + .segment {
  border-left: 1px solid var(--border);
}

.segment:hover {
  background: var(--muted);
  color: var(--fg);
}

.segment[aria-checked='true'] {
  background: var(--primary-soft);
  color: var(--fg);
}

.segment:focus-visible {
  outline-offset: -2px;
}

/* Touch screens get 44px tap targets */
@media (pointer: coarse) {
  .segment { height: 44px; }
}
</style>
