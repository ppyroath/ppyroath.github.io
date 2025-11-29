export interface GameEvent {
  name: string;
  startTime: string;
  endTime: string;
  image: string;
  link: string;
  description: string;
}

export const pgrEvents: GameEvent[] = [
  {
    name: "Where Nightmares Dwell",
    startTime: "2025-11-13T05:00:00Z",
    endTime: "2025-12-22T01:59:59Z",
    image: new URL('../assets/pgr/images/where-nightmares-dwell.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/3565",
    description: "New story chapter, new frame: Limpidity. Click for more details."
  },
  {
    name: "Through the Tide Home",
    startTime: "2025-09-19T09:00:00Z",
    endTime: "2025-11-12T23:00:00Z",
    image: new URL('../assets/pgr/images/through-the-tide-home.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/3301",
    description: "New story chapter, new frame: Crepuscule, Secator, and Aegis. Click for more details."
  },
  {
    name: "Lamento di Phantasma",
    startTime: "2025-08-06T09:00:00Z",
    endTime: "2025-09-19T01:59:59Z",
    image: new URL('../assets/pgr/images/lamento-di-phantasma.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/2999",
    description: "New collab event , new character: Vergil and Dante. Click for more details."
  },
  {
    name: "Dream Till The Timeless End",
    startTime: "2025-06-25T09:00:00Z",
    endTime: "2025-08-06T01:59:59Z",
    image: new URL('../assets/pgr/images/dream-till-the-timeless-end.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/2835",
    description: "Game engine upgrade, New story chapter, new frames: Pianissimo, Daybreak, Geiravor. Click for more details."
  },
  {
    name: "Wither to Shine",
    startTime: "2025-05-14T09:00:00Z",
    endTime: "2025-06-25T01:59:59Z",
    image: new URL('../assets/pgr/images/wither-to-shine.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/2600",
    description: "New story chapter, new frames: Parhelion and Daemonissa. Click for more details."
  },
  {
    name: "Shaper's Ripples",
    startTime: "2025-04-02T09:00:00Z",
    endTime: "2025-05-14T01:59:59Z",
    image: new URL('../assets/pgr/images/shappers-ripples.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/2393",
    description: "New story chapter, new frames: Pyroath, Startrail, Fulgor. Click for more details."
  },
  {
    name: "Soaring Beyond",
    startTime: "2025-02-20T09:00:00Z",
    endTime: "2025-04-02T01:59:59Z",
    image: new URL('../assets/pgr/images/soaring-beyond.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/2169",
    description: "New story chapter, new frames: Solacetune and Lucid Dreamer. Click for more details."
  },
  {
    name: "Stars Ensnared",
    startTime: "2025-01-10T09:00:00Z",
    endTime: "2025-02-20T01:59:59Z",
    image: new URL('../assets/pgr/images/stars-ensnared.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/1961",
    description: "New story chapter, new frames: Oblivion, Decryptor, and Ardeo. Click for more details."
  },
  {
    name: "Polaris Bond",
    startTime: "2024-12-04T09:00:00Z",
    endTime: "2025-01-10T01:59:59Z",
    image: new URL('../assets/pgr/images/polaris-bond.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/1713",
    description: "New story chapter, new frames: Shukra. Click for more details."
  },
  {
    name: "Aeon Reforged",
    startTime: "2024-10-31T09:00:00Z",
    endTime: "2024-12-04T01:59:59Z",
    image: new URL('../assets/pgr/images/aeon-reforged.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/1556",
    description: "New story chapter, new frames: Epitaph. Click for more details."
  },
  {
    name: "Blazing Simulacrum",
    startTime: "2024-09-27T09:00:00Z",
    endTime: "2024-10-31T01:59:59Z",
    image: new URL('../assets/pgr/images/blazing-simulacrum.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/1380",
    description: "New story chapter, new frames: BLACK★ROCK SHOOTER. Click for more details."
  },
  {
    name: "Cradle Parade",
    startTime: "2024-08-21T09:00:00Z",
    endTime: "2024-09-27T01:59:59Z",
    image: new URL('../assets/pgr/images/cradle-parade.jpeg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/1214",
    description: "New story chapter, new frames: Lost Lullaby. Click for more details."
  },
  {
    name: "Everglowing Justice",
    startTime: "2024-07-15T09:00:00Z",
    endTime: "2024-08-21T01:59:59Z",
    image: new URL('../assets/pgr/images/everglowing-justice.jpeg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/1048",
    description: "New story chapter, new frames: Echo. Click for more details."
  },
  {
    name: "Sands of Wrath",
    startTime: "2024-06-14T09:00:00Z",
    endTime: "2024-07-15T01:59:59Z",
    image: new URL('../assets/pgr/images/sands-of-wrath.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/880",
    description: "New story chapter, new frames: Indomitus. Click for more details."
  },
  {
    name: "Chaos Unsnarled",
    startTime: "2024-05-09T09:00:00Z",
    endTime: "2024-06-14T01:59:59Z",
    image: new URL('../assets/pgr/images/chaos-unsnarled.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/719",
    description: "New story chapter, new frames: Feral. Click for more details."
  },
  {
    name: "The Floating Reverie",
    startTime: "2024-04-08T09:00:00Z",
    endTime: "2024-05-09T01:59:59Z",
    image: new URL('../assets/pgr/images/the-floating-reverie.jpeg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/700",
    description: "New story chapter, new frames: Zitherwoe. Click for more details."
  },
  {
    name: "Wintry Shackles",
    startTime: "2024-02-23T09:00:00Z",
    endTime: "2024-04-08T01:59:59Z",
    image: new URL('../assets/pgr/images/wintry-shackles.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/664",
    description: "New story chapter, new frames: Crimson Weave. Click for more details."
  },
  {
    name: "Renaissance du Fantastique",
    startTime: "2024-01-18T09:00:00Z",
    endTime: "2024-02-23T01:59:59Z",
    image: new URL('../assets/pgr/images/renaissance-du-fantastique.png', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/595",
    description: "New story chapter, new frames: Kaleido. Click for more details."
  },
  {
    name: "Spiral of Chronos",
    startTime: "2023-12-12T09:00:00Z",
    endTime: "2024-01-18T01:59:59Z",
    image: new URL('../assets/pgr/images/spiral-of-chronos.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/571",
    description: "New story chapter, new frames: Hyperreal. Click for more details."
  },
  {
    name: "Left Unsaid",
    startTime: "2023-11-09T09:00:00Z",
    endTime: "2023-12-12T01:59:59Z",
    image: new URL('../assets/pgr/images/left-unsaid.jpeg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/533",
    description: "New story chapter, new frames: Vitrum. Click for more details."
  },
  {
    name: "Across the Ruined Sea",
    startTime: "2023-09-26T09:00:00Z",
    endTime: "2023-11-09T01:59:59Z",
    image: new URL('../assets/pgr/images/across-the-ruined-sea.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/496",
    description: "New story chapter, new frames: Stigmata. Click for more details."
  },
  {
    name: "Cinder Burns",
    startTime: "2023-08-22T09:00:00Z",
    endTime: "2023-09-26T01:59:59Z",
    image: new URL('../assets/pgr/images/cinder-burns.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/448",
    description: "New story chapter, new frames: Arca. Click for more details."
  },
  {
    name: "A New Divide",
    startTime: "2023-07-13T09:00:00Z",
    endTime: "2023-08-22T01:59:59Z",
    image: new URL('../assets/pgr/images/a-new-divide.jpeg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/430",
    description: "New story chapter, new frames: Scire. Click for more details."
  },
  {
    name: "The Ark Beyond",
    startTime: "2023-06-15T09:00:00Z",
    endTime: "2023-07-13T01:59:59Z",
    image: new URL('../assets/pgr/images/the-ark-beyond.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/423",
    description: "New story chapter, new frames: Starveil. Click for more details."
  },
  {
    name: "Her Last Bow",
    startTime: "2023-05-11T09:00:00Z",
    endTime: "2023-06-15T01:59:59Z",
    image: new URL('../assets/pgr/images/her-last-bow.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/394",
    description: "New story chapter, new frames: Starfarer. Click for more details."
  },
  {
    name: "Reveries with a Whale",
    startTime: "2023-04-07T09:00:00Z",
    endTime: "2023-05-10T01:59:59Z",
    image: new URL('../assets/pgr/images/reveries-with-a-whale.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/185",
    description: "New story chapter, new frames: Dragontoll. Click for more details."
  },
  {
    name: "Recitativo di Fantasia",
    startTime: "2023-03-01T09:00:00Z",
    endTime: "2023-04-06T01:59:59Z",
    image: new URL('../assets/pgr/images/recitativo-di-fantasia.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/163",
    description: "New story chapter, new frames: Capriccio. Click for more details."
  },
  {
    name: "The Surviving Lucem",
    startTime: "2023-01-19T09:00:00Z",
    endTime: "2023-02-28T01:59:59Z",
    image: new URL('../assets/pgr/images/the-surviving-lucem.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/145",
    description: "New story chapter, new frames: Empyrea. Click for more details."
  },
  {
    name: "Evernight Beat",
    startTime: "2022-12-22T09:00:00Z",
    endTime: "2023-01-18T01:59:59Z",
    image: new URL('../assets/pgr/images/evernight-beat.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/142",
    description: "New story chapter, new frames: Flambeau. Click for more details."
  },
  {
    name: "The Last Spark",
    startTime: "2022-11-17T09:00:00Z",
    endTime: "2022-12-22T01:59:59Z",
    image: new URL('../assets/pgr/images/the-last-spark.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/137",
    description: "New story chapter, new frames: Garnet. Click for more details."
  },
  {
    name: "Inscription of Labyrinth",
    startTime: "2022-10-18T09:00:00Z",
    endTime: "2022-11-17T01:59:59Z",
    image: new URL('../assets/pgr/images/inscription-of-labyrinth.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/133",
    description: "New story chapter, new frames: XII. Click for more details."
  },
  {
    name: "Imprisoned Sight",
    startTime: "2022-09-16T09:00:00Z",
    endTime: "2022-10-17T01:59:59Z",
    image: new URL('../assets/pgr/images/imprisoned-sight.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/121",
    description: "New story chapter, new frames: Glory. Click for more details."
  },
  {
    name: "Echo Aria",
    startTime: "2022-08-16T09:00:00Z",
    endTime: "2022-09-15T01:59:59Z",
    image: new URL('../assets/pgr/images/echo-aria.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/112",
    description: "New story chapter, new frames: Tempest and Hypnos. Click for more details."
  },
  {
    name: "Untold Naraka",
    startTime: "2022-07-05T09:00:00Z",
    endTime: "2022-08-02T01:59:59Z",
    image: new URL('../assets/pgr/images/untold-naraka.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/101",
    description: "New story chapter, new frames: 2B, 9S, A2. Click for more details."
  },
  {
    name: "Fake Ascension",
    startTime: "2022-05-18T09:00:00Z",
    endTime: "2022-07-04T01:59:59Z",
    image: new URL('../assets/pgr/images/fake-ascension.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/72",
    description: "New story chapter, new frames: Laurel. Click for more details."
  },
  {
    name: "Lost Chapter",
    startTime: "2022-04-13T09:00:00Z",
    endTime: "2022-05-17T01:59:59Z",
    image: new URL('../assets/pgr/images/lost-chapter.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/64",
    description: "New story chapter, new frames: Qilin and Pavo. Click for more details."
  },
  {
    name: "Firn Night",
    startTime: "2022-03-02T09:00:00Z",
    endTime: "2022-04-12T01:59:59Z",
    image: new URL('../assets/pgr/images/firn-night.jpg', import.meta.url).href,
    link: "https://pgr.kurogame.net/news/56",
    description: "New story chapter, new frames: Rigor. Click for more details."
  },
  {
    name: "Grand Blue",
    startTime: "2022-01-26T09:00:00Z",
    endTime: "2022-03-01T01:59:59Z",
    image: new URL('../assets/pgr/images/grand-blue.jpg', import.meta.url).href,
    link: "https://youtu.be/--ZoB3jkWsU?si=ljfSBzboUcvGJYyA",
    description: "New story chapter, new frames: Rozen and Crocotta. Click for more details."
  },
  {
    name: "Kowloong Metropolis",
    startTime: "2021-12-22T09:00:00Z",
    endTime: "2022-01-25T01:59:59Z",
    image: new URL('../assets/pgr/images/kowloong-metropolis.png', import.meta.url).href,
    link: "https://youtu.be/D5WGCSZNmuE?si=EKFvJeCzSdaxTF8o",
    description: "New story chapter, new frames: Plume. Click for more details."
  },
  {
    name: "Nona Ouroboros",
    startTime: "2021-11-17T09:00:00Z",
    endTime: "2021-12-21T01:59:59Z",
    image: new URL('../assets/pgr/images/nona-ouroboros.jpg', import.meta.url).href,
    link: "https://youtu.be/FSgrtd6CcK0?si=Qb6EnQibe-OKWaYc",
    description: "New story chapter, new frames: Arclight. Click for more details."
  },
  {
    name: "Eternal Engine",
    startTime: "2021-10-12T09:00:00Z",
    endTime: "2021-11-16T01:59:59Z",
    image: new URL('../assets/pgr/images/eternal-engine.jpg', import.meta.url).href,
    link: "https://youtu.be/KNGHzn0qtYc?si=oz7dPukj1xmPrnxk",
    description: "New story chapter, new frames: Veritas and Silverfang. Click for more details."
  },
  {
    name: "Fallen Star",
    startTime: "2021-09-09T09:00:00Z",
    endTime: "2021-10-11T01:59:59Z",
    image: new URL('../assets/pgr/images/fallen-star.jpg', import.meta.url).href,
    link: "https://youtu.be/b9uDKCmzAXc?si=m7PNJ8pLR16FCc0K",
    description: "New story chapter, new frames: Astral and Brilliance. Click for more details."
  },
  {
    name: "Frozen Darkness",
    startTime: "2021-08-03T09:00:00Z",
    endTime: "2021-09-08T01:59:59Z",
    image: new URL('../assets/pgr/images/frozen-darkness.jpg', import.meta.url).href,
    link: "https://youtu.be/qQMF2NZ2dvM?si=3kZ8pI91QsajcTR4",
    description: "New story chapter, new frames: Crimson Abyss and Bastion. Click for more details."
  },
  {
    name: "Punishing: Gray Raven",
    startTime: "2021-07-16T09:00:00Z",
    endTime: "2021-08-03T01:59:59Z",
    image: new URL('../assets/pgr/images/punishing-gray-raven.jpg', import.meta.url).href,
    link: "https://youtu.be/Tj7fSPgBSUw?si=wEiYp_m0i8XcTVR4",
    description: "Official launching of Punishing: Gray Raven Global"
  },

];