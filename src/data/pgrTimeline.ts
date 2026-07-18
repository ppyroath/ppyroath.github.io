import type { PatchTimeline } from './wuwaTimeline';

export const pgrTimelineData: PatchTimeline[] = [
  {
  patchName: "Of Solitude and Stillness",
  patchVersion: "Global",
  startTime: "2026-07-17T05:00:00Z",
  endTime: "2026-08-19T05:00:00Z", // ESTIMATED — see note above
  events: [
    {
      name: "Crucible Event Construct: Helentine: Lacrimosa",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T23:00:00Z",
      type: 'gacha',
      description: "New S-Rank Omniframe Research (100% rate on S-Rank pull)"
    },
    {
      name: "Target Weapon: Hear the Bell",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T23:00:00Z",
      type: 'gacha',
      description: "New 6★ Weapon Research (Lacrimosa Exclusive)"
    },
    {
      name: "CUB Target: Grand Duke",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T23:00:00Z",
      type: 'gacha',
      description: "New S-Rank CUB Research (100% rate on S-Rank pull)"
    },
    {
      name: "New Coatings (Azure Embrace, Serenading Waves, Shimmering Tide, Summer Strings, Final Alternate Coating)",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T23:00:00Z",
      type: 'event',
      description: "New cosmetic coatings available for purchase with Rainbow Cards"
    },
    {
      name: "Coating Rerun: Unending Pursuit & Argent Radiance",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T23:00:00Z",
      type: 'event',
      description: "Rerun coating for Kamui: Aeternion + a weapon coating"
    },
    {
      name: "Neon Tidings Coating Rerun Event",
      startTime: "2026-07-24T10:00:00Z",
      endTime: "2026-09-23T23:00:00Z",
      type: 'event',
      description: "Rerun of past character/weapon coatings via Rainbow Cards"
    },
    {
      name: "Tactical Assessment Manual: The Podesta Tide File",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T23:00:00Z",
      type: 'event',
      description: "Battle-pass-style rating missions; paid tiers (Encrypted/Top-Secret Intel) available"
    },
    {
      name: "Service Shop: Limited Missions",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-19T05:00:00Z",
      type: 'event',
      description: "Earn Service Certificates x2,500 via limited missions this version"
    },
    {
      name: "Floating Record: Of Solitude and Stillness",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-19T05:00:00Z", // ESTIMATED — no explicit end date in article
      type: 'event',
      description: "Requirement: Clear Main Story 1-12"
    },
    {
      name: "The Knower's Dilemma: Character Trial Stage",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T23:00:00Z",
      type: 'event',
      description: "Trial stage for Helentine: Lacrimosa. Requirement: Clear Normal Story 1-8"
    },
    {
      name: "7-Day Sign-in Rewards",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T05:00:00Z",
      type: 'event',
      description: "Sign in 7 days to claim rewards. Requirement: Commandant Lv.20+"
    },
    {
      name: "Simulation Shop - New Arrivals",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-19T05:00:00Z", // ESTIMATED — no explicit end date in article
      type: 'event',
      description: "New Arrivals: 6★ Memory [Cogito]. Requirement: Commandant Lv.16+ and cleared Normal Story 1-12"
    },
    {
      name: "Journal of Promise: The Knower's Dilemma",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T05:00:00Z",
      type: 'event',
      description: "Clear to obtain Helentine: Lacrimosa x1 for free"
    },
    {
      name: "Shrouded Requiem: New Content",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-09-23T05:00:00Z",
      type: 'event',
      description: "Phantom Clash mode, Nightshroud Tales (Kamui story), Labyrinth Breakout Difficulty 5. Requirement: Commandant Lv.40+"
    },
    {
      name: "Bier's Echoes: Boss Challenge",
      startTime: "2026-07-18T10:00:00Z",
      endTime: "2026-08-10T05:00:00Z",
      type: 'event',
      description: "Boss challenge vs Tavis Spelmin, 6 difficulty tiers. Requirement: Commandant Lv.40+"
    },
    {
      name: "Tidal Wishes",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-09-23T23:00:00Z",
      type: 'event',
      description: "Story event, 5 chapters (Selena & Helentine open first). Requirement: Commandant Lv.40+"
    },
    {
      name: "Tidal Wishes: Teddy & Bianca Chapters",
      startTime: "2026-08-19T05:00:00Z",
      endTime: "2026-09-23T23:00:00Z",
      type: 'event',
      description: "Teddy and Bianca story chapters unlock (staggered release)"
    },
    {
      name: "Trial of Simulacrums",
      startTime: "2026-07-17T05:00:00Z",
      endTime: "2026-08-18T05:00:00Z",
      type: 'event',
      description: "Climbing challenge with designated trial characters. Requirement: Commandant Lv.40+"
    },
    {
      name: "Shattered Mirage",
      startTime: "2026-07-24T10:00:00Z",
      endTime: "2026-08-18T05:00:00Z",
      type: 'event',
      description: "4-chapter challenge event with overclock buffs. Requirement: Commandant Lv.40+"
    },
    {
      name: "Huhu's Fantastic Garden",
      startTime: "2026-07-24T10:00:00Z",
      endTime: "2026-08-18T05:00:00Z",
      type: 'event',
      description: "Garden decoration event. Requirement: Commandant Lv.40+"
    },
  ]
},
];
