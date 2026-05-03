'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Pieza } from '@/lib/content';
import { SECCION_COLORS, TEMA_COLORS, SECCIONES, INDUSTRIAS, MECANISMOS, TEMAS } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  pieza: Pieza;
  radius: number;
  href: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
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
      return {
        ...prev,
        [type]: current.includes(value) ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  const clearFilters = () => setActiveFilters({ seccion: [], tema: [], industria: [], mecanismo: [] });

  useEffect(() => {
    if (!svgRef.current || windowSize.width === 0 || piezas.length === 0) return;

    const { width, height } = windowSize;

    // Build Nodes
    const nodes: Node[] = piezas.map(p => ({
      id: p.href,
      pieza: p,
      radius: 0,
      href: p.href
    }));

    // Build Links
    const links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].pieza;
        const b = nodes[j].pieza;
        let weight = 0;

        if (a.tema && b.tema && a.tema === b.tema) weight += 3;
        if (a.industria && b.industria && a.industria === b.industria) weight += 2;
        
        const sharedMecanismos = a.mecanismo.filter(m => b.mecanismo.includes(m));
        weight += sharedMecanismos.length;

        if (a.seccion === b.seccion) weight += 1;

        if (weight >= 2) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            weight
          });
        }
      }
    }

    // Calculate radius based on degree
    nodes.forEach(n => {
      const degree = links.filter(l => l.source === n.id || l.target === n.id).length;
      n.radius = (isMobile ? 12 : 18) + Math.sqrt(degree) * (isMobile ? 4 : 6);
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(isMobile ? 60 : 120).strength(0.3))
      .force("charge", d3.forceManyBody().strength(isMobile ? -40 : -80))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<Node>().radius(d => d.radius + (isMobile ? 10 : 20)))
      .alphaDecay(0.04)
      .velocityDecay(0.6);

    const lineOpacity = (weight: number) => {
      if (weight >= 6) return 0.7;
      if (weight >= 4) return 0.45;
      if (weight >= 2) return 0.25;
      return 0.1;
    };

    const lineWidth = (weight: number) => {
      if (weight >= 6) return 2;
      if (weight >= 4) return 1.5;
      return 1;
    };

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-opacity", d => lineOpacity(d.weight))
      .attr("stroke-width", d => lineWidth(d.weight));

    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.1).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        }) as any);

    nodeGroup.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => TEMA_COLORS[d.pieza.tema] || '#666')
      .attr("stroke", "#FFFFFF")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-width", 1);

    nodeGroup.append("text")
      .text(d => d.pieza.titulo.substring(0, 3).toUpperCase())
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", isMobile ? "6px" : "8px")
      .attr("font-family", "var(--font-sans)")
      .attr("font-weight", "bold")
      .attr("fill", "#0A0A0A");

    const getFilteredOpacity = (n: Node) => {
      const sF = activeFilters.seccion.length === 0 || activeFilters.seccion.includes(n.pieza.seccion);
      const tF = activeFilters.tema.length === 0 || activeFilters.tema.includes(n.pieza.tema);
      const iF = activeFilters.industria.length === 0 || activeFilters.industria.includes(n.pieza.industria);
      const mF = activeFilters.mecanismo.length === 0 || n.pieza.mecanismo.some((m: string) => activeFilters.mecanismo.includes(m));
      return (sF && tF && iF && mF) ? 1 : 0.05;
    };

    const updateMapVisuals = (activeHover: Node | null) => {
      nodeGroup.transition().duration(200)
        .attr("opacity", n => {
          const baseOpacity = getFilteredOpacity(n);
          if (!activeHover) return baseOpacity;
          
          if (n.id === activeHover.id) return 1;
          
          const isConnected = links.some(l => 
            ((l.source as Node).id === activeHover.id && (l.target as Node).id === n.id) || 
            ((l.target as Node).id === activeHover.id && (l.source as Node).id === n.id)
          );
          
          return isConnected ? Math.max(baseOpacity, 0.8) : 0.05;
        });

      link.transition().duration(200)
        .attr("stroke-opacity", l => {
          const baseOpacity = lineOpacity(l.weight);
          if (!activeHover) return baseOpacity;
          
          const isConnected = (l.source as Node).id === activeHover.id || (l.target as Node).id === activeHover.id;
          return isConnected ? 0.6 : 0.01;
        });
    };

    nodeGroup
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("stroke-opacity", 1).attr("stroke-width", 2);
        setHoveredNode(d);
        updateMapVisuals(d);
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("stroke-opacity", 0.1).attr("stroke-width", 1);
        setHoveredNode(null);
        updateMapVisuals(null);
      })
      .on("click", (event, d) => {
        router.push(d.href);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);
      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [piezas, windowSize, router, isMobile]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("g.node-group").transition().duration(500)
      .attr("opacity", (n: any) => {
        const sF = activeFilters.seccion.length === 0 || activeFilters.seccion.includes(n.pieza.seccion);
        const tF = activeFilters.tema.length === 0 || activeFilters.tema.includes(n.pieza.tema);
        const iF = activeFilters.industria.length === 0 || activeFilters.industria.includes(n.pieza.industria);
        const mF = activeFilters.mecanismo.length === 0 || n.pieza.mecanismo.some((m: string) => activeFilters.mecanismo.includes(m));
        return (sF && tF && iF && mF) ? 1 : 0.05;
      });
      
    svg.selectAll("line").transition().duration(500)
      .attr("stroke-opacity", (l: any) => {
        const sSource = activeFilters.seccion.length === 0 || activeFilters.seccion.includes(l.source.pieza.seccion);
        const sTarget = activeFilters.seccion.length === 0 || activeFilters.seccion.includes(l.target.pieza.seccion);
        // If filters are active, only show links where BOTH nodes match filters
        // This makes the filtered state much cleaner
        const isVisible = sSource && sTarget;
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
            <FilterSection label="SECCIÓN" options={SECCIONES} active={activeFilters.seccion} toggle={(v) => toggleFilter('seccion', v)} isSeccion />
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
          Cada nodo es una pieza.<br />
          Cada color es un tema.<br />
          Cada línea es una conexión.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 relative">
        <svg ref={svgRef} className="w-full h-full" />
        {hoveredNode && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white text-[#0A0A0A] p-6 max-w-sm pointer-events-none animate-in fade-in slide-in-from-bottom-4 shadow-2xl z-[230]">
            <span className="tag-text block mb-2 uppercase font-bold" style={{ color: SECCION_COLORS[hoveredNode.pieza.seccion] || '#000' }}>
              {hoveredNode.pieza.seccion}
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
