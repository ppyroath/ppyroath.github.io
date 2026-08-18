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
  patchName: "Lamplight in Mirage, Sword's Resolve in Heart",
  patchVersion: "Global",
  startTime: "2026-08-20T03:00:00Z",
  endTime: "2026-09-30T03:00:00Z", 
  events: [
  {
    name: 'Wind of Transcendence (Qingxiao)',
    startTime: '2026-08-20T02:00:00Z',
    endTime: '2026-09-10T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Resonator Convene'
  },
  {
    name: 'False Promise for Tomorrow (Denia)',
    startTime: '2026-08-20T02:00:00Z',
    endTime: '2026-09-10T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Resonator Convene'
  },
  {
    name: 'Glint of Clouds',
    startTime: '2026-08-20T02:00:00Z',
    endTime: '2026-09-10T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Weapon Convene'
  },
  {
    name: 'Forged Dwarf Star',
    startTime: '2026-08-20T02:00:00Z',
    endTime: '2026-09-10T01:59:59Z',
    type: 'gacha',
    description: 'Phase 1 Featured Weapon Convene'
  },
  {
    name: 'Where Santu Beckons (Jingran)',
    startTime: '2026-09-10T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Resonator Convene'
  },
  {
    name: 'Thousand Futures Mirrored in Snow (Hiyuki)',
    startTime: '2026-09-10T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Resonator Convene'
  },
  {
    name: 'Distant May the Starlights Be (Mornye)',
    startTime: '2026-09-10T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Resonator Convene'
  },
  {
    name: 'Thousandfold Deliverance',
    startTime: '2026-09-10T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Weapon Convene'
  },
  {
    name: 'Frostburn',
    startTime: '2026-09-10T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Weapon Convene'
  },
  {
    name: 'Starfield Calibrator',
    startTime: '2026-09-10T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'gacha',
    description: 'Phase 2 Featured Weapon Convene'
  },
  {
    name: 'Chapter IV Act III & Chapter IV Segue',
    startTime: '2026-08-20T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'event',
    description: 'Main Quest Update'
  },
  {
    name: 'Gifts of Drifting Mist',
    startTime: '2026-08-20T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'event',
    description: 'Featured Event / Login Event'
  },
  {
    name: 'Resonance Sim Realm',
    startTime: '2026-08-22T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Second Coming of Solaris: Coded Deception',
    startTime: '2026-08-27T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'The Strings Remember',
    startTime: '2026-09-02T02:00:00Z',
    endTime: '2026-09-21T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'If Dreams Still Reverberate',
    startTime: '2026-09-10T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Wuthering Exploration',
    startTime: '2026-09-17T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'event',
    description: 'Featured Event'
  },
  {
    name: 'Bountiful Crescendo',
    startTime: '2026-09-03T02:00:00Z',
    endTime: '2026-09-10T01:59:59Z',
    type: 'double-drop',
    description: 'Tacet Field Double Drop Event'
  },
  {
    name: 'Chord Cleansing',
    startTime: '2026-09-22T02:00:00Z',
    endTime: '2026-09-29T01:59:59Z',
    type: 'double-drop',
    description: 'Simulation Challenge Double Drop Event'
  },
    // --- Recurring Challenge ---
    // These run on their own rotation and don't align 1:1 with the version
    // window — ranges kept as shown on the calendar rather than clipped.
    {
    name: 'Tower of Adversity Phase 1',
    startTime: '2026-08-16T20:00:00Z',
    endTime: '2026-09-13T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Tower of Adversity Phase 2',
    startTime: '2026-09-13T20:00:00Z',
    endTime: '2026-10-11T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Whimpering Wastes Phase 1',
    startTime: '2026-08-02T20:00:00Z',
    endTime: '2026-08-30T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Whimpering Wastes Phase 2',
    startTime: '2026-08-30T20:00:00Z',
    endTime: '2026-09-27T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Whimpering Wastes Phase 3',
    startTime: '2026-09-27T20:00:00Z',
    endTime: '2026-10-25T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  {
    name: 'Weekly Activity (08-17 - 08-24)',
    startTime: '2026-08-16T20:00:00Z',
    endTime: '2026-08-23T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (08-24 - 08-31)',
    startTime: '2026-08-23T20:00:00Z',
    endTime: '2026-08-30T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (08-31 - 09-07)',
    startTime: '2026-08-30T20:00:00Z',
    endTime: '2026-09-06T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (09-07 - 09-21)',
    startTime: '2026-09-06T20:00:00Z',
    endTime: '2026-09-20T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (09-21 - 09-28)',
    startTime: '2026-09-20T20:00:00Z',
    endTime: '2026-09-27T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Weekly Activity (09-28 - 10-05)',
    startTime: '2026-09-27T20:00:00Z',
    endTime: '2026-10-04T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge (Weekly Reset)'
  },
  {
    name: 'Endstate Matrix: Adversity',
    startTime: '2026-08-16T20:00:00Z',
    endTime: '2026-09-29T19:59:59Z',
    type: 'event',
    description: 'Recurring Challenge'
  },
  ]
},
];
