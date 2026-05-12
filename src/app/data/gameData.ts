import type { Game } from './types';
export type { Game } from './types';

import steamCsvRaw from '../../../steam_games_2026.csv?raw';
import { gamesFromSteamCsvText } from './steamCsv';

export const genres = [
  { name: 'RPG', count: 0, color: '#8b5cf6' },
  { name: 'FPS', count: 0, color: '#06b6d4' },
  { name: 'Horror', count: 0, color: '#ef4444' },
  { name: 'Indie', count: 0, color: '#f59e0b' },
  { name: 'Strategy', count: 0, color: '#10b981' },
  { name: 'Survival', count: 0, color: '#84cc16' },
  { name: 'Sports', count: 0, color: '#ec4899' },
  { name: 'Simulation', count: 0, color: '#3b82f6' },
];

const STEAM_IMPORT_LIMIT = 150;

/** 每款游戏在数据里最多保留几条「相似」；仅截断列表，不在图上再做度数贪心（避免大量节点被剥成零边） */
const MAX_SIMILAR_PER_GAME = 4;

const combinedGames = gamesFromSteamCsvText(steamCsvRaw, STEAM_IMPORT_LIMIT);

const gameIds = new Set(combinedGames.map((g) => g.id));
const extendedGames: Game[] = combinedGames.map((game) => ({
  ...game,
  similar: game.similar.filter((id) => gameIds.has(id)),
}));

extendedGames.forEach((game) => {
  if (game.similar.length === 0) {
    const sameGenre = extendedGames.filter((g) => g.genre === game.genre && g.id !== game.id);
    const toAdd = sameGenre.sort((a, b) => b.rating - a.rating).slice(0, MAX_SIMILAR_PER_GAME);
    game.similar.push(...toAdd.map((g) => g.id));
  }

  if (game.similar.length < MAX_SIMILAR_PER_GAME) {
    const sameGenre = extendedGames.filter(
      (g) => g.genre === game.genre && g.id !== game.id && !game.similar.includes(g.id)
    );
    const need = MAX_SIMILAR_PER_GAME - game.similar.length;
    const toAdd = sameGenre.sort((a, b) => b.rating - a.rating).slice(0, need);
    game.similar.push(...toAdd.map((g) => g.id));
  }

  if (game.similar.length < 2) {
    const anyGames = extendedGames.filter((g) => g.id !== game.id && !game.similar.includes(g.id));
    const toAdd = anyGames
      .sort((a, b) => b.rating - a.rating)
      .slice(0, MAX_SIMILAR_PER_GAME - game.similar.length);
    game.similar.push(...toAdd.map((g) => g.id));
  }
});

const gamesWithNoConnections = extendedGames.filter((g) => g.similar.length === 0);
gamesWithNoConnections.forEach((game) => {
  const sameGenre = extendedGames
    .filter((g) => g.genre === game.genre && g.id !== game.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, MAX_SIMILAR_PER_GAME);

  if (sameGenre.length > 0) {
    game.similar = sameGenre.map((g) => g.id);
  } else {
    const anyGames = extendedGames
      .filter((g) => g.id !== game.id)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, MAX_SIMILAR_PER_GAME);
    game.similar = anyGames.map((g) => g.id);
  }
});

const idToGameForTrim = new Map(extendedGames.map((g) => [g.id, g]));
extendedGames.forEach((game) => {
  const ranked = [...new Set(game.similar)]
    .filter((id) => gameIds.has(id))
    .map((id) => idToGameForTrim.get(id))
    .filter((g): g is Game => g != null)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, MAX_SIMILAR_PER_GAME)
    .map((g) => g.id);
  game.similar = ranked;
});

export { extendedGames };

export function generateYearDensity(): { year: number; count: number }[] {
  const density: { [year: number]: number } = {};

  for (let year = 2000; year <= 2026; year++) {
    density[year] = 0;
  }

  extendedGames.forEach((game) => {
    if (density[game.year] !== undefined) {
      density[game.year]++;
    }
  });

  return Object.entries(density).map(([year, count]) => ({
    year: parseInt(year, 10),
    count,
  }));
}
