'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Pieza } from '@/lib/content';
import { SECCION_COLORS, TEMA_COLORS, SECCIONES, INDUSTRIAS, MECANISMOS, TEMAS } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  pieza: Pieza;
  x: number;
  y: number;
  radius: number;
  href: string;
  angle: number;
  z?: number;
}

interface Link {
  source: Node;
  target: Node;
  weight: number;
}

export default function NetworkMap({ piezas }: { piezas: Pieza[] }) {
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

  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
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
    if (!svgRef.current || windowSize.width === 0 || piezas.length === 0) return;

    const { width, height } = windowSize;

    // Filter out podcasts and sort by Temporada & Capitulo
    const validPiezas = piezas
      .filter(p => p.seccion !== 'podcast' && p.temporada && p.capitulo)
      .sort((a, b) => {
        if (a.temporada !== b.temporada) return (a.temporada || 0) - (b.temporada || 0);
        return (a.capitulo || 0) - (b.capitulo || 0);
      });

    const totalNodes = validPiezas.length;
    const cx = width / 2;
    const cy = height / 2;
    // 3D Ellipse bounds
    const rx = isMobile ? width * 0.45 : width * 0.35;
    const ry = isMobile ? height * 0.35 : height * 0.25;

    const nodes: Node[] = validPiezas.map((p, i) => {
      const angle = (i / totalNodes) * 2 * Math.PI - Math.PI / 2;
      return {
        id: p.href,
        pieza: p,
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
        angle: angle,
        radius: isMobile ? 12 : 18,
        href: p.href,
        z: Math.sin(angle)
      };
    });

    const links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].pieza;
        const b = nodes[j].pieza;
        let weight = 0;

        if (a.tema && b.tema && a.tema === b.tema) weight += 3;
        if (a.industria && b.industria && a.industria === b.industria) weight += 2;
        
        const sharedMecanismos = a.mecanismo?.filter(m => b.mecanismo?.includes(m)) || [];
        weight += sharedMecanismos.length;

        if (a.seccion === b.seccion) weight += 1;

        if (weight >= 2) {
          links.push({
            source: nodes[i],
            target: nodes[j],
            weight
          });
        }
      }
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    const lineOpacity = (weight: number) => {
      if (weight >= 6) return 0.5;
      if (weight >= 4) return 0.3;
      if (weight >= 2) return 0.15;
      return 0.05;
    };

    const lineWidth = (weight: number) => {
      if (weight >= 6) return 2;
      if (weight >= 4) return 1.5;
      return 1;
    };

    const linkPath = g.append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", d => lineWidth(d.weight));

    // Optional: Draw a subtle orbit ring just for aesthetics
    g.append("ellipse")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("rx", rx)
      .attr("ry", ry)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.03)")
      .attr("stroke-dasharray", "4,4")
      .style("pointer-events", "none");

    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .style("cursor", "pointer");

    nodeGroup.append("circle")
      .attr("fill", d => TEMA_COLORS[d.pieza.tema] || '#666')
      .attr("stroke", "#FFFFFF")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 1.5);

    nodeGroup.append("text")
      .text(d => d.pieza.seccion.toUpperCase())
      .attr("text-anchor", "middle")
      .attr("font-family", "var(--font-sans)")
      .attr("font-weight", "600")
      .attr("fill", "rgba(255,255,255,0.7)")
      .style("pointer-events", "none");

    const getFilteredOpacity = (n: Node) => {
      const filters = activeFiltersRef.current;
      const sF = filters.seccion.length === 0 || filters.seccion.includes(n.pieza.seccion);
      const tF = filters.tema.length === 0 || filters.tema.includes(n.pieza.tema);
      const iF = filters.industria.length === 0 || filters.industria.includes(n.pieza.industria);
      const mF = filters.mecanismo.length === 0 || 
                filters.mecanismo.every((m: string) => n.pieza.mecanismo?.includes(m));
      return (sF && tF && iF && mF) ? 1 : 0.05;
    };

    // Physics Simulation with elliptical constraints
    const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-30))
      .force("collide", d3.forceCollide().radius(d => (d as Node).radius + 15).iterations(2))
      .alphaTarget(0.01) // keeps moving slowly indefinitely
      .velocityDecay(0.3);

    // active hover state reference to sync with continuous tick
    let currentHover: Node | null = null;

    simulation.on("tick", () => {
      // 1. Orbital motion and bounds
      nodes.forEach((d: Node) => {
        // Calculate theoretical angle on the ellipse
        let currentAngle = Math.atan2((d.y - cy) / ry, (d.x - cx) / rx);
        currentAngle += 0.001; // Constant slow orbital rotation
        
        const targetX = cx + Math.cos(currentAngle) * rx;
        const targetY = cy + Math.sin(currentAngle) * ry;
        
        // Gently pull node towards the moving target
        d.x += (targetX - d.x) * 0.05;
        d.y += (targetY - d.y) * 0.05;
        
        d.z = Math.sin(currentAngle);
      });

      // 2. Render links
      linkPath.attr("d", d => {
        const source = d.source as Node;
        const target = d.target as Node;
        return `M ${source.x} ${source.y} Q ${cx} ${cy} ${target.x} ${target.y}`;
      });

      linkPath.attr("stroke-opacity", (d: any) => {
        const source = d.source as Node;
        const target = d.target as Node;
        const filters = activeFiltersRef.current;
        const getMatch = (node: Node) => {
          const s = filters.seccion.length === 0 || filters.seccion.includes(node.pieza.seccion);
          const t = filters.tema.length === 0 || filters.tema.includes(node.pieza.tema);
          const i = filters.industria.length === 0 || filters.industria.includes(node.pieza.industria);
          const m = filters.mecanismo.length === 0 || filters.mecanismo.every((mec: string) => node.pieza.mecanismo?.includes(mec));
          return s && t && i && m;
        };
        const isVisible = getMatch(source) && getMatch(target);
        const baseOpacity = isVisible ? lineOpacity(d.weight) : 0.01;

        if (!currentHover) return baseOpacity;
        const isConnected = source.id === currentHover.id || target.id === currentHover.id;
        return isConnected ? 0.8 : 0.01;
      });

      // 3. Render Nodes
      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);

      nodeGroup.attr("opacity", d => {
        const baseOpacity = getFilteredOpacity(d);
        if (!currentHover) {
          if (baseOpacity === 0.05) return 0.05;
          const z = d.z || 0;
          return Math.max(0.2, 0.7 + z * 0.3); // Back nodes are slightly faded
        }

        if (d.id === currentHover.id) return 1;
        const isConnected = links.some(l => {
          const src = l.source as Node;
          const tgt = l.target as Node;
          return (src.id === currentHover.id && tgt.id === d.id) ||
                 (tgt.id === currentHover.id && src.id === d.id);
        });
        return isConnected ? 0.8 : 0.05;
      });

      // 3D perspective scales
      nodeGroup.select("circle")
        .attr("r", d => d.radius * (0.8 + (d.z || 0) * 0.2));

      nodeGroup.select("text")
        .attr("font-size", d => `${(isMobile ? 7 : 9) * (0.8 + (d.z || 0) * 0.2)}px`)
        .attr("dy", d => d.radius * (0.8 + (d.z || 0) * 0.2) + 12);
    });

    // Interaction
    const drag = d3.drag<SVGGElement, Node>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.01);
        d.fx = null;
        d.fy = null;
      });

    nodeGroup.call(drag);

    nodeGroup
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("stroke-opacity", 1).attr("stroke-width", 2.5);
        setHoveredNode(d);
        currentHover = d;
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("stroke-opacity", 0.3).attr("stroke-width", 1.5);
        setHoveredNode(null);
        currentHover = null;
      })
      .on("click", (event, d) => {
        if (typeof window !== 'undefined') {
          window.open(d.href, '_blank');
        }
      });

    return () => {
      simulation.stop();
    };
  }, [piezas, windowSize, router, isMobile]);

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

      <div className="absolute bottom-8 right-8 z-20 text-right pointer-events-none hidden md:block">
        <p className="font-serif text-xs opacity-40 leading-relaxed">
          Un viaje circular de 3 temporadas.<br />
          24 historias que se conectan entre sí.<br />
          Las curvas revelan patrones ocultos.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 relative">
        <svg ref={svgRef} className="w-full h-full" />
        {hoveredNode && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white text-[#0A0A0A] p-6 max-w-sm pointer-events-none animate-in fade-in slide-in-from-bottom-4 shadow-2xl z-[230]">
            <span className="tag-text block mb-2 uppercase font-bold" style={{ color: SECCION_COLORS[hoveredNode.pieza.seccion] || '#000' }}>
              {hoveredNode.pieza.seccion} — TEMP {hoveredNode.pieza.temporada} | CAP {hoveredNode.pieza.capitulo}
            </span>
            <h3 className="font-serif text-2xl leading-[1.1] mb-4">{hoveredNode.pieza.titulo}</h3>
            <div className="space-y-1">
              <p className="tag-text !text-black/40">TEMA: <span className="text-black">{hoveredNode.pieza.tema}</span></p>
              <p className="tag-text !text-black/40">INDUSTRIA: <span className="text-black">{hoveredNode.pieza.industria}</span></p>
            </div>
          </div>
        )}
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
