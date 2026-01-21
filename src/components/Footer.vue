<template>
  <footer class="app-footer">
    <p>&Omicron; 2026 Pyroath</p>
    <p>
      Not affiliated with Kuro Games. All assets belong to their respective owners.
    </p>
    <p>
      Preceded by <a href="https://pgrnow.github.io/" target="_blank" rel="noopener noreferrer">PGRNow</a>
    </p>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-footer {
  background-color: var(--header-bg);
  color: var(--text-color-secondary);
  padding: 20px;
  text-align: center;
  border-top: 1px solid var(--border-color);
  margin-top: 40px;
  font-size: 0.9em;
}

.app-footer p {
  margin: 5px 0;
}

.app-footer a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: bold;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
