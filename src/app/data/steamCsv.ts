import type { Game } from './types';

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\r') {
      continue;
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function parseReleaseYear(dateStr: string): number {
  const parts = dateStr.trim().split('/');
  if (parts.length >= 3) {
    const y = parseInt(parts[2], 10);
    if (!Number.isNaN(y)) return Math.max(2000, Math.min(2026, y));
  }
  return 2015;
}

function mapSteamToGenre(primary: string, tagsRaw: string): string {
  const t = tagsRaw.toLowerCase();
  const p = primary.toLowerCase();

  if (p === 'sports' || (t.includes('sports') && !t.includes('e-sports'))) return 'Sports';
  if (p === 'racing') return 'Simulation';

  if (t.includes('horror') || t.includes('survival horror')) return 'Horror';

  if (
    t.includes('open world survival') ||
    t.includes('survival craft') ||
    (t.includes('survival') && !t.includes('horror'))
  ) {
    return 'Survival';
  }

  if (
    p === 'strategy' ||
    t.includes('rts') ||
    t.includes('4x') ||
    t.includes('turn-based strategy') ||
    t.includes('grand strategy')
  ) {
    return 'Strategy';
  }

  if (p === 'simulation' || t.includes('flight sim') || t.includes('farming sim')) {
    return 'Simulation';
  }

  if (
    t.includes('fps') ||
    t.includes('hero shooter') ||
    t.includes('first-person shooter') ||
    (t.includes('first-person') && t.includes('shooter'))
  ) {
    return 'FPS';
  }

  if (p === 'rpg' || t.includes('rpg') || t.includes('jrpg') || t.includes('action rpg')) {
    return 'RPG';
  }

  if (p === 'indie') return 'Indie';

  if (p === 'massively multiplayer' || t.includes('massively multiplayer')) return 'RPG';

  if (t.includes('shooter')) return 'FPS';

  return 'Indie';
}

function rowToGame(cols: string[], header: string[]): Game | null {
  const row: Record<string, string> = {};
  header.forEach((h, i) => {
    row[h] = cols[i] ?? '';
  });

  const appId = row.AppID?.trim();
  const name = row.Name?.trim();
  if (!appId || !name) return null;

  const tags = row.All_Tags || '';
  const genre = mapSteamToGenre(row.Primary_Genre || '', tags);
  const reviewPct = parseInt(row.Review_Score_Pct || '0', 10);
  const rating =
    Number.isFinite(reviewPct) && reviewPct > 0 ? Math.min(10, Math.max(1, reviewPct / 10)) : 6;

  const tagPreview = tags.split(';').slice(0, 4).join(' · ');

  return {
    id: `steam-${appId}`,
    name,
    year: parseReleaseYear(row.Release_Date || ''),
    genre,
    rating,
    platform: 'PC (Steam)',
    developer: 'Steam catalog',
    description: tagPreview || `${name} — ${genre} on Steam.`,
    cover: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`,
    similar: [],
  };
}

export function gamesFromSteamCsvText(csvText: string, limit: number): Game[] {
  const rows = parseCsv(csvText.trim());
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim());
  const idxReviews = header.indexOf('Total_Reviews');
  const idxScore = header.indexOf('Review_Score_Pct');

  const dataRows = rows
    .slice(1)
    .filter((r) => r.length >= header.length)
    .map((cols, i) => ({ cols, i }));

  dataRows.sort((a, b) => {
    const revA = idxReviews >= 0 ? parseInt(a.cols[idxReviews] || '0', 10) : 0;
    const revB = idxReviews >= 0 ? parseInt(b.cols[idxReviews] || '0', 10) : 0;
    if (revB !== revA) return revB - revA;
    const scA = idxScore >= 0 ? parseInt(a.cols[idxScore] || '0', 10) : 0;
    const scB = idxScore >= 0 ? parseInt(b.cols[idxScore] || '0', 10) : 0;
    return scB - scA;
  });

  const games: Game[] = [];
  const seen = new Set<string>();

  for (const { cols } of dataRows) {
    const g = rowToGame(cols, header);
    if (!g || seen.has(g.id)) continue;
    seen.add(g.id);
    games.push(g);
    if (games.length >= limit) break;
  }

  return games;
}
