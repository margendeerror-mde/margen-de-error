'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { SECCION_COLORS, SECCIONES, INDUSTRIAS, MECANISMOS, TEMAS } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface MinimalPieza {
  href: string;
  seccion: string;
  tema?: string;
  industria?: string;
  mecanismo?: string[];
  titulo: string;
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
    seccion: [],
    tema: [],
    industria: [],
    mecanismo: []
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

      if (type !== 'mecanismo') {
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

  const clearFilters = () => setActiveFilters({ seccion: [], tema: [], industria: [], mecanismo: [] });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || windowSize.width === 0 || piezas.length === 0) return;

    const { width, height } = windowSize;

    // Filter out podcasts
    const validPiezas = piezas.filter(p => p.seccion !== 'podcast' && p.seccion);
    
    // 1. Build Bipartite Graph Data
    const nodesMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    const isPiezaVisible = (p: MinimalPieza) => {
      const filters = activeFiltersRef.current;
      const sF = filters.seccion.length === 0 || filters.seccion.includes(p.seccion);
      const tF = filters.tema.length === 0 || (p.tema ? filters.tema.includes(p.tema) : false);
      const iF = filters.industria.length === 0 || (p.industria ? filters.industria.includes(p.industria) : false);
      const mF = filters.mecanismo.length === 0 || 
                filters.mecanismo.every((m: string) => p.mecanismo?.includes(m));
      return sF && tF && iF && mF;
    };

    const hasActiveFilters = activeFiltersRef.current.seccion.length > 0 || 
                             activeFiltersRef.current.tema.length > 0 || 
                             activeFiltersRef.current.industria.length > 0 || 
                             activeFiltersRef.current.mecanismo.length > 0;

    // Extract all unique mecanismos from the valid pieces
    // If filters are active, only keep mechanisms that are connected to visible pieces
    const visibleMecanismos = new Set<string>();
    validPiezas.forEach(p => {
      if (p.mecanismo) {
        if (!hasActiveFilters || isPiezaVisible(p)) {
          p.mecanismo.forEach(m => visibleMecanismos.add(m));
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

    // Create Pieza Nodes (Satellites) and Links
    validPiezas.forEach(p => {
      const id = p.href;
      nodesMap.set(id, {
        id,
        type: 'pieza',
        name: p.titulo,
        pieza: p,
        radius: isMobile ? 8 : 12,
        x: width / 2 + (Math.random() - 0.5) * width,
        y: height / 2 + (Math.random() - 0.5) * height
      });

      // Link to its mechanisms (only if the mechanism is in the graph)
      if (p.mecanismo) {
        p.mecanismo.forEach(mName => {
          if (visibleMecanismos.has(mName)) {
            links.push({
              source: id,
              target: `mec_${mName}`
            });
          }
        });
      }
    });

    const nodes = Array.from(nodesMap.values());

    const getFilteredOpacity = (p: MinimalPieza | undefined) => {
      if (!p) return 1; // Mechanism nodes don't get filtered directly by these rules, they just fade if no children are visible.
      return isPiezaVisible(p) ? 1 : 0.05;
    };

    // Initialize SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Zoom container
    const gMain = svg.append("g").attr("class", "zoom-container");
    const gLinks = gMain.append("g").attr("class", "links");
    const gNodes = gMain.append("g").attr("class", "nodes");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (e) => gMain.attr("transform", e.transform));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svg.call(zoom as any);

    // Clear mobile selection if user taps the background
    svg.on("click", (event) => {
      // The event target could be the svg element itself or the main g container if they miss a node
      if (event.target.tagName === 'svg' || event.target.tagName === 'g' || event.target.tagName === 'rect') {
        if (selectedNodeIdForMobile) {
          selectedNodeIdForMobile = null;
          hoveredNodeId = null;
          hoveredConnectedIds.clear();
          updateHighlights();
        }
      }
    });

    // Initial Zoom Fit
    d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8);

    // 2. Setup D3 Force Simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(100).strength(0.5))
      .force("charge", d3.forceManyBody().strength(d => (d as GraphNode).type === 'mecanismo' ? -800 : -200))
      .force("collide", d3.forceCollide().radius(d => {
        const node = d as GraphNode;
        if (node.type === 'mecanismo') {
          // Pill collision radius (approximate based on width)
          return Math.max(node.name.length * 4 + 30, 50);
        }
        return node.radius + 10;
      }).iterations(2));

    if (hasActiveFilters) {
      // Bipartite Layout: Mecanismos left, Piezas right
      simulation
        .force("x", d3.forceX<GraphNode>(d => d.type === 'mecanismo' ? width * 0.3 : width * 0.7).strength(0.6))
        .force("y", d3.forceY<GraphNode>(height / 2).strength(0.1));
    } else {
      // Cosmos Hairball
      simulation.force("center", d3.forceCenter(width / 2, height / 2));
    }

    // 3. Render Links
    const linkPaths = gLinks.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#444")
      .attr("stroke-width", 1)
      .style("pointer-events", "none");

    // 4. Render Nodes
    let hoveredNodeId: string | null = null;
    let hoveredConnectedIds: Set<string> = new Set();
    let selectedNodeIdForMobile: string | null = null;

    const nodeGroups = gNodes.selectAll("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node cursor-pointer")
      .on("click", (event, d) => {
        if (!event.defaultPrevented && d.type === 'pieza' && d.pieza) {
          const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
          if (isMobile) {
            if (selectedNodeIdForMobile !== d.id) {
              // First click: Highlight and center connections
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
          // Second click on mobile, or first click on desktop
          router.push(d.pieza.href);
        }
      })
      .on("mouseenter", (event, d) => {
        hoveredNodeId = d.id;
        hoveredConnectedIds = new Set();
        
        // Find connected nodes
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

    // Render Piezas (Circles)
    const piezaGroups = nodeGroups.filter(d => d.type === 'pieza');
    piezaGroups.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.pieza ? (SECCION_COLORS[d.pieza.seccion] || '#666') : '#666')
      .attr("stroke", 'rgba(255,255,255,0.2)')
      .attr("stroke-width", 1)
      .style("transition", "all 0.3s ease");

    // Render Mecanismos (Pills)
    const mecGroups = nodeGroups.filter(d => d.type === 'mecanismo');
    mecGroups.append("rect")
      .attr("rx", 15)
      .attr("ry", 15)
      .attr("height", 30)
      .attr("width", d => Math.max(d.name.length * 8 + 30, 100))
      .attr("x", d => -Math.max(d.name.length * 8 + 30, 100) / 2)
      .attr("y", -15)
      .attr("fill", "#222")
      .attr("stroke", "#CC0000")
      .attr("stroke-width", 2)
      .style("transition", "all 0.3s ease");

    mecGroups.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("y", 1) // slight optical vertical alignment
      .attr("fill", "#FFF")
      .attr("class", "font-sans text-[10px] tracking-widest uppercase font-bold pointer-events-none")
      .style("text-shadow", "0px 2px 4px rgba(0,0,0,1)");

    // HTML Tooltip overlay for Piezas
    const tooltipDiv = d3.select(containerRef.current).append("div")
      .attr("class", "absolute pointer-events-none opacity-0 bg-black/90 backdrop-blur-md border border-white/20 rounded p-2 z-50 text-white font-serif text-xs max-w-[200px] text-center shadow-2xl transition-opacity duration-200")
      .style("transform", "translate(-50%, -120%)");

    nodeGroups.filter(d => d.type === 'pieza')
      .on("mouseenter.tooltip", (event, d) => {
        const [x, y] = d3.pointer(event, containerRef.current);
        tooltipDiv
          .html(d.name)
          .style("left", `${x}px`)
          .style("top", `${y - d.radius}px`)
          .style("opacity", 1);
      })
      .on("mouseleave.tooltip", () => {
        tooltipDiv.style("opacity", 0);
      })
      .on("mousemove.tooltip", (event, d) => {
        const [x, y] = d3.pointer(event, containerRef.current);
        tooltipDiv
          .style("left", `${x}px`)
          .style("top", `${y - d.radius}px`);
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

    // Update Highlight function
    function updateHighlights() {
      // Re-evaluate filters in case they changed, though activeFilters changing triggers a full re-render right now
      nodeGroups.style("opacity", d => {
        const baseOp = d.type === 'pieza' ? getFilteredOpacity(d.pieza) : 1;
        
        if (baseOp < 1) return 0.05; // Filtered out completely

        if (hoveredNodeId) {
          if (d.id === hoveredNodeId || hoveredConnectedIds.has(d.id)) return 1;
          return 0.1;
        }

        return 1;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      linkPaths.attr("stroke", (d: any) => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id;
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
        
        if (hoveredNodeId) {
          if (srcId === hoveredNodeId || tgtId === hoveredNodeId) return "#CC0000";
          return "transparent";
        }
        return "#333";
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("stroke-width", (d: any) => {
        const srcId = typeof d.source === 'string' ? d.source : d.source.id;
        const tgtId = typeof d.target === 'string' ? d.target : d.target.id;
        if (hoveredNodeId && (srcId === hoveredNodeId || tgtId === hoveredNodeId)) return 2;
        return 1;
      });
    }

    // Apply initial filters
    updateHighlights();

    // Simulation Tick
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
  }, [piezas, windowSize, router, isMobile, activeFilters]); // Added activeFilters to dependency array so it redraws/re-filters instantly

  return (
    <div className="flex w-full h-full bg-[#0A0A0A] relative overflow-hidden dark-mode font-sans">
      {/* Sidebar / Bottom Panel */}
      <div className={`
        fixed z-[220] bg-[#0A0A0A]/95 backdrop-blur-xl border-white/10 transition-transform duration-500
        ${isMobile 
          ? `bottom-0 left-0 w-full h-[60%] border-t ${sidebarOpen ? 'translate-y-0' : 'translate-y-full'}`
          : `left-0 top-0 h-full w-72 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
        }
        overflow-y-auto scrollbar-hide
      `}>
        <div className={`p-8 ${isMobile ? 'pt-8' : 'pt-32'}`}>
          <div className="flex justify-between items-center mb-12">
            <h3 className="tag-text !text-white font-bold tracking-widest">FILTROS</h3>
            <button onClick={() => setSidebarOpen(false)} className="tag-text opacity-50 hover:opacity-100">CERRAR</button>
          </div>
          <div className="space-y-10">
            <FilterSection label="SECCIÓN" options={SECCIONES.filter(s => s !== 'podcast')} active={activeFilters.seccion} toggle={(v) => toggleFilter('seccion', v)} isSeccion />
            <FilterSection label="TEMA" options={TEMAS} active={activeFilters.tema} toggle={(v) => toggleFilter('tema', v)} />
            <FilterSection label="INDUSTRIA" options={INDUSTRIAS} active={activeFilters.industria} toggle={(v) => toggleFilter('industria', v)} />
            <FilterSection label="MECANISMO" options={MECANISMOS} active={activeFilters.mecanismo} toggle={(v) => toggleFilter('mecanismo', v)} />
          </div>
        </div>
      </div>

      <button 
        onClick={() => setSidebarOpen(true)} 
        className={`fixed z-[210] transition-all flex items-center gap-2
          ${isMobile 
            ? 'bottom-10 left-6 bg-white text-black px-5 py-3 rounded-full shadow-2xl opacity-100' 
            : 'bottom-8 left-8 tag-text text-white/50 hover:text-white hover:opacity-100'
          }`}
      >
        <span className={isMobile ? "text-[10px] font-bold tracking-widest" : "tag-text"}>
          {isMobile ? 'FILTROS' : '☰ FILTROS'}
        </span>
      </button>

      {isMobile && hasActiveFilters && (
        <button
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black text-[10px] uppercase tracking-widest px-6 py-3 border border-white/30"
          onClick={clearFilters}
        >
          Limpiar filtros
        </button>
      )}



      <div ref={containerRef} className="flex-1 relative">
        <svg ref={svgRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}

function FilterSection({ label, options, active, toggle, isSeccion = false }: { label: string, options: readonly string[], active: string[], toggle: (v: string) => void, isSeccion?: boolean }) {
  return (
    <div>
      <h4 className="tag-text !text-white/30 mb-4 tracking-widest">{label}</h4>
      <div className="flex flex-col gap-2">
        {options.map(opt => {
          const activeColor = isSeccion ? SECCION_COLORS[opt] || '#CC0000' : '#CC0000';
          return (
            <button 
              key={opt} 
              onClick={() => toggle(opt)}
              className="tag-text text-left transition-colors !text-[9px]"
              style={{ color: active.includes(opt) ? activeColor : 'rgba(255,255,255,0.6)' }}
            >
              {active.includes(opt) ? '● ' : '○ '}{opt.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
