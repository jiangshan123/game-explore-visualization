import type { Game } from './types';

// Core game templates to generate from
const gameTemplates = {
  RPG: [
    { name: 'Elden Ring', year: 2022, rating: 9.5, dev: 'FromSoftware' },
    { name: 'Dark Souls III', year: 2016, rating: 9.2, dev: 'FromSoftware' },
    { name: 'Sekiro', year: 2019, rating: 9.3, dev: 'FromSoftware' },
    { name: 'Bloodborne', year: 2015, rating: 9.4, dev: 'FromSoftware' },
    { name: 'The Witcher 3', year: 2015, rating: 9.8, dev: 'CD Projekt Red' },
    { name: 'Skyrim', year: 2011, rating: 9.0, dev: 'Bethesda' },
    { name: 'Cyberpunk 2077', year: 2020, rating: 8.5, dev: 'CD Projekt Red' },
    { name: "Baldur's Gate 3", year: 2023, rating: 9.7, dev: 'Larian Studios' },
    { name: 'Divinity 2', year: 2017, rating: 9.3, dev: 'Larian Studios' },
    { name: 'Fallout 4', year: 2015, rating: 8.5, dev: 'Bethesda' },
    { name: 'Mass Effect', year: 2021, rating: 9.1, dev: 'BioWare' },
    { name: 'Dragon Age', year: 2014, rating: 8.8, dev: 'BioWare' },
    { name: 'Persona 5', year: 2017, rating: 9.5, dev: 'Atlus' },
    { name: 'Final Fantasy XIV', year: 2013, rating: 9.2, dev: 'Square Enix' },
    { name: 'Monster Hunter World', year: 2018, rating: 8.9, dev: 'Capcom' },
  ],
  FPS: [
    { name: 'DOOM Eternal', year: 2020, rating: 9.0, dev: 'id Software' },
    { name: 'Half-Life Alyx', year: 2020, rating: 9.5, dev: 'Valve' },
    { name: 'Halo Infinite', year: 2021, rating: 8.3, dev: '343 Industries' },
    { name: 'Apex Legends', year: 2019, rating: 8.7, dev: 'Respawn' },
    { name: 'Valorant', year: 2020, rating: 8.5, dev: 'Riot Games' },
    { name: 'CS:GO', year: 2012, rating: 8.9, dev: 'Valve' },
    { name: 'Overwatch 2', year: 2022, rating: 8.0, dev: 'Blizzard' },
    { name: 'Call of Duty', year: 2022, rating: 8.2, dev: 'Activision' },
    { name: 'Titanfall 2', year: 2016, rating: 9.0, dev: 'Respawn' },
    { name: 'Destiny 2', year: 2017, rating: 8.2, dev: 'Bungie' },
  ],
  Horror: [
    { name: 'Resident Evil 4', year: 2023, rating: 9.3, dev: 'Capcom' },
    { name: 'Silent Hill 2', year: 2024, rating: 9.6, dev: 'Konami' },
    { name: 'Alan Wake 2', year: 2023, rating: 9.1, dev: 'Remedy' },
    { name: 'Dead Space', year: 2023, rating: 9.0, dev: 'Motive Studio' },
    { name: 'Outlast', year: 2013, rating: 8.4, dev: 'Red Barrels' },
    { name: 'Amnesia', year: 2010, rating: 8.7, dev: 'Frictional Games' },
    { name: 'Phasmophobia', year: 2020, rating: 8.8, dev: 'Kinetic Games' },
    { name: 'The Last of Us', year: 2020, rating: 9.0, dev: 'Naughty Dog' },
  ],
  Indie: [
    { name: 'Hades', year: 2020, rating: 9.4, dev: 'Supergiant Games' },
    { name: 'Hollow Knight', year: 2017, rating: 9.5, dev: 'Team Cherry' },
    { name: 'Celeste', year: 2018, rating: 9.2, dev: 'Maddy Makes Games' },
    { name: 'Stardew Valley', year: 2016, rating: 9.1, dev: 'ConcernedApe' },
    { name: 'Undertale', year: 2015, rating: 9.5, dev: 'Toby Fox' },
    { name: 'Dead Cells', year: 2018, rating: 9.0, dev: 'Motion Twin' },
    { name: 'Terraria', year: 2011, rating: 9.0, dev: 'Re-Logic' },
    { name: 'Binding of Isaac', year: 2011, rating: 8.8, dev: 'Edmund McMillen' },
  ],
  Strategy: [
    { name: 'Civilization VI', year: 2016, rating: 8.9, dev: 'Firaxis Games' },
    { name: 'StarCraft II', year: 2010, rating: 9.2, dev: 'Blizzard' },
    { name: 'XCOM 2', year: 2016, rating: 8.8, dev: 'Firaxis Games' },
    { name: 'Total War', year: 2022, rating: 8.7, dev: 'Creative Assembly' },
    { name: 'Age of Empires IV', year: 2021, rating: 8.5, dev: 'Relic' },
    { name: 'Factorio', year: 2020, rating: 9.4, dev: 'Wube Software' },
  ],
  Survival: [
    { name: 'Valheim', year: 2021, rating: 8.9, dev: 'Iron Gate' },
    { name: 'Subnautica', year: 2018, rating: 9.1, dev: 'Unknown Worlds' },
    { name: 'Minecraft', year: 2011, rating: 9.3, dev: 'Mojang' },
    { name: 'The Forest', year: 2018, rating: 8.5, dev: 'Endnight Games' },
    { name: 'Rust', year: 2018, rating: 8.2, dev: 'Facepunch' },
    { name: 'ARK', year: 2017, rating: 7.9, dev: 'Studio Wildcard' },
  ],
  Sports: [
    { name: 'Rocket League', year: 2015, rating: 8.9, dev: 'Psyonix' },
    { name: 'FIFA 23', year: 2022, rating: 8.1, dev: 'EA Sports' },
    { name: 'NBA 2K23', year: 2022, rating: 7.8, dev: '2K Sports' },
    { name: 'Forza Horizon 5', year: 2021, rating: 9.1, dev: 'Playground Games' },
  ],
  Simulation: [
    { name: 'Euro Truck Simulator 2', year: 2012, rating: 8.6, dev: 'SCS Software' },
    { name: 'Flight Simulator', year: 2020, rating: 9.0, dev: 'Asobo Studio' },
    { name: 'Cities Skylines', year: 2015, rating: 8.8, dev: 'Colossal Order' },
    { name: 'The Sims 4', year: 2014, rating: 8.0, dev: 'Maxis' },
    { name: 'Farming Simulator', year: 2022, rating: 7.9, dev: 'Giants Software' },
  ],
};

