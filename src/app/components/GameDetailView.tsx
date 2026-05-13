import { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import { forceCollide } from 'd3-force';
import { ArrowLeft, Star, Calendar, Monitor, User, Info } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import type { Game } from '../data/gameData';
import { genres } from '../data/gameData';

interface GameDetailViewProps {
  game: Game;
  allGames: Game[];
  onGameClick: (game: Game) => void;
  onBack: () => void;
}

interface GraphNode {
  id: string;
  name: string;
  genre: string;
  rating: number;
  game: Game;
  isCenter: boolean;
  fx?: number;
  fy?: number;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

function linkEndpointId(end: unknown): string {
  if (typeof end === 'string') return end;
  if (end && typeof end === 'object' && 'id' in (end as object)) {
    return String((end as { id: string }).id);
  }
  return '';
}

/** 无向邻接：任一端在 similar 里声明对方，即视为相邻（链 a-b-c-… 可沿单向边走遍全链） */
function buildUndirectedAdjacency(games: Game[]): Map<string, Set<string>> {
  const idSet = new Set(games.map((g) => g.id));
  const adj = new Map<string, Set<string>>();
  const link = (a: string, b: string) => {
    if (!idSet.has(a) || !idSet.has(b) || a === b) return;
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  };
  for (const g of games) {
    for (const sid of g.similar) {
      link(g.id, sid);
    }
  }
  return adj;
}

/** 在无向邻接表上从 seed 能到达的所有 id */
function reachableFrom(seedId: string, adj: Map<string, Set<string>>, idSet: Set<string>): Set<string> {
  if (!idSet.has(seedId)) return new Set([seedId]);
  const seen = new Set<string>();
  const stack = [seedId];
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    for (const nb of adj.get(id) ?? []) {
      if (!seen.has(nb)) stack.push(nb);
    }
  }
  return seen;
}

/** 分量内「直接相似」边：谁在 similar 里写了谁就连谁（去重无向） */
function similarityEdgesInComponent(comp: Set<string>, games: Game[]): GraphLink[] {
  const idToGame = new Map(games.map((g) => [g.id, g]));
  const links: GraphLink[] = [];
  const pairSeen = new Set<string>();
  for (const id of comp) {
    const g = idToGame.get(id);
    if (!g) continue;
    for (const sid of g.similar) {
      if (!comp.has(sid) || sid === id) continue;
      const a = id < sid ? id : sid;
      const b = id < sid ? sid : id;
      const key = `${a}|${b}`;
      if (pairSeen.has(key)) continue;
      pairSeen.add(key);
      links.push({ source: a, target: b });
    }
  }
  return links;
}

const coverImageCache = new Map<string, HTMLImageElement>();

function getCoverImage(url: string): HTMLImageElement | undefined {
  return coverImageCache.get(url);
}

function ensureCoverLoading(url: string, onLoaded: () => void) {
  if (!url) return;
  let img = coverImageCache.get(url);
  if (img?.complete) {
    queueMicrotask(onLoaded);
    return;
  }
  if (img) {
    img.addEventListener('load', onLoaded, { once: true });
    img.addEventListener('error', onLoaded, { once: true });
    return;
  }
  img = new Image();
  img.decoding = 'async';
  coverImageCache.set(url, img);
  img.onload = () => onLoaded();
  img.onerror = () => onLoaded();
  img.src = url;
}

function drawCoverOrFallback(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fallbackColor: string
) {
  const img = getCoverImage(url);
  if (img?.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(x, y, w, h);
  }
}

function relationshipCardMetrics(isCenter: boolean, nodeCount = 0) {
  if (isCenter) {
    const imgSize = 96;
    const cardWidth = imgSize;
    const titleBand = imgSize * 0.28;
    return { imgSize, cardWidth, cardHeight: imgSize + titleBand };
  }
  const dense = nodeCount > 26;
  const imgSize = dense ? 52 : 64;
  const cardWidth = imgSize;
  const titleBand = imgSize * 0.26;
  return { imgSize, cardWidth, cardHeight: imgSize + titleBand };
}

export default function GameDetailView({
  game,
  allGames,
  onGameClick,
  onBack,
}: GameDetailViewProps) {
  const fgRef = useRef<any>();
  const fitFocusAfterZoomRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const graphWrapRef = useRef<HTMLDivElement>(null);
  const [graphDims, setGraphDims] = useState({ width: 900, height: 640 });
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [clickedProbeId, setClickedProbeId] = useState<string | null>(null);

  const genreColorMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    genres.forEach((g) => (map[g.name] = g.color));
    return map;
  }, []);

  const genreColor = genreColorMap[game.genre] || '#64748b';

  useEffect(() => {
    const el = graphWrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      const w = Math.max(320, Math.floor(cr.width));
      const h = Math.max(280, Math.floor(cr.height));
      setGraphDims((d) => (d.width === w && d.height === h ? d : { width: w, height: h }));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (fitFocusAfterZoomRef.current) {
        window.clearTimeout(fitFocusAfterZoomRef.current);
        fitFocusAfterZoomRef.current = null;
      }
    };
  }, []);

  /** 适配整张连通图（zoomToFit 已对准全图包围盒），再把视图中心平移到「当前对焦」节点，避免把一节点钉在几何中心造成星形放射观感 */
  const fitEntireGraph = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    if (fitFocusAfterZoomRef.current) {
      window.clearTimeout(fitFocusAfterZoomRef.current);
      fitFocusAfterZoomRef.current = null;
    }
    const pad = Math.max(72, Math.min(200, Math.round(Math.min(graphDims.width, graphDims.height) * 0.1)));
    const ms = 420;
    fg.zoomToFit(ms, pad);
    fitFocusAfterZoomRef.current = window.setTimeout(() => {
      fitFocusAfterZoomRef.current = null;
      let nodes: any[] = [];
      try {
        const d = typeof fg.graphData === 'function' ? fg.graphData() : null;
        nodes = d?.nodes ?? [];
      } catch {
        return;
      }
      const focus = nodes.find((n: any) => n.id === game.id);
      const x = focus?.x;
      const y = focus?.y;
      if (Number.isFinite(x) && Number.isFinite(y)) {
        fg.centerAt(x, y, 320);
      }
    }, ms + 40);
  }, [graphDims.width, graphDims.height, game.id]);

  const bumpRedraw = useCallback(() => {
    fgRef.current?.d3ReheatSimulation?.();
    requestAnimationFrame(() => fitEntireGraph());
  }, [fitEntireGraph]);

  const { graphData, networkStats } = useMemo(() => {
    const idToGame = new Map(allGames.map((g) => [g.id, g]));
    const idSet = new Set(allGames.map((g) => g.id));
    const adj = buildUndirectedAdjacency(allGames);
    const comp = reachableFrom(game.id, adj, idSet);

    const simLinks = similarityEdgesInComponent(comp, allGames);

    const sortedIds = [...comp].sort();
    const validIds = sortedIds.filter((id) => idToGame.has(id));
    const n = validIds.length;
    const spread = 150 + Math.min(1200, 72 * Math.sqrt(Math.max(n, 1)));
    const golden = Math.PI * (3 - Math.sqrt(5));

    const nodes: GraphNode[] = validIds.map((id, i) => {
      const g = idToGame.get(id)!;
      const isFocus = id === game.id;
      const r = spread * Math.sqrt((i + 0.5) / Math.max(n, 1));
      const theta = i * golden;
      return {
        id: g.id,
        name: g.name,
        genre: g.genre,
        rating: g.rating,
        game: g,
        isCenter: isFocus,
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
      };
    });

    const links = simLinks;

    return {
      graphData: { nodes, links },
      networkStats: {
        nodeCount: nodes.length,
        similarEdgeCount: simLinks.length,
        directSimilarCount: game.similar.filter((id) => idSet.has(id)).length,
      },
    };
  }, [game, allGames]);

  useEffect(() => {
    setClickedProbeId(null);
  }, [game.id]);

  const inspectId = hoverNodeId ?? clickedProbeId ?? game.id;

  const highlightBundle = useMemo(() => {
    const neighbor = new Set<string>([inspectId]);
    for (const l of graphData.links) {
      const a = linkEndpointId(l.source);
      const b = linkEndpointId(l.target);
      if (a === inspectId) neighbor.add(b);
      if (b === inspectId) neighbor.add(a);
    }
    return { inspectId, neighbor };
  }, [graphData.links, inspectId]);

  const hasGraph = graphData.nodes.length > 0;

  useEffect(() => {
    const urls = [...new Set(graphData.nodes.map((n) => n.game.cover))];
    urls.forEach((url) => ensureCoverLoading(url, bumpRedraw));
  }, [graphData, bumpRedraw]);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    const n = graphData.nodes.length;
    const linkDist = 120 + Math.min(300, 980 / Math.sqrt(Math.max(n, 2)));
    const focusCollideR = n > 20 ? 80 : 92;
    const leafCollideR = n > 18 ? 58 : 70;

    fg.d3Force(
      'collision',
      forceCollide((node: any) => (node.isCenter ? focusCollideR : leafCollideR))
        .strength(0.86)
        .iterations(6)
    );

    const charge = -102 * Math.sqrt(Math.max(n, 4));
    (fg.d3Force('charge') as { strength: (v: number) => void } | undefined)?.strength(charge);

    (fg.d3Force('link') as { distance: (fn: (l: unknown) => number) => void; strength?: (fn: (l: unknown) => number) => void } | undefined)?.distance(
      () => linkDist
    );
    (fg.d3Force('link') as { strength?: (fn: (l: unknown) => number) => void } | undefined)?.strength?.(() => 0.38);

    fg.d3ReheatSimulation();

    const zoomT = window.setTimeout(fitEntireGraph, 200);

    return () => window.clearTimeout(zoomT);
  }, [graphData, fitEntireGraph]);

  useEffect(() => {
    const t = window.setTimeout(fitEntireGraph, 120);
    return () => window.clearTimeout(t);
  }, [graphDims.width, graphDims.height, fitEntireGraph]);

  return (
    <div className="size-full bg-slate-100 flex flex-col relative overflow-hidden min-h-0 min-w-0">
      {/* Header */}
      <div className="relative z-10 px-4 py-2.5 border-b-2 border-slate-400 bg-gradient-to-r from-sky-50 to-blue-50 shadow-md flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span className="text-white font-extrabold text-xs">BACK</span>
        </button>

        <div className="text-center min-w-0 flex-1 px-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
            {game.name}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-slate-900 font-black text-sm">{game.rating}/10</span>
            </div>
            <span className="text-slate-600">•</span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow"
              style={{
                backgroundColor: genreColor,
              }}
            >
              {game.genre}
            </span>
          </div>
        </div>

        <div className="w-16 sm:w-24 shrink-0" />
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex overflow-hidden min-h-0 min-w-0">
        {/* Left Sidebar - Game Info (narrower → more map area) */}
        <div className="relative z-10 w-[min(100%,14rem)] sm:w-60 border-r-2 border-slate-400 bg-white overflow-y-auto custom-scrollbar shrink-0">
          <div className="p-3 space-y-3">
            {/* Cover Image */}
            <div className="relative">
              <img
                src={game.cover}
                alt={game.name}
                className="w-full h-36 object-cover rounded-lg border-2 border-slate-400 shadow-md"
              />
            </div>

            {/* Info Card */}
            <div className="bg-sky-50 border-2 border-sky-300 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-slate-900" />
                <h3 className="text-slate-900 font-extrabold text-xs">GAME INFO</h3>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-900 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-900 font-extrabold mb-1">RELEASE YEAR</div>
                    <div className="text-slate-900 font-bold text-lg">{game.year}</div>
                  </div>
                </div>

                <div className="h-px bg-slate-400" />

                <div className="flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-slate-900 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-900 font-extrabold mb-1">PLATFORMS</div>
                    <div className="text-slate-900 font-bold text-base">{game.platform}</div>
                  </div>
                </div>

                <div className="h-px bg-slate-400" />

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-900 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-900 font-extrabold mb-1">DEVELOPER</div>
                    <div className="text-slate-900 font-bold text-base">{game.developer}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50 border-2 border-slate-400 rounded-lg p-3 shadow-sm">
              <h3 className="text-slate-900 font-extrabold text-xs mb-1.5">DESCRIPTION</h3>
              <p className="text-slate-900 text-xs leading-relaxed font-medium line-clamp-6">{game.description}</p>
            </div>

            {/* Stats */}
            <div className="bg-sky-50 border-2 border-sky-300 rounded-lg p-3 shadow-sm">
              <h3 className="text-slate-900 font-extrabold text-xs mb-2">NETWORK</h3>
              {hasGraph ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-2xl font-black text-slate-900">{networkStats.nodeCount}</div>
                    <div className="text-[10px] text-slate-900 font-extrabold mt-0.5">Games in cluster</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">{networkStats.similarEdgeCount}</div>
                    <div className="text-[10px] text-slate-900 font-extrabold mt-0.5">Similarity edges</div>
                  </div>
                  <div className="col-span-2 pt-1.5 border-t border-sky-200">
                    <div className="text-lg font-black text-slate-900">{networkStats.directSimilarCount}</div>
                    <div className="text-[10px] text-slate-900 font-extrabold mt-0.5">Directly similar</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="text-slate-900 text-base font-extrabold mb-1">暂无图数据</div>
                  <div className="text-xs text-slate-900 font-bold">当前游戏不在全库列表中，无法构图</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center - Relationship Graph */}
        <div className="relative flex-1 flex flex-col min-h-0 min-w-0">
          {/* Graph title — compact */}
          <div className="relative z-10 shrink-0 px-3 py-1.5 bg-white border-b border-slate-300">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">UNIVERSE RELATIONSHIP MAP</h2>
            <p className="text-slate-600 text-[11px] sm:text-xs leading-snug mt-0.5 font-medium">
              {hasGraph
                ? 'Same similarity-connected cluster. Hover or click a game: its direct similarity links turn bold blue; other nodes and links fade. Red frame = current focus.'
                : 'Not in dataset — no graph.'}
            </p>
          </div>

          {/* Graph Container — fills remaining width/height */}
          <div ref={graphWrapRef} className="relative flex-1 min-h-0 w-full min-w-0 bg-slate-50">
            {hasGraph ? (
              <>
                <ForceGraph2D
                  ref={fgRef}
                  graphData={graphData}
                  width={graphDims.width}
                  height={graphDims.height}
                  nodeRelSize={4}
                  nodeVal={(node: any) => (node.isCenter ? 30 : 18)}
                  nodeCanvasObjectMode={() => 'replace'}
                  nodePointerAreaPaint={(node: any, color: string, ctx, globalScale) => {
                    const { cardWidth, cardHeight } = relationshipCardMetrics(node.isCenter, graphData.nodes.length);
                    const x = (node.x || 0) - cardWidth / 2;
                    const y = (node.y || 0) - cardHeight / 2;
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, cardWidth, cardHeight);
                  }}
                  nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const isCenter = node.isCenter;
                    const color = genreColorMap[node.genre] || '#64748b';
                    const { imgSize, cardWidth, cardHeight } = relationshipCardMetrics(isCenter, graphData.nodes.length);
                    const coverUrl = node.game?.cover ?? '';

                    const x = (node.x || 0) - cardWidth / 2;
                    const y = (node.y || 0) - cardHeight / 2;

                    const { neighbor, inspectId: hid } = highlightBundle;
                    const lit = neighbor.has(node.id);
                    const isInspectTarget = node.id === hid;

                    ctx.save();
                    if (!lit) ctx.globalAlpha = 0.28;

                    if (isCenter) {
                      ctx.shadowColor = '#f43f5e';
                      ctx.shadowBlur = 22 / globalScale;
                      ctx.fillStyle = '#ffffff';
                      ctx.fillRect(x, y, cardWidth, cardHeight);
                      ctx.shadowBlur = 0;

                      ctx.strokeStyle = '#f43f5e';
                      ctx.lineWidth = 5 / globalScale;
                      ctx.strokeRect(x, y, cardWidth, cardHeight);

                      drawCoverOrFallback(ctx, coverUrl, x, y, cardWidth, imgSize, color);

                      ctx.fillStyle = '#0f172a';
                      ctx.font = `bold ${12 / globalScale}px sans-serif`;
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';

                      const nameY = y + imgSize + (cardHeight - imgSize) / 2;
                      const maxWidth = cardWidth - 10 / globalScale;
                      let name = node.name;
                      if (ctx.measureText(name).width > maxWidth) {
                        while (ctx.measureText(name + '...').width > maxWidth && name.length > 0) {
                          name = name.slice(0, -1);
                        }
                        name += '...';
                      }
                      ctx.fillText(name, node.x || 0, nameY);

                      const cbX = x + cardWidth - 11 / globalScale;
                      const cbY = y + 11 / globalScale;
                      ctx.fillStyle = '#fbbf24';
                      ctx.fillRect(cbX - 16 / globalScale, cbY - 9 / globalScale, 32 / globalScale, 18 / globalScale);
                      ctx.fillStyle = '#000';
                      ctx.font = `bold ${9 / globalScale}px sans-serif`;
                      ctx.textAlign = 'center';
                      ctx.fillText(node.rating.toString(), cbX, cbY);
                    } else {
                      ctx.shadowColor = color;
                      ctx.shadowBlur = 14 / globalScale;
                      ctx.fillStyle = '#ffffff';
                      ctx.fillRect(x, y, cardWidth, cardHeight);
                      ctx.shadowBlur = 0;

                      ctx.strokeStyle = color;
                      ctx.lineWidth = 3 / globalScale;
                      ctx.strokeRect(x, y, cardWidth, cardHeight);

                      drawCoverOrFallback(ctx, coverUrl, x, y, cardWidth, imgSize, color);

                      ctx.fillStyle = '#0f172a';
                      ctx.font = `bold ${9 / globalScale}px sans-serif`;
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';

                      const nameY = y + imgSize + (cardHeight - imgSize) / 2;
                      const maxWidth = cardWidth - 8 / globalScale;
                      let name = node.name;
                      if (ctx.measureText(name).width > maxWidth) {
                        while (ctx.measureText(name + '...').width > maxWidth && name.length > 0) {
                          name = name.slice(0, -1);
                        }
                        name += '...';
                      }
                      ctx.fillText(name, node.x || 0, nameY);

                      const badgeX = x + cardWidth - 10 / globalScale;
                      const badgeY = y + 10 / globalScale;
                      ctx.fillStyle = '#fbbf24';
                      ctx.fillRect(
                        badgeX - 14 / globalScale,
                        badgeY - 8 / globalScale,
                        28 / globalScale,
                        16 / globalScale
                      );
                      ctx.fillStyle = '#000';
                      ctx.font = `bold ${8 / globalScale}px sans-serif`;
                      ctx.textAlign = 'center';
                      ctx.fillText(node.rating.toString(), badgeX, badgeY);
                    }

                    ctx.restore();

                    if (isInspectTarget && !isCenter && lit) {
                      ctx.strokeStyle = '#0ea5e9';
                      ctx.lineWidth = 5 / globalScale;
                      ctx.strokeRect(x - 2 / globalScale, y - 2 / globalScale, cardWidth + 4 / globalScale, cardHeight + 4 / globalScale);
                    }
                  }}
                  linkColor={(link: any) => {
                    const a = linkEndpointId(link.source);
                    const b = linkEndpointId(link.target);
                    const hid = highlightBundle.inspectId;
                    return a === hid || b === hid ? '#0284c7' : '#e2e8f0';
                  }}
                  linkWidth={(link: any) => {
                    const a = linkEndpointId(link.source);
                    const b = linkEndpointId(link.target);
                    const hid = highlightBundle.inspectId;
                    return a === hid || b === hid ? 4.5 : 1.15;
                  }}
                  linkLineDash={null}
                  linkDirectionalParticles={0}
                  onEngineStop={fitEntireGraph}
                  onNodeHover={(node: any) => setHoverNodeId(node?.id ?? null)}
                  onBackgroundClick={() => {
                    setHoverNodeId(null);
                    setClickedProbeId(null);
                  }}
                  onNodeClick={(node: any) => {
                    setClickedProbeId(node?.id ?? null);
                    if (node.game?.id !== game.id) {
                      onGameClick(node.game);
                    }
                  }}
                  nodeLabel={(node: any) => `
                <div style="
                  background: white;
                  padding: 16px 20px;
                  border-radius: 12px;
                  border: 4px solid ${genreColorMap[node.genre]};
                  font-family: system-ui, -apple-system, sans-serif;
                  font-size: 14px;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
                ">
                  <div style="color: #0f172a; font-weight: 900; margin-bottom: 8px; font-size: 16px;">${node.name}</div>
                  <div style="color: #1e293b; margin-bottom: 4px; font-weight: 700;">Genre: ${node.genre}</div>
                  <div style="color: #b45309; font-weight: 800;">Rating: ${node.rating}/10</div>
                    ${node.isCenter ? '<div style="color: #be123c; margin-top: 8px; font-weight: 900;">★ 当前对焦</div>' : '<div style="color: #0c4a6e; margin-top: 8px; font-size: 12px; font-weight: 800;">点击切换对焦 →</div>'}
                  </div>
                `}
                  backgroundColor="#f8fafc"
                  cooldownTicks={320}
                  d3VelocityDecay={0.4}
                  d3AlphaDecay={0.026}
                  enableNodeDrag={false}
                  enableZoomInteraction={true}
                  enablePanInteraction={true}
                />

                {/* Compact legend — bottom-left, minimal footprint */}
                <div className="absolute bottom-3 left-3 z-10 bg-white/95 border-2 border-slate-400 rounded-lg px-3 py-2 shadow-lg max-w-[min(100%,20rem)]">
                  <div className="text-slate-900 font-extrabold text-xs mb-1.5">LEGEND</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-900" />
                      Focus
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-6 h-1 bg-sky-500" />
                      Hover inspect
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-6 h-0.5 bg-slate-900" />
                      Similar edges
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="size-full flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-sky-100 border-4 border-slate-900 flex items-center justify-center shadow-xl">
                    <div className="text-6xl">🌌</div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">No Connections Found</h3>
                  <p className="text-slate-900 text-base mb-5 font-bold">
                    This game doesn't have relationship data in our system yet.
                  </p>
                  <div className="bg-white border-3 border-slate-400 rounded-xl p-5 shadow-lg">
                    <p className="text-slate-900 text-base leading-relaxed font-bold">
                      You can still explore other games by returning to the grid view
                      or searching for games with similar genres.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
