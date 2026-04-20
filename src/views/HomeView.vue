<template>
  <div class="home">

    <!-- Hero -->
    <div class="home-hero">
      <img :src="pyroathIcon" class="hero-logo" alt="Pyroath logo" />
      <h1 class="hero-title">Pyroath</h1>
      <p class="hero-subtitle">Patch info tracker for WuWa &amp; PGR</p>
    </div>

    <!-- Game Navigation Cards -->
    <div class="game-cards">

      <router-link to="/wuwa" class="game-card game-card--wuwa">
        <div class="game-card__icon-wrap">
          <span class="logo-mask logo-mask--wuwa game-card__icon" aria-hidden="true"></span>
        </div>
        <div class="game-card__body">
          <div class="game-card__name">Wuthering Waves</div>
          <div class="game-card__cta">View events</div>
        </div>
        <svg class="game-card__arrow" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
        </svg>
      </router-link>

      <router-link to="/pgr" class="game-card game-card--pgr">
        <div class="game-card__icon-wrap">
          <span class="logo-mask logo-mask--pgr game-card__icon" aria-hidden="true"></span>
        </div>
        <div class="game-card__body">
          <div class="game-card__name">Punishing: Gray Raven</div>
          <div class="game-card__cta">View events</div>
        </div>
        <svg class="game-card__arrow" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
        </svg>
      </router-link>

    </div>

    <!-- Credits -->
    <div class="credits">
      <p>
        Made with
        <img :src="vueLogo" alt="Vue" class="credit-logo" />
        by <a href="https://vermilion10.pages.dev/" target="_blank" rel="noopener noreferrer">vermilion10</a>
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import pyroathIcon from '../assets/images/pyroath.svg';
import vueLogo from '../assets/vue-logo.svg';
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 0 16px;
}

.home-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 36px;
  text-align: center;
}

.hero-logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  filter: drop-shadow(0 0 18px rgba(103, 212, 248, 0.25));
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--md-on-surface);
}

.hero-subtitle {
  font-size: 0.9rem;
  color: var(--md-on-surface-variant);
  font-weight: 500;
}

.game-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 420px;
}

.game-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: var(--md-on-surface);
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.game-card--wuwa::before {
  background: radial-gradient(circle at left center, rgba(103, 212, 248, 0.1), transparent 60%);
}

.game-card--pgr::before {
  background: radial-gradient(circle at left center, rgba(242, 139, 130, 0.1), transparent 60%);
}

.game-card:hover::before {
  opacity: 1;
}

.game-card:hover {
  background: var(--md-surface-container-high);
  transform: translateY(-1px);
  box-shadow: var(--elev-2);
}

.game-card__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.game-card--wuwa .game-card__icon-wrap {
  background: var(--wuwa-primary-container);
  color: var(--wuwa-primary);
}

.game-card--pgr .game-card__icon-wrap {
  background: var(--pgr-primary-container);
  color: var(--pgr-primary);
}

.game-card__icon {
  width: 26px;
  height: 26px;
}

.game-card__body {
  flex: 1;
}

.game-card__name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--md-on-surface);
  line-height: 1.3;
}

.game-card__cta {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--md-on-surface-variant);
  margin-top: 2px;
}

.game-card__arrow {
  width: 20px;
  height: 20px;
  color: var(--md-on-surface-dim);
  flex-shrink: 0;
  transition: transform 0.2s ease, color 0.2s ease;
}

.game-card:hover .game-card__arrow {
  color: var(--md-on-surface-variant);
  transform: translateX(2px);
}

.credits {
  margin-top: auto;
  padding-top: 32px;
}

.credits p {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--md-on-surface-variant);
}

.credits a {
  color: var(--md-on-surface-variant);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.credits a:hover {
  color: var(--md-on-surface);
}

.credit-logo {
  height: 14px;
  width: auto;
  vertical-align: middle;
  opacity: 0.7;
}

.logo-mask--wuwa {
  -webkit-mask-image: url('../assets/images/wuwa-logo.svg');
  mask-image: url('../assets/images/wuwa-logo.svg');
}
.logo-mask--pgr {
  -webkit-mask-image: url('../assets/images/pgr-logo.svg');
  mask-image: url('../assets/images/pgr-logo.svg');
}
</style>