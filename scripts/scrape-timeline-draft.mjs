#!/usr/bin/env node
/**
 * scrape-timeline-draft.mjs
 * --------------------------
 * Best-effort regex extractor for per-patch banner/event schedules
 * (the stuff in pgrTimeline.ts / wuwaTimeline.ts).
 *
 * This is DELIBERATELY not wired into the auto-commit workflow. Patch
 * notes are written in prose by humans and are NOT consistently
 * formatted, so this script will:
 *   - get most dates right when a clean "Duration: MM/DD/YYYY HH:MM -
 *     MM/DD/YYYY HH:MM (UTC)" line exists,
 *   - get dates approximately right (and say so) for looser phrasing,
 *   - almost always need the "name" field cleaned up by hand, since the
 *     script just grabs the nearest preceding line as a guess, not the
 *     actual curated banner name.
 *
 * Run it manually, review the draft file it writes, then hand-copy
 * whatever's useful into the real pgrTimeline.ts / wuwaTimeline.ts.
 * It NEVER touches those files directly.
 *
 * Usage:
 *   node scripts/scrape-timeline-draft.mjs pgr 4750
 *   node scripts/scrape-timeline-draft.mjs wuwa 4613
 *   node scripts/scrape-timeline-draft.mjs pgr        # auto-uses newest id from pgrEvents.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const GAMES = {
  pgr: {
    label: 'Punishing: Gray Raven',
    eventsFile: path.join(REPO_ROOT, 'src/data/pgrEvents.ts'),
    detailUrl: (id) => `https://media-cdn-zspms.kurogame.net/pnswebsite/website2.0/json/G167/article/${id}.json`,
    outFile: path.join(REPO_ROOT, 'src/data/pgrTimeline.draft.ts'),
    varName: 'pgrTimelineDraft',
  },
  wuwa: {
    label: 'Wuthering Waves',
    eventsFile: path.join(REPO_ROOT, 'src/data/wuwaEvents.ts'),
    detailUrl: (id) => `https://hw-media-cdn-mingchao.kurogame.com/akiwebsite/website2.0/json/G152/en/article/${id}.json`,
    outFile: path.join(REPO_ROOT, 'src/data/wuwaTimeline.draft.ts'),
    varName: 'wuwaTimelineDraft',
  },
};

const MONTHS = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function htmlToLines(html) {
  const text = html
    .replace(/<\/(div|p|li|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&times;/g, '×')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&beta;/g, 'β')
    .replace(/&alpha;/g, 'α')
    .replace(/&bull;/g, '•')
    .replace(/&#39;/g, "'");
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

function toIso(y, mo, d, h, mi) {
  return new Date(Date.UTC(y, mo - 1, d, h, mi, 0)).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function parseNumericDate(mmddyyyy, hhmm) {
  const [mm, dd, yyyy] = mmddyyyy.split('/').map(Number);
  const [h, m] = (hhmm || '00:00').split(':').map(Number);
  return toIso(yyyy, mm, dd, h, m);
}

function parseProseDate(text, hhmm) {
  const m = text.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  if (!month) return null;
  const [h, mi] = (hhmm || '00:00').split(':').map(Number);
  return toIso(Number(m[3]), month, Number(m[2]), h, mi);
}

function isDateLine(l) {
  return /(Duration|Event Period|Acquisition Period):/i.test(l) || /\(UTC\)/.test(l);
}

const GENERIC_LABELS = /^(\d+\)\s*)?(Duration|Event Period|Acquisition Period|Requirement|Event Info|Event Rewards|Rewards Overview|Notes?|Special Notes)\s*:?\s*$/i;

// Lines that describe a requirement/prerequisite/tag rather than the actual
// event name, even when they have inline content after a colon (e.g.
// "Requirement: Clear Normal Story 1-8") or no colon at all (e.g. bare
// "Commandant Lv.42 or above" level-gate lines, which show up constantly).
const METADATA_LINE = /^(Requirement|Recommended for|Eligibility)\s*:/i;
const LEVEL_GATE_LINE = /^(Commandant|Rover)\s+(Lv\.?|Level)\s*\d+/i;
// Decorative divider lines like "——...——" used as visual separators in articles.
const DIVIDER_LINE = /^[—\-=*\s]+$/;

function looksLikeHeading(l) {
  return !/[.。]\s*$/.test(l) && l.length <= 70;
}

function isSkippableAsHeading(l) {
  return GENERIC_LABELS.test(l) || METADATA_LINE.test(l) || LEVEL_GATE_LINE.test(l) || DIVIDER_LINE.test(l);
}

function nearestHeading(lines, idx) {
  const nearby = [];
  for (let i = idx - 1; i >= Math.max(0, idx - 14); i--) {
    const l = lines[i];
    if (!l || isDateLine(l) || isSkippableAsHeading(l)) continue;
    nearby.push(l.replace(/^[—\-]+|[—\-]+$/g, '').trim()); // strip stray leading/trailing dashes
  }
  const pick = nearby.find(looksLikeHeading) || nearby[0] || 'UNNAMED — check article manually';
  return pick.replace(/^\d+\)\s*/, '').replace(/^[IVXLC]+\.\s*/, '').slice(0, 90);
}

