'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Pieza } from '@/lib/content';
import { SECCION_COLORS, TEMA_COLORS, SECCIONES, INDUSTRIAS, MECANISMOS, TEMAS } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface Node {
  id: string;
  pieza: Pieza;
  x: number;
  y: number;
  radius: number;
  href: string;
  angle: number;
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

      // Single selection for unique categories
      if (type !== 'mecanismo') {
        return {
          ...prev,
          [type]: isAlreadyActive ? [] : [value]
        };
      }

      // Multiple selection (AND logic) for mechanisms
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

    // Circular layout math
    const totalNodes = validPiezas.length;
    const circleRadius = isMobile ? Math.min(width, height) / 2.5 : Math.min(width, height) / 2.8;
    const cx = width / 2;
    const cy = height / 2;

    const nodes: Node[] = validPiezas.map((p, i) => {
      // Start at top (12 o'clock) and go clockwise
      const angle = (i / totalNodes) * 2 * Math.PI - Math.PI / 2;
      return {
        id: p.href,
        pieza: p,
        x: cx + circleRadius * Math.cos(angle),
        y: cy + circleRadius * Math.sin(angle),
        angle: angle,
        radius: isMobile ? 14 : 22,
        href: p.href
      };
    });

    // Build Links (same logic, but stored with actual source/target objects)
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

    // Initial transform to center the circle if zoomed or panned by default
    // We start at zoom 1, centered, which is default.

    const lineOpacity = (weight: number) => {
      if (weight >= 6) return 0.6;
      if (weight >= 4) return 0.4;
      if (weight >= 2) return 0.2;
      return 0.1;
    };

    const lineWidth = (weight: number) => {
      if (weight >= 6) return 2;
      if (weight >= 4) return 1.5;
      return 1;
    };

    // Draw lines as quadratic bezier curves through the center
    const linkPath = g.append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-opacity", d => lineOpacity(d.weight))
      .attr("stroke-width", d => lineWidth(d.weight))
      .attr("d", d => {
        // Curve goes towards the center (cx, cy) to avoid a straight line crossing other nodes
        // Adjust control point slightly off-center to create organic woven effect
        const cpX = cx;
        const cpY = cy;
        return `M ${d.source.x} ${d.source.y} Q ${cpX} ${cpY} ${d.target.x} ${d.target.y}`;
      });

    // Draw the "path" ring
    g.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", circleRadius)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.05)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");

    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    nodeGroup.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => TEMA_COLORS[d.pieza.tema] || '#666')
      .attr("stroke", "#FFFFFF")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 1.5);

    nodeGroup.append("text")
      .text(d => `T${d.pieza.temporada}C${d.pieza.capitulo}`)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", isMobile ? "8px" : "10px")
      .attr("font-family", "var(--font-sans)")
      .attr("font-weight", "bold")
      .attr("fill", "#0A0A0A")
      .style("pointer-events", "none");

    const getFilteredOpacity = (n: Node) => {
      const sF = activeFilters.seccion.length === 0 || activeFilters.seccion.includes(n.pieza.seccion);
      const tF = activeFilters.tema.length === 0 || activeFilters.tema.includes(n.pieza.tema);
      const iF = activeFilters.industria.length === 0 || activeFilters.industria.includes(n.pieza.industria);
      const mF = activeFilters.mecanismo.length === 0 || 
                activeFilters.mecanismo.every((m: string) => n.pieza.mecanismo?.includes(m));
      return (sF && tF && iF && mF) ? 1 : 0.05;
    };

    const updateMapVisuals = (activeHover: Node | null) => {
      nodeGroup.transition().duration(200)
        .attr("opacity", n => {
          const baseOpacity = getFilteredOpacity(n);
          if (!activeHover) return baseOpacity;
          if (baseOpacity === 0.05) return 0.05;

          if (n.id === activeHover.id) return 1;
          const isConnected = links.some(l =>
            (l.source.id === activeHover.id && l.target.id === n.id) ||
            (l.target.id === activeHover.id && l.source.id === n.id)
          );
          return isConnected ? Math.max(baseOpacity, 0.8) : 0.05;
        });

      linkPath.transition().duration(200)
        .attr("stroke-opacity", l => {
          const baseOpacity = lineOpacity(l.weight);
          if (!activeHover) return baseOpacity;
          
          const isConnected = l.source.id === activeHover.id || l.target.id === activeHover.id;
          return isConnected ? 0.8 : 0.01;
        });
    };

    nodeGroup
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("stroke-opacity", 1).attr("stroke-width", 2.5);
        setHoveredNode(d);
        updateMapVisuals(d);
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("stroke-opacity", 0.3).attr("stroke-width", 1.5);
        setHoveredNode(null);
        updateMapVisuals(null);
      })
      .on("click", (event, d) => {
        if (typeof window !== 'undefined') {
          window.open(d.href, '_blank');
        }
      });

  }, [piezas, windowSize, router, isMobile]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("g.node-group").transition().duration(500)
      .attr("opacity", (d: unknown) => {
        const n = d as Node;
        const sF = activeFilters.seccion.length === 0 || activeFilters.seccion.includes(n.pieza.seccion);
        const tF = activeFilters.tema.length === 0 || activeFilters.tema.includes(n.pieza.tema);
        const iF = activeFilters.industria.length === 0 || activeFilters.industria.includes(n.pieza.industria);
        const mF = activeFilters.mecanismo.length === 0 || 
                  activeFilters.mecanismo.every((m: string) => n.pieza.mecanismo?.includes(m));
        
        return (sF && tF && iF && mF) ? 1 : 0.05;
      });
      
    svg.selectAll("path").transition().duration(500)
      .attr("stroke-opacity", (d: unknown) => {
        const l = d as Link;
        const getMatch = (node: Node) => {
          const s = activeFilters.seccion.length === 0 || activeFilters.seccion.includes(node.pieza.seccion);
          const t = activeFilters.tema.length === 0 || activeFilters.tema.includes(node.pieza.tema);
          const i = activeFilters.industria.length === 0 || activeFilters.industria.includes(node.pieza.industria);
          const m = activeFilters.mecanismo.length === 0 || activeFilters.mecanismo.every((mec: string) => node.pieza.mecanismo?.includes(mec));
          return s && t && i && m;
        };

        const isVisible = getMatch(l.source) && getMatch(l.target);
        return isVisible ? 0.2 : 0.01;
      });
  }, [activeFilters]);

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