// Generate variations and additional games
export function generateExtendedGameData(baseGames: Game[]): Game[] {
  const extendedGames = [...baseGames];
  let idCounter = 1000;

  // Suffixes for variations
  const suffixes = [
    'Remastered',
    'Deluxe Edition',
    'Complete Edition',
    'Gold Edition',
    'Enhanced',
    'Ultimate',
    'Definitive',
    'Expanded',
    'Special Edition',
    'Collection',
  ];

  // Prefixes for new games
  const prefixes = [
    'Ancient',
    'Cyber',
    'Quantum',
    'Shadow',
    'Mystic',
    'Eternal',
    'Forgotten',
    'Lost',
    'Digital',
    'Cosmic',
    'Neon',
    'Chrome',
    'Dark',
    'Crystal',
    'Epic',
    'Legendary',
    'Mythic',
    'Sacred',
    'Void',
    'Astral',
  ];

  const nouns = [
    'Legends',
    'Warriors',
    'Realms',
    'Chronicles',
    'Saga',
    'Quest',
    'Heroes',
    'Defenders',
    'Knights',
    'Odyssey',
    'Adventures',
    'Empire',
    'Kingdom',
    'Dynasty',
    'Legacy',
    'Destiny',
    'Prophecy',
    'Revolution',
    'Uprising',
    'Awakening',
  ];

  // Generate games for each genre
  Object.entries(gameTemplates).forEach(([genre, templates]) => {
    templates.forEach((template) => {
      // Add some variations
      for (let i = 0; i < 3; i++) {
        const variation = Math.random();
        const yearOffset = Math.floor(Math.random() * 5) - 2;
        const ratingOffset = (Math.random() - 0.5) * 0.8;

        let gameName = template.name;
        if (variation > 0.7) {
          gameName = `${template.name} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        } else if (variation > 0.4) {
          gameName = `${template.name} ${Math.floor(Math.random() * 3) + 2}`;
        }

        const newGame: Game = {
          id: `gen-${idCounter++}`,
          name: gameName,
          year: Math.max(2000, Math.min(2026, template.year + yearOffset)),
          genre: genre,
          rating: Math.max(6.0, Math.min(10.0, template.rating + ratingOffset)),
          platform: ['PC', 'PS5', 'Xbox', 'Switch'][Math.floor(Math.random() * 4)],
          developer: template.dev,
          description: `An exciting ${genre.toLowerCase()} game with innovative gameplay mechanics.`,
          cover: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 200000000000)}?w=400&h=600&fit=crop`,
          similar: [],
        };

        if (Math.random() > 0.6) {
          extendedGames.push(newGame);
        }
      }
    });

    // Generate completely new game names
    for (let i = 0; i < 30; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const year = 2000 + Math.floor(Math.random() * 27);

      const newGame: Game = {
        id: `gen-${idCounter++}`,
        name: `${prefix} ${noun}`,
        year: year,
        genre: genre,
        rating: 6.0 + Math.random() * 3.5,
        platform: ['PC', 'PS5', 'Xbox', 'Switch', 'Mobile'][Math.floor(Math.random() * 5)],
        developer: templates[Math.floor(Math.random() * templates.length)].dev,
        description: `Experience the ultimate ${genre.toLowerCase()} adventure in this groundbreaking title.`,
        cover: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 200000000000)}?w=400&h=600&fit=crop`,
        similar: [],
      };

      extendedGames.push(newGame);
    }
  });

  // Create similarity relationships
  extendedGames.forEach((game, index) => {
    const sameGenreGames = extendedGames.filter(
      (g) => g.genre === game.genre && g.id !== game.id
    );
    const similarCount = Math.min(5, Math.floor(Math.random() * 6) + 2);

    for (let i = 0; i < similarCount && i < sameGenreGames.length; i++) {
      const randomGame = sameGenreGames[Math.floor(Math.random() * sameGenreGames.length)];
      if (!game.similar.includes(randomGame.id)) {
        game.similar.push(randomGame.id);
      }
    }
  });

  return extendedGames;
}