function classifyType(context) {
  const c = context.toLowerCase();
  if (/(omniframe|weapon target|\bresearch\b|\bcub\b|coating)/.test(c)) return 'gacha';
  if (/(double.?drop|x2 drop|drop rate)/.test(c)) return 'double-drop';
  if (/(redeem code|web event|official website|\bforum\b)/.test(c)) return 'web';
  return 'event';
}

function extractCandidates(lines, versionStartTimeIso) {
  const found = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // A) "Label: MM/DD/YYYY HH:MM - MM/DD/YYYY HH:MM (UTC)"
    let m = line.match(
      /(?:Duration|Event Period|Acquisition Period):\s*(\d{2}\/\d{2}\/\d{4})\s+(\d{1,2}:\d{2})\s*-\s*(\d{2}\/\d{2}\/\d{4})\s+(\d{1,2}:\d{2})\s*\(UTC\)/i
    );
    if (m) {
      const name = nearestHeading(lines, i);
      found.push({
        name,
        startTime: parseNumericDate(m[1], m[2]),
        endTime: parseNumericDate(m[3], m[4]),
        type: classifyType(`${line} ${name}`),
        confidence: 'high',
        raw: line,
      });
      continue;
    }

    // B) "Label: After the version update on MM/DD/YYYY - HH:MM (UTC), MM/DD/YYYY"
    m = line.match(
      /(?:Duration|Event Period|Acquisition Period):\s*After the version update on\s*(\d{2}\/\d{2}\/\d{4})(?:\s*-\s*(\d{1,2}:\d{2})\s*\(UTC\))?,?\s*(\d{2}\/\d{2}\/\d{4})?/i
    );
    if (m) {
      const name = nearestHeading(lines, i);
      const endTime = m[3] ? parseNumericDate(m[3], m[2] || '00:00') : null;
      found.push({
        name,
        startTime: versionStartTimeIso,
        endTime: endTime || 'FIXME_NO_END_DATE_FOUND',
        type: classifyType(`${line} ${name}`),
        confidence: endTime ? 'medium' : 'low',
        raw: line,
      });
      continue;
    }

    // D) Bare standalone date range, no label on the same line — label (e.g. "4) Duration")
    // sits on its own line above it, common when the article splits label and value
    // into separate <span> blocks.
    m = line.match(/^(\d{2}\/\d{2}\/\d{4})\s+(\d{1,2}:\d{2})\s*-\s*(\d{2}\/\d{2}\/\d{4})\s+(\d{1,2}:\d{2})\s*\(UTC\)$/);
    if (m) {
      const name = nearestHeading(lines, i);
      found.push({
        name,
        startTime: parseNumericDate(m[1], m[2]),
        endTime: parseNumericDate(m[3], m[4]),
        type: classifyType(`${line} ${name}`),
        confidence: 'high',
        raw: line,
      });
      continue;
    }

    // C) Prose: "From <Month D, YYYY> ... to <Month D, YYYY>[, HH:MM] (UTC)"
    m = line.match(
      /From\s+([A-Za-z]+\s+\d{1,2},\s*\d{4})[^.]*?to\s+([A-Za-z]+\s+\d{1,2},\s*\d{4}),?\s*(\d{1,2}:\d{2})?\s*\(UTC\)/i
    );
    if (m) {
      const name = nearestHeading(lines, i);
      // "(after maintenance)" with no explicit clock time for the start date
      // means it starts exactly when the version goes live — use the known
      // version startTime instead of defaulting to midnight.
      const afterMaintenance = /after maintenance/i.test(line);
      found.push({
        name,
        startTime: afterMaintenance ? versionStartTimeIso : parseProseDate(m[1], '00:00'),
        endTime: parseProseDate(m[2], m[3] || '00:00'),
        type: classifyType(line),
        confidence: 'medium',
        raw: line,
      });
      continue;
    }
  }

  // De-dupe near-identical raw lines (same sentence often gets re-matched via nearby loops)
  const seen = new Set();
  return found.filter((f) => {
    const key = f.raw;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildDraftTs(varName, patchName, patchVersion, versionStartTime, versionEndTime, candidates) {
  const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const events = candidates
    .map(
      (c) => `    {
      // confidence: ${c.confidence} | source line: "${esc(c.raw.slice(0, 100))}"
      name: "${esc(c.name)}", // TODO: clean this up, it's a rough guess
      startTime: "${c.startTime}",
      endTime: "${typeof c.endTime === 'string' && c.endTime.startsWith('FIXME') ? c.endTime : c.endTime}",
      type: '${c.type}',
      description: ""
    },`
    )
    .join('\n');

  return `// AUTO-GENERATED DRAFT — NOT auto-committed, review before using.
// Every "name" is a rough guess (nearest heading in the article) and needs
// manual cleanup. Dates marked confidence: low/medium should be spot-checked
// against the original article.
import type { PatchTimeline } from './wuwaTimeline';

export const ${varName}: PatchTimeline[] = [
  {
    patchName: "${esc(patchName)}",
    patchVersion: "${esc(patchVersion)}",
    startTime: "${versionStartTime}",
    endTime: "${versionEndTime}",
    events: [
${events}
    ]
  }
];
`;
}

function getNewestArticleId(eventsFileContent) {
  const m = eventsFileContent.match(/link:\s*"[^"]*\/news(?:\/detail)?\/(\d+)"/);
  return m ? m[1] : null;
}

function getEventMeta(eventsFileContent, articleId) {
  // Find the block containing this articleId's link, then pull name/startTime/endTime from it
  const idx = eventsFileContent.indexOf(`/${articleId}"`);
  if (idx === -1) return {};
  const blockStart = eventsFileContent.lastIndexOf('{', idx);
  const blockEnd = eventsFileContent.indexOf('},', idx);
  const block = eventsFileContent.slice(blockStart, blockEnd);
  const name = block.match(/name:\s*"([^"]*)"/)?.[1];
  const startTime = block.match(/startTime:\s*"([^"]*)"/)?.[1];
  const endTime = block.match(/endTime:\s*"([^"]*)"/)?.[1];
  return { name, startTime, endTime };
}

