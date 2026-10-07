<template>
  <component :is="as" class="card">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ as?: string }>(), { as: 'section' });
</script>

<style scoped>
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  color: var(--fg);
}
</style>
