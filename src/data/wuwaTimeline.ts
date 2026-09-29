export interface TimelineEvent {
  name: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  type: 'gacha' | 'event' | 'double-drop' | 'web';
  description?: string;
  link?: string;
}

export interface PatchTimeline {
  patchName: string;
  patchVersion: string;
  startTime: string;
  endTime: string;
  events: TimelineEvent[];
}

export const wuwaTimelineData: PatchTimeline[] = [
  {
  patchName: "Prism's Illusion, Heart's Illumination",
  patchVersion: "Global",
  startTime: "2026-09-30T03:00:00Z",
  endTime: "2026-11-12T03:00:00Z",
  events: [
  {
    name: 'As Full as Tonight, Forever (Hsin)',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-10-22T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Resonator Convene'
  },
  {
    name: 'Horizon of Dawnbreak (Chisa)',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-10-22T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Resonator Convene'
  },
  {
    name: "Across Time's Waxes and Wanes (Iuno)",
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-10-22T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Resonator Convene'
  },
  {
    name: 'Blooming Jadehaven',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-10-22T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Weapon Convene'
  },
  {
    name: 'Kumokiri',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-10-22T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Weapon Convene'
  },
  {
    name: "Moongazer's Sigil",
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-10-22T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Weapon Convene'
  },
  {
    name: 'Nine Deaths, One Unbent Heart (Suoming)',
    startTime: '2026-10-22T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Resonator Convene'
  },
  {
    name: 'Tomorrow in the Frame (Lucilla)',
    startTime: '2026-10-22T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Resonator Convene'
  },
  {
    name: 'Undefined Spectrum (Lynae)',
    startTime: '2026-10-22T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Resonator Convene'
  },
  {
    name: 'Unspoken Rue',
    startTime: '2026-10-22T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Weapon Convene'
  },
  {
    name: 'Freeze Frame',
    startTime: '2026-10-22T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Weapon Convene'
  },
  {
    name: 'Spectrum Blaster',
    startTime: '2026-10-22T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Weapon Convene'
  },
  {
    name: 'Chapter IV Act IV',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Main Quest Update'
  },
  {
    name: 'Moonlike Heart, Mortal Longing',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Tales Quest Update'
  },
  {
    name: 'Cubie Wars',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Dreams in the Capsule',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Past Dreams, Traced Seals',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Featured Event (Permanent)'
  },
  {
    name: 'Blooms for the Shadow',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Featured Event (Permanent)'
  },
  {
    name: 'Gifts of Waking Moon',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Featured Event / Login Event'
  },
  {
    name: 'Back to Solaris',
    startTime: '2026-09-30T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: "Artisan's Search",
    startTime: '2026-10-08T02:00:00Z',
    endTime: '2026-10-26T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Waking Moon Fishing',
    startTime: '2026-10-15T02:00:00Z',
    endTime: '2026-11-01T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Echo Erase',
    startTime: '2026-10-22T02:00:00Z',
    endTime: '2026-11-09T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Gifts of Singing Drizzle',
    startTime: '2026-10-22T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Featured Event / Login Event'
  },
  {
    name: 'Beyond the Waves: Land of Xuanfang',
    startTime: '2026-10-29T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Bountiful Crescendo',
    startTime: '2026-10-15T02:00:00Z',
    endTime: '2026-10-22T01:59:59Z',
    type: 'double-drop',
    description: 'Tacet Field Double Drop Event'
  },
  {
    name: 'Chord Cleansing',
    startTime: '2026-11-04T02:00:00Z',
    endTime: '2026-11-11T01:59:59Z',
    type: 'double-drop',
    description: 'Simulation Challenge Double Drop Event'
  },
    // --- Recurring Challenge ---
    // These run on their own rotation and don't align 1:1 with the version
    // window, so ranges are kept as shown on the calendar rather than clipped.
  {
    name: 'Tower of Adversity Phase 1',
    startTime: '2026-09-13T20:00:00Z',
    endTime: '2026-10-11T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Tower of Adversity Phase 2',
    startTime: '2026-10-11T20:00:00Z',
    endTime: '2026-11-08T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Tower of Adversity Phase 3',
    startTime: '2026-11-08T20:00:00Z',
    endTime: '2026-12-06T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Whimpering Wastes Phase 1',
    startTime: '2026-09-27T20:00:00Z',
    endTime: '2026-10-25T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Whimpering Wastes Phase 2',
    startTime: '2026-10-25T20:00:00Z',
    endTime: '2026-11-22T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Weekly Activity (09-28 - 10-05)',
    startTime: '2026-09-27T20:00:00Z',
    endTime: '2026-10-04T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (10-05 - 10-12)',
    startTime: '2026-10-04T20:00:00Z',
    endTime: '2026-10-11T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (10-12 - 10-19)',
    startTime: '2026-10-11T20:00:00Z',
    endTime: '2026-10-18T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (10-19 - 10-26)',
    startTime: '2026-10-18T20:00:00Z',
    endTime: '2026-10-25T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (10-26 - 11-02)',
    startTime: '2026-10-25T20:00:00Z',
    endTime: '2026-11-01T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (11-02 - 11-09)',
    startTime: '2026-11-01T20:00:00Z',
    endTime: '2026-11-08T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (11-09 - 11-16)',
    startTime: '2026-11-08T20:00:00Z',
    endTime: '2026-11-15T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Endstate Matrix: Adversity',
    startTime: '2026-10-06T20:00:00Z',
    endTime: '2026-11-11T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  ]
},
];
