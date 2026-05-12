import { useEffect, useRef, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { genres } from '../data/gameData';
import type { Game } from '../data/gameData';

interface GameGraphProps {
  games: Game[];
  allGames: Game[];
  selectedGame: Game | null;
  selectedGenre: string | null;
  hoveredGame: string | null;
  onGameClick: (game: Game) => void;
  onGameHover: (gameId: string | null) => void;
}

interface GraphNode {
  id: string;
  name: string;
  genre: string;
  rating: number;
  game: Game;
}

interface GraphLink {
  source: string;
  target: string;
}

export default function GameGraph({
  games,
  allGames,
  selectedGame,
  selectedGenre,
  hoveredGame,
  onGameClick,
  onGameHover,
}: GameGraphProps) {
  const fgRef = useRef<any>();

  const genreColorMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    genres.forEach((g) => (map[g.name] = g.color));
    return map;
  }, []);

  const graphData = useMemo(() => {
    // Limit nodes for performance - sample intelligently
    const MAX_NODES = 500;
    let gamesToShow = games;

    // If too many games, intelligently sample
    if (games.length > MAX_NODES) {
      // Always include high-rated games
      const highRated = games.filter(g => g.rating >= 8.5);
      const others = games.filter(g => g.rating < 8.5);

      // Shuffle and sample from others
      const shuffled = others.sort(() => Math.random() - 0.5);
      const sampled = shuffled.slice(0, MAX_NODES - highRated.length);

      gamesToShow = [...highRated, ...sampled];
    }

    const nodes: GraphNode[] = gamesToShow.map((game) => ({
      id: game.id,
      name: game.name,
      genre: game.genre,
      rating: game.rating,
      game,
    }));

    const links: GraphLink[] = [];
    const gameIds = new Set(gamesToShow.map((g) => g.id));

    gamesToShow.forEach((game) => {
      game.similar.forEach((similarId) => {
        if (gameIds.has(similarId) && game.id < similarId) {
          links.push({
            source: game.id,
            target: similarId,
          });
        }
      });
    });

    return { nodes, links };
  }, [games]);

  useEffect(() => {
    if (fgRef.current && selectedGame) {
      const node = graphData.nodes.find((n) => n.id === selectedGame.id);
      if (node) {
        fgRef.current.centerAt(node.x, node.y, 500);
        fgRef.current.zoom(2, 500);
      }
    }
  }, [selectedGame, graphData.nodes]);

  const getNodeColor = (node: GraphNode) => {
    if (selectedGame) {
      if (node.id === selectedGame.id) {
        return '#f0abfc';
      }
      if (selectedGame.similar.includes(node.id)) {
        return '#67e8f9';
      }
      return '#475569';
    }

    if (selectedGenre && node.genre !== selectedGenre) {
      return '#475569';
    }

    return genreColorMap[node.genre] || '#64748b';
  };

  const getNodeOpacity = (node: GraphNode) => {
    if (hoveredGame && node.id === hoveredGame) {
      return 1;
    }

    if (selectedGame) {
      if (node.id === selectedGame.id || selectedGame.similar.includes(node.id)) {
        return 1;
      }
      return 0.2;
    }

    if (selectedGenre && node.genre !== selectedGenre) {
      return 0.2;
    }

    return 0.9;
  };

  const getLinkOpacity = (link: GraphLink) => {
    if (selectedGame) {
      const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;

      if (sourceId === selectedGame.id || targetId === selectedGame.id) {
        return 0.6;
      }
      return 0.1;
    }

    return 0.3;
  };

  return (
    <div className="size-full relative">
      {/* Info overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 font-mono text-xs">
        <div className="text-cyan-300 mb-2">NAVIGATION</div>
        <div className="text-white/60 space-y-1">
          <div>• Click node to view details</div>
          <div>• Scroll to zoom</div>
          <div>• Drag to pan</div>
          <div>• Hover for info</div>
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={(node: any) => `
          <div style="
            background: rgba(0, 0, 0, 0.9);
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid ${genreColorMap[node.genre]}60;
            font-family: monospace;
            font-size: 11px;
          ">
            <div style="color: #67e8f9; font-weight: bold; margin-bottom: 4px;">${node.name}</div>
            <div style="color: #a5b4fc;">Genre: ${node.genre}</div>
            <div style="color: #fbbf24;">Rating: ${node.rating}/10</div>
          </div>
        `}
        nodeRelSize={6}
        nodeVal={(node: any) => node.rating * 2}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const size = Math.sqrt(node.rating * 2) * 4;
          const color = getNodeColor(node);
          const opacity = getNodeOpacity(node);

          // Glow effect
          const isHighlighted =
            node.id === selectedGame?.id ||
            (selectedGame && selectedGame.similar.includes(node.id)) ||
            node.id === hoveredGame;

          if (isHighlighted) {
            const gradient = ctx.createRadialGradient(
              node.x || 0,
              node.y || 0,
              0,
              node.x || 0,
              node.y || 0,
              size * 2
            );
            gradient.addColorStop(0, `${color}80`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x || 0, node.y || 0, size * 2, 0, 2 * Math.PI);
            ctx.fill();
          }

          // Main node
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
          ctx.fillStyle = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
          ctx.fill();

          // Node border
          if (node.id === selectedGame?.id) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2 / globalScale;
            ctx.stroke();
          }

          // Label for selected or hovered
          if (isHighlighted && globalScale > 1.5) {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, node.x || 0, (node.y || 0) - size - 8 / globalScale);
          }
        }}
        linkColor={(link: any) => {
          const opacity = getLinkOpacity(link);
          return `rgba(103, 232, 249, ${opacity})`;
        }}
        linkWidth={(link: any) => {
          if (selectedGame) {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            if (sourceId === selectedGame.id || targetId === selectedGame.id) {
              return 2;
            }
          }
          return 0.5;
        }}
        linkDirectionalParticles={selectedGame ? 2 : 0}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.004}
        onNodeClick={(node: any) => onGameClick(node.game)}
        onNodeHover={(node: any) => onGameHover(node?.id || null)}
        backgroundColor="rgba(0, 0, 0, 0)"
        cooldownTicks={100}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
