<template>
  <div class="home">
    <div class="home-content">
      <h1>PGR & WuWa Game Info</h1>
      <p>Select a game to see the server time and event list.</p>
      <div class="credits">
        <p>
          Made with
          <img src="../assets/vue-logo.svg" alt="Vue Logo" class="credit-logo">
          <span class="heart">&hearts;</span>
          by <a href="https://vermilion10.pages.dev/" target="_blank" rel="noopener noreferrer">vermilion10</a>
        </p>
      </div>
      <p class="disclaimer">In case of an investigation by any federal entity or similar, 
        I do not have any involvement with this group or with the people in it, I do not know how I am here, 
        probably added by a third party, I do not support any actions by the member of this group.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 20px;
}

.home-content {
  text-align: center;
  max-width: 400px;
}

.home h1 {
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 12px;
}

.home p {
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
}

.home a {
  color: var(--accent-wuwa);
  text-decoration: none;
}

.home a:hover {
  text-decoration: underline;
}

.credits {
  margin-bottom: 24px;
}

.credits p {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}

.credit-logo {
  height: 0.6em;
  width: auto;
  vertical-align: middle;
}

.heart {
  color: #e25555;
}

.disclaimer {
  font-size: 0.8em;
  color: var(--text-secondary);
  opacity: 0.6;
  line-height: 1.6;
}
</style>