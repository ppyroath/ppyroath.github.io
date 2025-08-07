<template>
  <div class="home">
    <h1>PGR &amp; WuWa Game Info</h1>
    <p>Select a game to see the server time and event list.</p>
    <div class="credits">
      <p>
        Made with
        <img src="../assets/vue-logo.svg" alt="Vue Logo" class="credit-logo">
        <span class="heart">&hearts;</span>
        by <a href="https://github.com/vermilion10/" target="_blank" rel="noopener noreferrer">vermilion10</a>
      </p>
    </div>
    <p style="font-weight: 200; color: lightslategray;">In case of an investigation by any federal entity or similar, 
      I do not have any involvement with this group or with the people in it, I do not know how I am here, 
      probably added by a thrid party, I do not support any actions by the member of this group.
    </p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  text-align: center;
  padding: 50px;
}

.home a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: normal;
}

.home a:hover {
  text-decoration: underline;
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
</style>
