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
    patchName: "Reverbs from the End of Galaxies",
    patchVersion: "3.3",
    startTime: "2026-04-30T03:00:00Z",
    endTime: "2026-06-10T03:59:59Z",
    events: [
      {
        name: "Thousand Futures Mirrored in Snow (Hiyuki)",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "gacha",
        description: "Featured Resonator Convene"
      },
      {
        name: "Distant May the Starlights Be (Mornye)",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "gacha",
        description: "Featured Resonator Convene"
      },
      {
        name: "Across Time's Waxes and Wanes (Iuno)",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "gacha",
        description: "Featured Resonator Convene"
      },
      {
        name: "False Promise for Tomorrow (Denia)",
        startTime: "2026-05-21T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "gacha",
        description: "Featured Resonator Convene"
      },
      {
        name: "Horizon of Dawnbreak (Chisa)",
        startTime: "2026-05-21T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "gacha",
        description: "Featured Resonator Convene"
      },
      {
        name: "Requiem Without End (Phrolova)",
        startTime: "2026-05-21T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "gacha",
        description: "Featured Resonator Convene"
      },
      {
        name: "Frostburn",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "gacha",
        description: "Featured Weapon Convene"
      },
      {
        name: "Starfield Calibrator",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "gacha",
        description: "Featured Weapon Convene"
      },
      {
        name: "Moongazer's Sigil",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "gacha",
        description: "Featured Weapon Convene"
      },
      {
        name: "Forged Dwarf Star",
        startTime: "2026-05-21T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "gacha",
        description: "Featured Weapon Convene"
      },
      {
        name: "Kumokiri",
        startTime: "2026-05-21T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "gacha",
        description: "Featured Weapon Convene"
      },
      {
        name: "Lethean Elegy",
        startTime: "2026-05-21T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "gacha",
        description: "Featured Weapon Convene"
      },
      {
        name: "Second Coming of Solaris: Collab Season",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
        description: "Main 2nd Anniversary celebration umbrella event hub containing various anniversary activities and rewards."
      },
      {
        name: "Star Bouncing",
        startTime: "2026-05-02T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
description: "An anniversary mini-game themed around a trek across the galaxy guided by orbit mechanics."      },
      {
        name: "Cubie Derby: Championship",
        startTime: "2026-05-09T02:00:00Z",
        endTime: "2026-05-25T01:59:00Z",
        type: "event",
description: "A specialized anniversary tactical racing/support event highlighting strategic cube match tracking."      },
      {
        name: "Lollo Express: Promise Delivered",
        startTime: "2026-05-07T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
description: "Anniversary commission event in collaboration with Lollo Logistics involving specialized courier deliveries."      },
      {
        name: "Bountiful Waves",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-06-15T03:59:00Z",
        type: "event",
description: "Complete Spindrift Tasks to earn event tokens exchangable for various items in the Bountiful Waves shop."      },
      {
        name: "Gifts of Grand Celebration (Part 1)",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
        description: "Special login event distributed in two phases rewarding Radiant Tides, Crystal Solvents, and an Anniversary Avatar."
      },
      {
        name: "Gifts of Grand Celebration (Part 2)",
        startTime: "2026-05-23T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
        description: "Special login event distributed in two phases rewarding Radiant Tides, Crystal Solvents, and an Anniversary Avatar."
      },
      {
        name: "Dimmr Traces",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
description: "Exploration milestone event focusing on exploring the newly unlocked subterranean Dimmr Plains area."      },
      {
        name: "Gifts of Starlight",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
description: "Standard 7-day login event available during the version update for quick progression materials."      },
      {
        name: "Depths of Illusive Realm: Chromatic Fantasy",
        startTime: "2026-05-21T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
description: "Roguelike dungeon update exploring a chaotic, tangled dreamscape containing Namipon."      },
      {
        name: "Aced! Combat Mastery Test!",
        startTime: "2026-05-07T02:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "event",
description: "Featured adrenaline combat event testing active team skills under Instructor B.1.N.G.O."      },
      {
        name: "Beyond the Waves: Roya Frostlands",
        startTime: "2026-05-25T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
description: "Daily task exploration event awarding Adventure Logs redeemable for upgrade packages."      },
      {
        name: "Crossworld Sync: Pt. 1",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "event",
description: "Special triple collaboration event featuring Resident Evil 30th Anniversary, Angry Birds, and Kaiju No. 8."      },
      {
        name: "Crossworld Sync: Pt. 2",
        startTime: "2026-05-21T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "event",
description: "The second phase of the collab event featuring PRAGMATA, Riders Republic, and HAIKYU!!."      },
      {
        name: "Into the Memory Program!",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-07-23T03:00:00Z",
        type: "web",
description: "Long-running anniversary web event projecting player memories. Lasts from the start of Version 3.3 until the end of Version 3.4."      },
      {
        name: "Back to Solaris",
        startTime: "2026-04-30T03:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "web",
description: "Web event for inviting inactive/former companions back to the game to secure shared Astrites."      },
      {
        name: "Bountiful Crescendo",
        startTime: "2026-05-14T02:00:00Z",
        endTime: "2026-05-21T01:59:00Z",
        type: "double-drop",
description: "Limited-time material double-drop campaign for simulation challenge rewards."      },
      {
        name: "Chord Cleansing",
        startTime: "2026-05-31T02:00:00Z",
        endTime: "2026-06-07T03:59:00Z",
        type: "double-drop",
description: "Limited-time double-drop campaign for Echo absorption drop mechanics."      }
    ]
  }
];
