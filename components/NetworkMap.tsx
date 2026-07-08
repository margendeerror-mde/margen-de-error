'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { VOLUMENES, VOLUMEN_COLORS, INDUSTRIAS, ATLAS_DISTORSIONES, ATLAS_LIMITES, TEMAS } from '@/lib/types';
import type { AtlasMecanismo } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface MinimalPieza {
  href: string;
  temporada?: number;
  tema?: string;
  industria?: string;
  atlas?: string[];
  mecanismo?: string[];
  titulo: string;
  publicado?: boolean;
}

type NodeType = 'mecanismo' | 'pieza';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: NodeType;
  name: string;
  pieza?: MinimalPieza;
  radius: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

export default function NetworkMap({ piezas }: { piezas: MinimalPieza[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    temporada: [],
    tema: [],
    industria: [],
    atlas: []
  });

  const activeFiltersRef = useRef(activeFilters);
  useEffect(() => {
    activeFiltersRef.current = activeFilters;
  }, [activeFilters]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setWindowSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const isMobile = useMemo(() => windowSize.width < 768, [windowSize.width]);
  const hasActiveFilters = useMemo(() => 
    Object.values(activeFilters).some(arr => arr.length > 0), 
  [activeFilters]);

  const toggleFilter = (type: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[type] || [];
      const isAlreadyActive = current.includes(value);

      if (type !== 'atlas') {
        return {
          ...prev,
          [type]: isAlreadyActive ? [] : [value]
        };
      }

      return {
        ...prev,
        [type]: isAlreadyActive ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  const clearFilters = () => setActiveFilters({ temporada: [], tema: [], industria: [], atlas: [] });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || windowSize.width === 0 || piezas.length === 0) return;

    const { width, height } = windowSize;

    // Filter out pieces without a season (archive)
    const validPiezas = piezas.filter(p => p.temporada);
    
    // 1. Build Bipartite Graph Data
    const nodesMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    const isPiezaVisible = (p: MinimalPieza) => {
      const filters = activeFiltersRef.current;
      const tF = filters.temporada.length === 0 || (p.temporada ? filters.temporada.includes(p.temporada.toString()) : false);
      const teF = filters.tema.length === 0 || (p.tema ? filters.tema.includes(p.tema) : false);
      const iF = filters.industria.length === 0 || (p.industria ? filters.industria.includes(p.industria) : false);
      const mF = filters.atlas.length === 0 || 
                filters.atlas.every((m: string) => p.atlas?.includes(m) || p.mecanismo?.includes(m));
      return tF && teF && iF && mF;
    };

    const hasActiveFilters = activeFiltersRef.current.temporada?.length > 0 || 
                             activeFiltersRef.current.tema?.length > 0 || 
                             activeFiltersRef.current.industria?.length > 0 || 
                             activeFiltersRef.current.atlas?.length > 0;

    const visibleMecanismos = new Set<string>();
    validPiezas.forEach(p => {
      const allMecanismos = [...(p.atlas || []), ...(p.mecanismo || [])];
      if (allMecanismos.length > 0) {
        if (!hasActiveFilters || isPiezaVisible(p)) {
          allMecanismos.forEach(m => visibleMecanismos.add(m));
        }
      }
    });

    // Create Mecanismo Nodes (Hubs)
    visibleMecanismos.forEach(mName => {
      const id = `mec_${mName}`;
      nodesMap.set(id, {
        id,
        type: 'mecanismo',
        name: mName.toUpperCase().replace(/-/g, ' '),
        radius: isMobile ? 30 : 40,
        x: width / 2 + (Math.random() - 0.5) * 100,
        y: height / 2 + (Math.random() - 0.5) * 100
      });
    });

    // Create Pieza Nodes (Satellites)
    validPiezas.forEach(p => {
      const id = p.href;
      nodesMap.set(id, {
        id,
        type: 'pieza',
        name: p.titulo,
        pieza: p,
        radius: isMobile ? 12 : 16, // slightly larger for squares
        x: width / 2 + (Math.random() - 0.5) * width,
        y: height / 2 + (Math.random() - 0.5) * height
      });

      const allMecanismos = [...(p.atlas || []), ...(p.mecanismo || [])];
      if (allMecanismos.length > 0) {
        if (!hasActiveFilters || isPiezaVisible(p)) {
          allMecanismos.forEach(mName => {
            if (visibleMecanismos.has(mName)) {
              links.push({
                source: id,
                target: `mec_${mName}`
              });
            }
          });
        }
      }
    });

    const nodes = Array.from(nodesMap.values());

    const getFilteredOpacity = (p: MinimalPieza | undefined) => {
      if (!p) return 1;
      const isPublished = p.publicado !== false;
      if (!isPiezaVisible(p)) return 0.05;
      return isPublished ? 1 : 0.2;
    };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const gMain = svg.append("g").attr("class", "zoom-container");
    const gLinks = gMain.append("g").attr("class", "links");
    const gNodes = gMain.append("g").attr("class", "nodes");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (e) => gMain.attr("transform", e.transform));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svg.call(zoom as any);

    svg.on("click", (event) => {
      if (event.target.tagName === 'svg' || event.target.tagName === 'g' || event.target.tagName === 'rect') {
        if (selectedNodeIdForMobile) {
          selectedNodeIdForMobile = null;
          hoveredNodeId = null;
          hoveredConnectedIds.clear();
          updateHighlights();
        }
      }
    });

    d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8);

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(120).strength(0.5))
      .force("charge", d3.forceManyBody().strength(d => (d as GraphNode).type === 'mecanismo' ? -1000 : -300))
      .force("collide", d3.forceCollide().radius(d => {
        const node = d as GraphNode;
        if (node.type === 'mecanismo') {
          return Math.max(node.name.length * 5 + 30, 60);
        }
        return node.radius + 15;
      }).iterations(3));

    if (hasActiveFilters) {
      simulation
        .force("x", d3.forceX<GraphNode>(d => d.type === 'mecanismo' ? width * 0.3 : width * 0.7).strength(0.6))
        .force("y", d3.forceY<GraphNode>(height / 2).strength(0.1));
    } else {
      simulation.force("center", d3.forceCenter(width / 2, height / 2));
    }

    const linkPaths = gLinks.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#000") // Black lines
      .attr("stroke-width", 1)
      .style("pointer-events", "none");

    let hoveredNodeId: string | null = null;
    let hoveredConnectedIds: Set<string> = new Set();
    let selectedNodeIdForMobile: string | null = null;

    const nodeGroups = gNodes.selectAll("g.node")
      .data(nodes)
      .join("g")
      .attr("class", d => `node ${d.type === 'pieza' && d.pieza?.publicado === false ? 'cursor-not-allowed' : 'cursor-pointer'}`)
      .on("click", (event, d) => {
        if (!event.defaultPrevented && d.type === 'mecanismo') {
          const mName = d.id.replace('mec_', '');
          toggleFilter('atlas', mName);
          return;
        }

        if (!event.defaultPrevented && d.type === 'pieza' && d.pieza) {
          if (d.pieza.publicado === false) return; // Block clicks on unpublished items
          const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
          if (isMobile) {
            if (selectedNodeIdForMobile !== d.id) {
              selectedNodeIdForMobile = d.id;
              hoveredNodeId = d.id;
              hoveredConnectedIds = new Set();
              links.forEach(l => {
                const srcId = typeof l.source === 'string' ? l.source : l.source.id;
                const tgtId = typeof l.target === 'string' ? l.target : l.target.id;
                if (srcId === d.id) hoveredConnectedIds.add(tgtId);
                if (tgtId === d.id) hoveredConnectedIds.add(srcId);
              });
              updateHighlights();
              event.preventDefault();
              return;
            }
          }
          router.push(d.pieza.href);
        }
      })
      .on("mouseenter", (event, d) => {
        hoveredNodeId = d.id;
        hoveredConnectedIds = new Set();
        
        links.forEach(l => {
          const srcId = typeof l.source === 'string' ? l.source : l.source.id;
          const tgtId = typeof l.target === 'string' ? l.target : l.target.id;
          if (srcId === d.id) hoveredConnectedIds.add(tgtId);
          if (tgtId === d.id) hoveredConnectedIds.add(srcId);
        });

        updateHighlights();
      })
      .on("mouseleave", () => {
        hoveredNodeId = null;
        hoveredConnectedIds.clear();
        updateHighlights();
      });

    // Render Piezas (Squares instead of circles for brutalist look)
    const piezaGroups = nodeGroups.filter(d => d.type === 'pieza');
    piezaGroups.append("rect")
      .attr("width", d => d.radius * 2)
      .attr("height", d => d.radius * 2)
      .attr("x", d => -d.radius)
      .attr("y", d => -d.radius)
      .attr("fill", d => (d.pieza && d.pieza.temporada) ? (VOLUMEN_COLORS[d.pieza.temporada] || '#999') : '#999')
      .attr("stroke", '#000') // Black borders
      .attr("stroke-width", 2)
      .style("transition", "all 0.3s ease");

    // Render Mecanismos (Sharp Rectangles)
    const mecGroups = nodeGroups.filter(d => d.type === 'mecanismo');
    mecGroups.append("rect")
      .attr("rx", 0) // sharp
      .attr("ry", 0)
      .attr("height", 32)
      .attr("width", d => Math.max(d.name.length * 8 + 30, 100))
      .attr("x", d => -Math.max(d.name.length * 8 + 30, 100) / 2)
      .attr("y", -16)
      .attr("fill", "#000") // Black background
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .style("transition", "all 0.3s ease");

    mecGroups.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("y", 2)
      .attr("fill", "#FFF") // White text
      .attr("class", "font-mono text-[10px] tracking-widest uppercase font-bold pointer-events-none");

    // Tooltip overlay
    const tooltipDiv = d3.select(containerRef.current).append("div")
      .attr("class", "absolute pointer-events-none opacity-0 bg-white border-2 border-black p-3 z-50 text-black font-serif text-sm max-w-[250px] text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-opacity duration-200")
      .style("transform", "translate(-50%, -120%)");

    nodeGroups.filter(d => d.type === 'pieza')
      .on("mouseenter.tooltip", (event, d) => {
        const [x, y] = d3.pointer(event, containerRef.current);
        tooltipDiv
          .html(`<strong>${d.name}</strong>`)
          .style("left", `${x}px`)
          .style("top", `${y - d.radius - 10}px`)
          .style("opacity", 1);
      })
      .on("mouseleave.tooltip", () => {
        tooltipDiv.style("opacity", 0);
      })
      .on("mousemove.tooltip", (event, d) => {
        const [x, y] = d3.pointer(event, containerRef.current);
        tooltipDiv
          .style("left", `${x}px`)
          .style("top", `${y - d.radius - 10}px`);
      });

    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeGroups.call(drag as any);

    function updateHighlights() {
      nodeGroups.style("opacity", d => {
        const baseOp = d.type === 'pieza' ? getFilteredOpacity(d.pieza) : 1;
        if (baseOp < 1) return 0.1;
        if (hoveredNodeId) {
          if (d.id === hoveredNodeId || hoveredConnectedIds.has(d.id)) return 1;
          return 0.2;
        }
        return 1;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      linkPaths.attr("stroke", (d: any) => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id;
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
        if (hoveredNodeId) {
          if (srcId === hoveredNodeId || tgtId === hoveredNodeId) return "#000";
          return "transparent";
        }
        return "rgba(0,0,0,0.3)";
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("stroke-width", (d: any) => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id;
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
        if (hoveredNodeId && (srcId === hoveredNodeId || tgtId === hoveredNodeId)) return 2;
        return 1;
      });
    }

    updateHighlights();

    simulation.on("tick", () => {
      linkPaths
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("x1", (d: any) => d.source.x)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("y1", (d: any) => d.source.y)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("x2", (d: any) => d.target.x)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr("y2", (d: any) => d.target.y);
      nodeGroups.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
      tooltipDiv.remove();
    };
  }, [piezas, windowSize, router, isMobile, activeFilters]);

  return (
    <div className="flex w-full h-full bg-[#F0EDE8] relative overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`
        fixed z-[220] bg-white border-black transition-transform duration-500 shadow-[8px_0px_0px_0px_rgba(0,0,0,0.1)]
        ${isMobile 
          ? `bottom-0 left-0 w-full h-[60%] border-t-2 ${sidebarOpen ? 'translate-y-0' : 'translate-y-full'}`
          : `left-0 top-0 h-full w-80 border-r-2 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
        }
        overflow-y-auto scrollbar-hide
      `}>
        <div className={`p-8 ${isMobile ? 'pt-8' : 'pt-32'}`}>
          <div className="flex justify-between items-center mb-12 border-b-2 border-black pb-4">
            <h3 className="font-mono text-lg font-bold uppercase tracking-widest text-black">FILTROS</h3>
            <div className="flex gap-4 items-center">
              {hasActiveFilters && (
                <button onClick={clearFilters} className="font-mono text-[10px] font-bold text-accent hover:text-black uppercase tracking-widest">LIMPIAR</button>
              )}
              <button onClick={() => setSidebarOpen(false)} className="font-mono text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-widest">CERRAR</button>
            </div>
          </div>
          <div className="space-y-10">
            <FilterSection label="VOLÚMENES" options={Object.keys(VOLUMENES)} active={activeFilters.temporada} toggle={(v) => toggleFilter('temporada', v)} isTemporada />
            <FilterSection label="TEMA" options={TEMAS} active={activeFilters.tema} toggle={(v) => toggleFilter('tema', v)} />
            <FilterSection label="INDUSTRIA" options={INDUSTRIAS} active={activeFilters.industria} toggle={(v) => toggleFilter('industria', v)} />
            <FilterSection label="DISTORSIÓN" options={ATLAS_DISTORSIONES} active={activeFilters.atlas} toggle={(v) => toggleFilter('atlas', v)} />
            <FilterSection label="LÍMITE" options={ATLAS_LIMITES} active={activeFilters.atlas} toggle={(v) => toggleFilter('atlas', v)} />
          </div>
        </div>
      </div>

      <div className={`fixed z-[210] flex gap-4 transition-all ${isMobile ? 'bottom-10 w-full justify-center px-6' : 'bottom-8 left-8'}`}>
        <button 
          onClick={() => setSidebarOpen(true)} 
          className={`flex items-center justify-center font-mono font-bold uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors
            ${isMobile 
              ? 'bg-black text-white px-6 py-3 flex-1' 
              : 'bg-white text-black px-6 py-3 hover:bg-black hover:text-white'
            }`}
        >
          <span className="text-xs">
            ☰ FILTROS {hasActiveFilters && '(ACTIVOS)'}
          </span>
        </button>

        {hasActiveFilters && (
          <button
            className={`font-mono font-bold uppercase tracking-widest text-xs transition-colors border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2
              ${isMobile
                ? 'bg-white text-black px-6 py-3 flex-1'
                : 'bg-gray-200 text-black px-6 py-3 hover:bg-black hover:text-white'
              }`}
            onClick={clearFilters}
          >
            LIMPIAR <span className="text-lg leading-none hidden md:inline">×</span>
          </button>
        )}
      </div>

      <div ref={containerRef} className="flex-1 relative cursor-crosshair">
        <svg ref={svgRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}

function FilterSection({ label, options, active, toggle, isTemporada = false }: { label: string, options: readonly string[], active: string[], toggle: (v: string) => void, isTemporada?: boolean }) {
  return (
    <div>
      <h4 className="font-mono text-xs font-bold text-black uppercase tracking-widest mb-4 bg-gray-200 p-2 border-2 border-black">{label}</h4>
      <div className="flex flex-col gap-2">
        {options.map(opt => {
          const activeColor = isTemporada ? VOLUMEN_COLORS[Number(opt)] || '#000' : '#000';
          return (
            <button 
              key={opt} 
              onClick={() => toggle(opt)}
              className="font-mono text-left transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 p-1"
              style={{ color: active.includes(opt) ? activeColor : '#666' }}
            >
              <span className={`w-3 h-3 border-2 inline-block ${active.includes(opt) ? 'bg-black border-black' : 'bg-transparent border-gray-400'}`} style={{ backgroundColor: active.includes(opt) ? activeColor : 'transparent', borderColor: active.includes(opt) ? activeColor : '#999' }}></span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
