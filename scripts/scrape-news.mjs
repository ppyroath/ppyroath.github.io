#!/usr/bin/env node
/**
 * scrape-news.mjs
 * ----------------
 * Auto-updates src/data/pgrEvents.ts and src/data/wuwaEvents.ts by pulling
 * version-update news directly from Kuro Games' own CDN JSON endpoints
 *
 * Usage:
 *   node scripts/scrape-news.mjs            # fetch + write changes
 *   node scripts/scrape-news.mjs --dry-run  # fetch + print what WOULD change, no writes
 *
 * KNOWN LIMITATIONS (read before trusting this blindly):
 *  - The "startTime" field in Kuro's JSON is the article's *publish* time,
 *    not the actual in-game version go-live time. This script instead
 *    regexes the article body for the standard maintenance-window sentence
 *    ("...version update on <Date>, from <H:MM> to <H:MM> (UTC)") and uses
 *    the maintenance END time as the true event startTime. This pattern is
 *    confirmed against a real PGR article (Homecoming Voyage, id 4750).
 *    It is NOT yet confirmed against a real WuWa article — if it doesn't
 *    match, the script falls back to the raw API startTime and logs a
 *    warning so you know to double check that entry manually.
 *  - endTime is inferred by chaining: when a new entry is detected, the
 *    previously-newest entry's endTime is patched to the new entry's
 *    startTime. The brand-new newest entry gets a provisional endTime
 *    (+42 days, roughly one patch cycle) which self-corrects the next
 *    time a newer version is detected.
 *  - Only entries whose title matches each game's "version update" pattern
 *    are picked up. General announcements/notices are ignored.
 *  - This only touches the *Events* list (the one shown as the main event
 *    cards). It does not touch pgrTimeline.ts / wuwaTimeline.ts (banner
 *    breakdowns), which need richer per-banner info not present in the
 *    news feed and likely still need manual curation.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

const GAMES = [
  {
    key: 'pgr',
    label: 'Punishing: Gray Raven',
    dataFile: path.join(REPO_ROOT, 'src/data/pgrEvents.ts'),
    exportName: 'pgrEvents',
    listUrl: 'https://media-cdn-zspms.kurogame.net/pnswebsite/website2.0/json/G167/ArticleMenu.json',
    listShape: 'array', // response is a flat Article[]
    detailUrl: (id) => `https://media-cdn-zspms.kurogame.net/pnswebsite/website2.0/json/G167/article/${id}.json`,
    linkUrl: (id) => `https://pgr.kurogame.net/news/${id}`,
    versionArticleType: 47, // confirmed against live data
    startTimeExtractor: extractStartTimePGR,
    titleToName: (title) => {
      // "VERSION \"HOMECOMING VOYAGE\" UPDATE NOTE" -> "Homecoming Voyage"
      const m = title.match(/^VERSION\s+"([^"]+)"\s+UPDATE NOTE$/i);
      if (!m) return null;
      return titleCase(m[1]);
    },
  },
  {
    key: 'wuwa',
    label: 'Wuthering Waves',
    dataFile: path.join(REPO_ROOT, 'src/data/wuwaEvents.ts'),
    exportName: 'wuwaEvents',
    listUrl: 'https://hw-media-cdn-mingchao.kurogame.com/akiwebsite/website2.0/json/G152/en/MainMenu.json',
    listShape: 'wrapped', // response is { article: Article[] } — confirmed via RSSHub's route source
    detailUrl: (id) => `https://hw-media-cdn-mingchao.kurogame.com/akiwebsite/website2.0/json/G152/en/article/${id}.json`,
    linkUrl: (id) => `https://wutheringwaves.kurogames.com/en/main/news/detail/${id}`,
    // Confirmed against live data: real titles look like
    // "Version 3.5 Blade of Past Resounds, Lingering Dream Hymns Content Overview"
    // (NOT "Patch Notes for Version X: ..." as originally guessed).
    titleToName: (title) => {
      const m = title.match(/^Version\s+[\d.]+\s+(.+?)\s+Content Overview$/i);
      if (!m) return null;
      return titleCase(m[1].trim());
    },
    startTimeExtractor: extractStartTimeWuWa,
  },
];

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

// PGR pattern: "...version update on June 2, 2026, from 05:00 to 11:00 (UTC)"
// Already in UTC, no timezone conversion needed.
function extractStartTimePGR(articleContent) {
  const text = stripHtml(articleContent);
  const re = /version update on\s+([A-Z][a-z]+\s+\d{1,2},\s*\d{4}),?\s*from\s*(\d{1,2}:\d{2})\s*to\s*(\d{1,2}:\d{2})\s*\(UTC\)/i;
  const m = text.match(re);
  if (!m) return null;
  const [, dateStr, , endTime] = m;
  const iso = new Date(`${dateStr} ${endTime}:00 UTC`);
  if (Number.isNaN(iso.getTime())) return null;
  return iso.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// WuWa pattern: "Maintenance Duration: 2026-07-10 04:00 - 2026-07-10 11:00 (UTC+8)"
// Confirmed against live data (v3.5 article, id 5091). Note: UTC+8, needs conversion.
function extractStartTimeWuWa(articleContent) {
  const text = stripHtml(articleContent);
  const re = /Maintenance Duration:\s*\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2}\s*-\s*(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})\s*\(UTC\+8\)/i;
  const m = text.match(re);
  if (!m) return null;
  const [, endDate, endTime] = m;
  const [y, mo, d] = endDate.split('-').map(Number);
  const [h, mi] = endTime.split(':').map(Number);
  const utcMs = Date.UTC(y, mo - 1, d, h, mi, 0) - 8 * 60 * 60 * 1000; // UTC+8 -> UTC
  return new Date(utcMs).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

async function fetchJson(url) {
  const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  return res.json();
}

async function getArticleList(game) {
  const data = await fetchJson(game.listUrl);
  const articles = game.listShape === 'wrapped' ? data.article : data;
  if (!Array.isArray(articles)) throw new Error(`Unexpected list shape for ${game.key}`);
  return articles;
}

function extractKnownIds(fileContent, game) {
  const ids = new Set();
  // Matches link: "https://.../news/1234" or "/news/detail/1234"
  const re = /link:\s*"[^"]*\/news(?:\/detail)?\/(\d+)"/g;
  let m;
  while ((m = re.exec(fileContent))) ids.add(m[1]);
  return ids;
}

function buildEntryBlock(entry) {
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `  {
    name: "${esc(entry.name)}",
    startTime: "${entry.startTime}",
    endTime: "${entry.endTime}",
    image: "${esc(entry.image)}",
    link: "${esc(entry.link)}",
    description: "${esc(entry.description)}"
  },
`;
}

// Patches the endTime of the entry that currently sits first in the array
// (i.e. the previously-newest entry) to close the gap once we know what
// comes after it.
function patchPreviousTopEndTime(fileContent, exportName, newStartTime) {
  const arrayStartRe = new RegExp(`export const ${exportName}[^=]*=\\s*\\[\\s*\\n`);
  const startMatch = fileContent.match(arrayStartRe);
  if (!startMatch) return fileContent;
  const afterArrayStart = startMatch.index + startMatch[0].length;
  const restOfFile = fileContent.slice(afterArrayStart);
  const firstEntryEndIdx = restOfFile.indexOf('\n  },');
  if (firstEntryEndIdx === -1) return fileContent; // empty array, nothing to patch
  const firstEntryBlock = restOfFile.slice(0, firstEntryEndIdx);
  const patchedBlock = firstEntryBlock.replace(/endTime:\s*"[^"]*"/, `endTime: "${newStartTime}"`);
  return fileContent.slice(0, afterArrayStart) + patchedBlock + restOfFile.slice(firstEntryEndIdx);
}

function insertNewEntries(fileContent, exportName, entriesOldestFirst) {
  const arrayStartRe = new RegExp(`(export const ${exportName}[^=]*=\\s*\\[\\s*\\n)`);
  if (!arrayStartRe.test(fileContent)) {
    throw new Error(`Could not locate "export const ${exportName} ... = [" in file`);
  }
  const blocks = entriesOldestFirst.map(buildEntryBlock).reverse().join(''); // newest ends up first
  return fileContent.replace(arrayStartRe, `$1${blocks}`);
}

async function processGame(game) {
  console.log(`\n=== ${game.label} ===`);
  const fileContent = await readFile(game.dataFile, 'utf8');
  const knownIds = extractKnownIds(fileContent, game);

  const articles = await getArticleList(game);

  // Defend against duplicate entries in the raw API list (seen in practice
  // for at least WuWa's MainMenu.json).
  const seenIds = new Set();
  const uniqueArticles = articles.filter((a) => {
    if (seenIds.has(a.articleId)) return false;
    seenIds.add(a.articleId);
    return true;
  });

  const unmatchedNew = [];
  const looksVersionRelated = (title) => /\bVersion\s+[\d.]+/i.test(title);
  const candidates = uniqueArticles
    .filter((a) => (game.versionArticleType ? a.articleType === game.versionArticleType : true))
    .filter((a) => !knownIds.has(String(a.articleId)))
    .map((a) => {
      const name = game.titleToName(a.articleTitle);
      if (!name && looksVersionRelated(a.articleTitle)) unmatchedNew.push(a);
      return { ...a, name };
    })
    .filter((a) => a.name); // drop anything whose title didn't match the expected pattern

  if (unmatchedNew.length) {
    console.warn(`  ! ${unmatchedNew.length} article(s) mention a version number but titleToName() couldn't parse them — check if these should be included:`);
    for (const a of unmatchedNew.slice(0, 15)) console.warn(`      [type ${a.articleType}] id ${a.articleId}: "${a.articleTitle}"`);
    if (unmatchedNew.length > 15) console.warn(`      ...and ${unmatchedNew.length - 15} more`);
  }

  if (candidates.length === 0) {
    console.log('No new version entries found.');
    return;
  }

  // Oldest first, so we can insert them in order and end up with newest at index 0
  candidates.sort((a, b) => a.articleId - b.articleId);

  const built = [];
  for (const c of candidates) {
    const detail = await fetchJson(game.detailUrl(c.articleId));
    const image = detail.contentCover || detail.suggestCover || c.suggestCover || '';
    let startTime = game.startTimeExtractor(detail.articleContent || '');
    if (!startTime) {
      console.warn(`  ! Could not find maintenance-window sentence for "${c.name}" (id ${c.articleId}). Falling back to raw API startTime — VERIFY THIS MANUALLY.`);
      startTime = new Date(c.startTime.replace(' ', 'T') + 'Z').toISOString().replace(/\.\d{3}Z$/, 'Z');
    }
    built.push({
      articleId: c.articleId,
      name: c.name,
      startTime,
      // Placeholder for now — fixed up below once we know the full batch.
      endTime: null,
      image,
      link: game.linkUrl(c.articleId),
      description: `${c.name} update. Click for more details.`,
    });
    console.log(`  + ${c.name} (id ${c.articleId}) -> startTime ${startTime}`);
  }

  // Chain endTimes: each new entry's endTime = the next (newer) entry's startTime.
  // The newest entry in the batch gets a provisional +42 days, which self-corrects
  // automatically the next time an even newer version is detected.
  for (let i = 0; i < built.length; i++) {
    built[i].endTime =
      i < built.length - 1
        ? built[i + 1].startTime
        : new Date(new Date(built[i].startTime).getTime() + 42 * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  }

  // Close the gap on what USED to be the top entry — must run on the file
  // BEFORE inserting the new blocks, otherwise it'd patch the wrong (new) entry.
  let updated = patchPreviousTopEndTime(fileContent, game.exportName, built[0].startTime);
  updated = insertNewEntries(updated, game.exportName, built);

  if (DRY_RUN) {
    console.log(`  (dry-run) Would write ${built.length} new entrie(s) to ${path.relative(REPO_ROOT, game.dataFile)}`);
    return;
  }

  await writeFile(game.dataFile, updated, 'utf8');
  console.log(`  Wrote ${built.length} new entrie(s) to ${path.relative(REPO_ROOT, game.dataFile)}`);
}

async function main() {
  if (DRY_RUN) console.log('Running in --dry-run mode, no files will be written.\n');
  for (const game of GAMES) {
    try {
      await processGame(game);
    } catch (err) {
      console.error(`Failed processing ${game.label}:`, err.message);
      process.exitCode = 1;
    }
  }
}

main();
