<template>
  <div class="home">
    <header class="home-intro">
      <h1 class="home-title">Pyroath</h1>
      <p class="home-lead">Event timers, server resets and patch schedules for Wuthering Waves and Punishing: Gray Raven.</p>
    </header>

    <ul class="game-list">
      <li v-for="game in games" :key="game.key">
        <router-link :to="game.path" class="game-row" :class="`game-row--${game.key}`">
          <span class="game-row__icon">
            <span class="logo-mask" :class="`logo-mask--${game.key}`" aria-hidden="true"></span>
          </span>
          <span class="game-row__body">
            <span class="game-row__name">{{ game.name }}</span>
            <span v-if="game.patch" class="game-row__patch">
              {{ game.patch.running ? game.patch.name : `Last patch: ${game.patch.name}` }}
            </span>
          </span>
          <span class="game-row__meta tabular">
            {{ game.running === 0 ? 'Nothing running' : `${game.running} running` }}
          </span>
          <svg class="game-row__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </router-link>
      </li>
    </ul>

    <footer class="credits">
      Made with
      <img :src="vueLogo" alt="Vue" class="credit-logo" />
      by <a href="https://vermilion10.pages.dev/" target="_blank" rel="noopener noreferrer">vermilion10</a>.
      Preceded by <a href="https://pgrnow.github.io" target="_blank" rel="noopener noreferrer">PGRNow</a>.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import vueLogo from '../assets/vue-logo.svg';
import { wuwaEvents } from '../data/wuwaEvents';
import { pgrEvents } from '../data/pgrEvents';
import { wuwaTimelineData } from '../data/wuwaTimeline';
import { pgrTimelineData } from '../data/pgrTimeline';
import type { GameEvent } from '../data/pgrEvents';
import type { PatchTimeline } from '../data/wuwaTimeline';

dayjs.extend(utc);

const now = dayjs();
const isRunning = (start: string, end: string) =>
  now.isAfter(dayjs.utc(start)) && now.isBefore(dayjs.utc(end));

const countRunning = (events: GameEvent[]) =>
  events.filter(e => isRunning(e.startTime, e.endTime)).length;

const currentPatch = (timeline: PatchTimeline[]) => {
  const running = timeline.find(p => isRunning(p.startTime, p.endTime));
  const patch = running ?? timeline[0];
  return patch ? { name: patch.patchName, running: Boolean(running) } : null;
};

const games = computed(() => [
  {
    key: 'wuwa',
    path: '/wuwa',
    name: 'Wuthering Waves',
    patch: currentPatch(wuwaTimelineData),
    running: countRunning(wuwaEvents),
  },
  {
    key: 'pgr',
    path: '/pgr',
    name: 'Punishing: Gray Raven',
    patch: currentPatch(pgrTimelineData),
    running: countRunning(pgrEvents),
  },
]);
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 560px;
  margin: 0 auto;
}

.home-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.home-lead {
  margin-top: 8px;
  font-size: 15px;
  color: var(--muted-fg);
  max-width: 44ch;
}

.game-list {
  list-style: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--card);
  overflow: hidden;
}

.game-list li + li {
  border-top: 1px solid var(--border);
}

.game-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  min-height: 72px;
  transition: background 0.15s ease;
}

.game-row:hover {
  background: var(--muted);
}

.game-row:focus-visible {
  outline-offset: -2px;
}

.game-row__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 44px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.game-row__icon .logo-mask {
  width: 52px;
  height: 30px;
}

.game-row--wuwa .game-row__icon { color: var(--wuwa); }
.game-row--pgr .game-row__icon  { color: var(--pgr); }

.game-row__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.game-row__name {
  font-weight: 700;
  font-size: 15px;
}

.game-row__patch {
  font-size: 13px;
  color: var(--muted-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game-row__meta {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted-fg);
  white-space: nowrap;
}

.game-row__chevron {
  width: 18px;
  height: 18px;
  color: var(--muted-fg);
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .game-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      "icon body chevron"
      "icon meta chevron";
    row-gap: 2px;
  }
  .game-row__icon    { grid-area: icon; }
  .game-row__body    { grid-area: body; }
  .game-row__meta    { grid-area: meta; font-weight: 500; }
  .game-row__chevron { grid-area: chevron; }
}

.credits {
  padding-top: 20px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--muted-fg);
}

.credits a {
  color: var(--fg);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--border);
}

.credits a:hover {
  text-decoration-color: currentColor;
}

.credit-logo {
  height: 13px;
  width: auto;
  vertical-align: -1px;
}
</style>
