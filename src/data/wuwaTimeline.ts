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
  patchName: "Blade of Past Resounds, Lingering Dream Hymns",
  patchVersion: "Global",
  startTime: "2026-07-10T03:00:00Z",
  endTime: "2026-08-20T03:00:00Z", // corrected from calendar, see note above
  events: [
    // --- Featured Resonator Convene ---
    {
      name: "Voices on Azure Feathers",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-07-30T03:00:00Z",
      type: 'gacha',
      description: "Featured Resonator Convene — Yangyang: Xuanling (5★ debut)"
    },
    {
      name: "Blessings From Dewy Winds",
      startTime: "2026-07-30T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'gacha',
      description: "Featured Resonator Convene — Suisui (5★ debut)"
    },
    {
      name: "When Winter Thaws",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-07-30T03:00:00Z",
      type: 'gacha',
      description: "Featured Resonator Convene rerun — Luuk Herssen"
    },
    {
      name: "Take Flight in Spring",
      startTime: "2026-07-30T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'gacha',
      description: "Featured Resonator Convene rerun — Aemeath"
    },
    {
      name: "Undefined Spectrum",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-07-30T03:00:00Z",
      type: 'gacha',
      description: "Featured Resonator Convene rerun — Lynae"
    },
    // --- Reverb Resonator Convene ---
    {
      name: "Starpath Reverbs",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'gacha',
      description: "Reverb Resonator Convene — rotating rerun pool of past limited resonators"
    },
    // --- Featured Weapon Convene ---
    {
      name: "Azure Oath",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-07-30T03:00:00Z",
      type: 'gacha',
      description: "Featured Weapon Convene — signature weapon for Yangyang: Xuanling"
    },
    {
      name: "Firstlight's Herald",
      startTime: "2026-07-30T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'gacha',
      description: "Featured Weapon Convene — signature weapon for Suisui"
    },
    {
      name: "Daybreaker's Spine",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-07-30T03:00:00Z",
      type: 'gacha',
      description: "Featured Weapon Convene rerun — Luuk Herssen's signature weapon"
    },
    {
      name: "Everbright Polestar",
      startTime: "2026-07-30T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'gacha',
      description: "Featured Weapon Convene rerun — Aemeath's signature weapon"
    },
    {
      name: "Spectrum Blaster",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-07-30T03:00:00Z",
      type: 'gacha',
      description: "Featured Weapon Convene rerun — Lynae's signature weapon"
    },
    // --- Reverb Weapon Convene ---
    {
      name: "Tideforge Reverbs",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'gacha',
      description: "Reverb Weapon Convene — rotating rerun pool of past signature weapons"
    },
    // --- Main Quest ---
    {
      name: "Chapter IV Act I, Act II, Segue",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-08-20T03:00:00Z",
      type: 'event',
      description: "Main story quest continuation in the new Mengzhou region, Land of Xuanfang"
    },
    // --- Special Event ---
    {
      name: "Lament Recon: Tacet Crisis",
      startTime: "2026-07-11T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'event',
      description: "Combat event — reposition and dodge while fighting waves of enemies, buy weapons/items mid-run. Rewards Astrite, exclusive sigil, avatar and title"
    },
    {
      name: "A Glimpse of Xuanfang / Shape of Yesterday",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-08-20T03:00:00Z",
      type: 'event',
      description: "Exploration events introducing the new Land of Xuanfang region"
    },
    {
      name: "Recaptured: Action Highlights",
      startTime: "2026-07-16T03:00:00Z",
      endTime: "2026-08-06T03:00:00Z",
      type: 'event',
      description: "Combat photography event — perform specific actions with a designated character and capture them on camera"
    },
    {
      name: "Lollo Campaign: New Journey",
      startTime: "2026-08-06T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'event',
      description: "Login-based event, rewards Tides and consumables"
    },
    {
      name: "Virtual Crisis: Quadrant Trials",
      startTime: "2026-07-30T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'event',
      description: "Combat event — defeat strong enemies across stages with selectable modifiers. Rewards Astrite, tuner, potion and exclusive title"
    },
    {
      name: "Gifts of Aftertune",
      startTime: "2026-07-10T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'event',
      description: "Login-based event, rewards Tides and consumables"
    },
    {
      name: "In Search of Lost Jade",
      startTime: "2026-07-30T03:00:00Z",
      endTime: "2026-08-13T03:00:00Z",
      type: 'event',
      description: "Limited-time exploration/collection event"
    },
    {
      name: "Bountiful Crescendo",
      startTime: "2026-07-23T03:00:00Z",
      endTime: "2026-07-30T03:00:00Z",
      type: 'double-drop',
      description: "Limited-time material double-drop event"
    },
    {
      name: "Chord Cleansing",
      startTime: "2026-08-12T03:00:00Z",
      endTime: "2026-08-19T03:00:00Z",
      type: 'double-drop',
      description: "Limited-time Echo double-drop event"
    },
    // --- Recurring Challenge ---
    // These run on their own rotation and don't align 1:1 with the version
    // window — ranges kept as shown on the calendar rather than clipped.
    {
      name: "Tower of Adversity",
      startTime: "2026-06-22T03:00:00Z",
      endTime: "2026-09-14T03:00:00Z",
      type: 'event',
      description: "Recurring floor-climbing combat challenge, rotates roughly every 4 weeks (phases: 6-22→7-20, 7-20→8-17, 8-17→9-14)"
    },
    {
      name: "Whimpering Wastes",
      startTime: "2026-07-06T03:00:00Z",
      endTime: "2026-08-31T03:00:00Z",
      type: 'event',
      description: "Recurring rogue-lite dungeon challenge mode"
    },
    {
      name: "Weekly Activity",
      startTime: "2026-07-06T03:00:00Z",
      endTime: "2026-08-24T03:00:00Z",
      type: 'event',
      description: "Standard weekly login/combat activity reset"
    },
    {
      name: "Endstate Matrix: Adversity",
      startTime: "2026-07-17T03:00:00Z",
      endTime: "2026-08-20T03:00:00Z",
      type: 'event',
      description: "High-difficulty recurring combat trial"
    },
  ]
},
];