async function main() {
  const [, , gameKey, articleIdArg] = process.argv;
  const game = GAMES[gameKey];
  if (!game) {
    console.error('Usage: node scripts/scrape-timeline-draft.mjs <pgr|wuwa> [articleId]');
    process.exit(1);
  }

  const eventsFileContent = await readFile(game.eventsFile, 'utf8');
  const articleId = articleIdArg || getNewestArticleId(eventsFileContent);
  if (!articleId) {
    console.error('Could not determine an article id. Pass one explicitly.');
    process.exit(1);
  }

  const meta = getEventMeta(eventsFileContent, articleId);
  const versionStartTime = meta.startTime || new Date().toISOString();
  const versionEndTime = meta.endTime || new Date().toISOString();

  console.log(`Fetching ${game.label} article ${articleId}...`);
  const res = await fetch(`${game.detailUrl(articleId)}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const detail = await res.json();

  const lines = htmlToLines(detail.articleContent || '');
  const candidates = extractCandidates(lines, versionStartTime);

  console.log(`Found ${candidates.length} candidate sub-events (confidence: ${candidates.filter(c=>c.confidence==='high').length} high, ${candidates.filter(c=>c.confidence==='medium').length} medium, ${candidates.filter(c=>c.confidence==='low').length} low).`);

  const draft = buildDraftTs(
    game.varName,
    meta.name || detail.articleTitle,
    'Global',
    versionStartTime,
    versionEndTime,
    candidates
  );

  await writeFile(game.outFile, draft, 'utf8');
  console.log(`Draft written to ${path.relative(REPO_ROOT, game.outFile)} — review before merging into the real timeline file.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
