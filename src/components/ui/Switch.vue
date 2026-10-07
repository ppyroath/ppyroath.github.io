<template>
  <div class="switch-row">
    <label :for="id" class="switch-label">{{ label }}</label>
    <button
      :id="id"
      type="button"
      role="switch"
      class="switch"
      :aria-checked="modelValue"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span class="switch-thumb" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; id: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<style scoped>
.switch-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
}

.switch-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--fg);
  cursor: pointer;
  user-select: none;
}

.switch {
  position: relative;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 999px;
  border: none;
  background: var(--input);
  transition: background 0.15s ease;
}

.switch[aria-checked='true'] {
  background: var(--primary);
}

/* Invisible padding brings the hit area to 44px tall */
.switch::before {
  content: "";
  position: absolute;
  inset: -12px -4px;
}

.switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  transition: transform 0.15s ease;
}

.switch[aria-checked='true'] .switch-thumb {
  transform: translateX(16px);
  background: var(--primary-fg);
}
</style>
