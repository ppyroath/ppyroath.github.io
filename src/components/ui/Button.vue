<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : type"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'icon';
  href?: string;
  external?: boolean;
  type?: 'button' | 'submit';
}>(), {
  variant: 'default',
  size: 'md',
  type: 'button',
});
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.btn--md   { height: 36px; padding: 0 14px; }
.btn--sm   { height: 32px; padding: 0 10px; font-size: 13px; }
.btn--icon { height: 36px; width: 36px; padding: 0; }

.btn--default {
  background: var(--primary);
  color: var(--primary-fg);
}
.btn--default:hover { background: color-mix(in srgb, var(--primary) 88%, var(--bg)); }

.btn--secondary {
  background: var(--muted);
  color: var(--fg);
}
.btn--secondary:hover { background: var(--border); }

.btn--outline {
  background: var(--bg);
  border-color: var(--border);
  color: var(--fg);
}
.btn--outline:hover { background: var(--muted); }

.btn--ghost {
  background: transparent;
  color: var(--fg);
}
.btn--ghost:hover { background: var(--muted); }

.btn :deep(svg) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Touch screens get 44px tap targets */
@media (pointer: coarse) {
  .btn--md, .btn--sm { height: 44px; }
  .btn--icon { height: 44px; width: 44px; }
}
</style>
