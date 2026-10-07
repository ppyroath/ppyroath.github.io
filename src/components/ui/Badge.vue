<template>
  <span class="badge" :class="`badge--${variant}`"><slot /></span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline';
}>(), { variant: 'secondary' });
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.badge--primary {
  background: var(--primary);
  color: var(--primary-fg);
}

.badge--secondary {
  background: var(--muted);
  color: var(--fg);
}

.badge--outline {
  border-color: var(--border);
  color: var(--fg);
}
</style>
