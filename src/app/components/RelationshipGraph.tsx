import { useEffect, useRef, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { Game } from '../data/gameData';
import { genres } from '../data/gameData';

interface RelationshipGraphProps {
  centerGame: Game;
  similarGames: Game[];
  onGameClick: (game: Game) => void;
}

interface GraphNode {
  id: string;
  name: string;
  genre: string;
  rating: number;
  game: Game;
  isCenter: boolean;
}

interface GraphLink {
  source: string;
  target: string;
}

export default function RelationshipGraph({
  centerGame,
  similarGames,
  onGameClick,
}: RelationshipGraphProps) {
  const fgRef = useRef<any>();

  const genreColorMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    genres.forEach((g) => (map[g.name] = g.color));
    return map;
  }, []);

  const graphData = useMemo(() => {
    // Center node
    const centerNode: GraphNode = {
      id: centerGame.id,
      name: centerGame.name,
      genre: centerGame.genre,
      rating: centerGame.rating,
      game: centerGame,
      isCenter: true,
    };

    // Similar game nodes
    const similarNodes: GraphNode[] = similarGames.map((game) => ({
      id: game.id,
      name: game.name,
      genre: game.genre,
      rating: game.rating,
      game: game,
      isCenter: false,
    }));

    const nodes = [centerNode, ...similarNodes];

    // Create links from center to all similar games
    const links: GraphLink[] = similarGames.map((game) => ({
      source: centerGame.id,
      target: game.id,
    }));

    // Add links between similar games if they reference each other
    similarGames.forEach((game1, i) => {
      similarGames.slice(i + 1).forEach((game2) => {
        if (
          game1.similar.includes(game2.id) ||
          game2.similar.includes(game1.id)
        ) {
          links.push({
            source: game1.id,
            target: game2.id,
          });
        }
      });
    });

    return { nodes, links };
  }, [centerGame, similarGames]);

  useEffect(() => {
    if (fgRef.current) {
      // Center the graph on mount
      setTimeout(() => {
        fgRef.current?.zoomToFit(400, 20);
      }, 100);
    }
  }, [graphData]);

  return (
    <div className="size-full bg-black/40 rounded-lg border border-cyan-500/20 overflow-hidden relative">
      {/* Title */}
      <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-3 py-1.5">
        <div className="text-cyan-300 text-xs font-mono font-bold">RELATIONSHIP MAP</div>
      </div>

      {/* Graph */}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={420}
        height={350}
        nodeRelSize={8}
        nodeVal={(node: any) => (node.isCenter ? 20 : 10)}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const isCenter = node.isCenter;
          const size = isCenter ? 12 : 8;
          const color = genreColorMap[node.genre] || '#64748b';

          // Glow effect for center node
          if (isCenter) {
            const gradient = ctx.createRadialGradient(
              node.x || 0,
              node.y || 0,
              0,
              node.x || 0,
              node.y || 0,
              size * 3
            );
            gradient.addColorStop(0, `${color}80`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x || 0, node.y || 0, size * 3, 0, 2 * Math.PI);
            ctx.fill();
          }

          // Main node
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();

          // Border
          ctx.strokeStyle = isCenter ? '#f0abfc' : '#ffffff';
          ctx.lineWidth = isCenter ? 3 / globalScale : 1.5 / globalScale;
          ctx.stroke();

          // Label
          const label = node.name;
          const fontSize = isCenter ? 10 / globalScale : 8 / globalScale;
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Text background
          const textWidth = ctx.measureText(label).width;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(
            (node.x || 0) - textWidth / 2 - 2,
            (node.y || 0) + size + 2,
            textWidth + 4,
            fontSize + 2
          );

          // Text
          ctx.fillStyle = isCenter ? '#f0abfc' : '#67e8f9';
          ctx.fillText(label, node.x || 0, (node.y || 0) + size + fontSize / 2 + 4);
        }}
        linkColor={() => '#06b6d480'}
        linkWidth={2}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.006}
        linkDirectionalParticleColor={() => '#67e8f9'}
        onNodeClick={(node: any) => onGameClick(node.game)}
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
        backgroundColor="transparent"
        cooldownTicks={100}
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.02}
        enableNodeDrag={false}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg px-3 py-2 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-400 border-2 border-white" />
          <span className="text-xs font-mono text-white/80">Center Game</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 border border-white" />
          <span className="text-xs font-mono text-white/80">Similar Games</span>
        </div>
      </div>

      {/* Instruction */}
      <div className="absolute bottom-3 right-3 z-10 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-3 py-1.5">
        <div className="text-cyan-300/60 text-xs font-mono">Click node to navigate</div>
      </div>
    </div>
  );
}
