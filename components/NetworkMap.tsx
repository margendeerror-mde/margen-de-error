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

interface BaseNode {
  id: string;
  pieza: MinimalPieza;
  px: number; // base sphere X (-1 to 1)
  py: number; // base sphere Y (-1 to 1)
  pz: number; // base sphere Z (-1 to 1)
  radius: number;
}

interface Link {
  source: BaseNode;
  target: BaseNode;
  weight: number;
}

export default function NetworkMap({ piezas }: { piezas: MinimalPieza[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const htmlNodesRef = useRef<HTMLDivElement>(null);
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
    if (!svgRef.current || !htmlNodesRef.current || !containerRef.current || windowSize.width === 0 || piezas.length === 0) return;

    const { width, height } = windowSize;

    // Filter out podcasts
    const validPiezas = piezas.filter(p => p.seccion !== 'podcast' && p.seccion);
    const totalNodes = validPiezas.length;
    
    // 3D Sphere bounds
    const cx = width / 2;
    const cy = height / 2;
    const R = isMobile ? Math.min(width, height) * 0.40 : Math.min(width, height) * 0.35;

    // 1. Distribute nodes on a Fibonacci sphere
    const nodes: BaseNode[] = validPiezas.map((p, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / totalNodes);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      return {
        id: p.href,
        pieza: p,
        px: Math.cos(theta) * Math.sin(phi),
        py: Math.sin(theta) * Math.sin(phi),
        pz: Math.cos(phi),
        radius: isMobile ? 14 : 18,
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

    const getFilteredOpacity = (p: MinimalPieza) => {
      const filters = activeFiltersRef.current;
      const sF = filters.seccion.length === 0 || filters.seccion.includes(p.seccion);
      const tF = filters.tema.length === 0 || filters.tema.includes(p.tema);
      const iF = filters.industria.length === 0 || filters.industria.includes(p.industria);
      const mF = filters.mecanismo.length === 0 || 
                filters.mecanismo.every((m: string) => p.mecanismo?.includes(m));
      return (sF && tF && iF && mF) ? 1 : 0.05;
    };

    // 2. Render SVG Links
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const gLinks = svg.append("g");

    const lineOpacity = (weight: number) => {
      if (weight >= 6) return 0.4;
      if (weight >= 4) return 0.2;
      if (weight >= 2) return 0.1;
      return 0.05;
    };

    const linkPaths = gLinks.selectAll("path")
      .data(links)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", d => d.weight >= 4 ? 1.5 : 0.5)
      .style("pointer-events", "none");

    // 3. Render HTML Nodes (Glassmorphism Capsules)
    const htmlContainer = d3.select(htmlNodesRef.current);
    htmlContainer.selectAll('*').remove();

    let hoveredNodeId: string | null = null;

    const nodeDivs = htmlContainer.selectAll("div.node-capsule")
      .data(nodes)
      .join("div")
      .attr("class", "node-capsule absolute top-0 left-0 cursor-pointer pointer-events-auto select-none")
      .style("transform-origin", "center center")
      .on("click", (event, d) => {
        if (!event.defaultPrevented) {
          router.push(d.id);
        }
      })
      .on("mouseenter", (event, d) => {
        hoveredNodeId = d.id;
        d3.select(event.currentTarget).style("border-color", "rgba(255,255,255,0.8)");
      })
      .on("mouseleave", (event) => {
        hoveredNodeId = null;
        d3.select(event.currentTarget).style("border-color", "rgba(255,255,255,0.1)");
      });

    // Build capsule inner HTML
    nodeDivs.html(d => {
      const color = SECCION_COLORS[d.pieza.seccion] || '#666';
      const initial = d.pieza.seccion.charAt(0).toUpperCase();
      const title = d.pieza.titulo;
      // Truncate title
      const shortTitle = title.length > 25 ? title.substring(0, 25) + '...' : title;
      
      return `
        <div class="flex items-center gap-2 pr-3 py-1 pl-1 rounded-full border border-white/10 shadow-lg backdrop-blur-md transition-colors duration-300" 
             style="background: rgba(20,20,20,0.4);">
          <div class="flex items-center justify-center font-bold text-[11px] text-white/90 rounded-full shrink-0" 
               style="background-color: ${color}; width: 28px; height: 28px;">
            ${initial}
          </div>
          <span class="text-xs font-serif text-white/80 whitespace-nowrap overflow-hidden">
            ${shortTitle}
          </span>
        </div>
      `;
    });

    // 4. Rotation State & Animation Loop
    let currentYaw = 0;
    let currentPitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    
    // Auto-spin base
    let autoYaw = 0;
    let isDragging = false;

    const drag = d3.drag<HTMLDivElement, unknown>()
      .on("start", () => {
        isDragging = true;
      })
      .on("drag", (event) => {
        targetYaw += event.dx * 0.01;
        targetPitch -= event.dy * 0.01;
        
        // Constrain pitch to avoid flipping upside down completely
        targetPitch = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, targetPitch));
      })
      .on("end", () => {
        isDragging = false;
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d3.select(containerRef.current as HTMLDivElement).call(drag as any);

    const timer = d3.timer(() => {
      if (!isDragging) {
        autoYaw += 0.001; // slow continuous spin
      }
      
      // Interpolate towards target for smooth drag
      currentYaw += (targetYaw + autoYaw - currentYaw) * 0.1;
      currentPitch += (targetPitch - currentPitch) * 0.1;

      const cosY = Math.cos(currentYaw);
      const sinY = Math.sin(currentYaw);
      const cosP = Math.cos(currentPitch);
      const sinP = Math.sin(currentPitch);

      // Pre-calculate transformed positions for all nodes
      const projectedNodes = new Map<string, {x: number, y: number, z: number}>();

      nodes.forEach(n => {
        // Yaw rotation (Y axis)
        const x1 = n.px * cosY - n.pz * sinY;
        const z1 = n.px * sinY + n.pz * cosY;
        
        // Pitch rotation (X axis)
        const y2 = n.py * cosP - z1 * sinP;
        const z2 = n.py * sinP + z1 * cosP;

        // Scale down Z so the back is slightly smaller
        // const scale = 0.7 + (z2 + 1) * 0.25; // z2 goes from -1 to 1

        projectedNodes.set(n.id, {
          x: cx + x1 * R,
          y: cy + y2 * R,
          z: z2
        });
      });

      // Update Links (Bezier curves dipping towards the center)
      linkPaths.attr("d", d => {
        const src = projectedNodes.get(d.source.id);
        const tgt = projectedNodes.get(d.target.id);
        if (!src || !tgt) return "";
        // Control point pulls the curve towards the center of the sphere slightly
        const qx = cx + (src.x + tgt.x - 2 * cx) * 0.3;
        const qy = cy + (src.y + tgt.y - 2 * cy) * 0.3;
        return `M ${src.x} ${src.y} Q ${qx} ${qy} ${tgt.x} ${tgt.y}`;
      });

      linkPaths.attr("stroke-opacity", (d: unknown) => {
        const link = d as Link;
        const srcF = getFilteredOpacity(link.source.pieza) === 1;
        const tgtF = getFilteredOpacity(link.target.pieza) === 1;
        
        if (!srcF || !tgtF) return 0.01;

        const src = projectedNodes.get(link.source.id);
        const tgt = projectedNodes.get(link.target.id);
        const avgZ = ((src?.z || 0) + (tgt?.z || 0)) / 2;
        
        const isHovered = hoveredNodeId === link.source.id || hoveredNodeId === link.target.id;
        if (hoveredNodeId && !isHovered) return 0.01;

        let op = lineOpacity(link.weight);
        if (isHovered) op = 0.8;
        
        // fade back lines
        return op * Math.max(0.1, (avgZ + 1) / 2);
      });

      // Update HTML Nodes
      nodeDivs.style("transform", d => {
        const p = projectedNodes.get(d.id);
        if (!p) return "";
        const scale = 0.6 + (p.z + 1) * 0.25; // z: -1 (back) to 1 (front)
        return `translate(calc(${p.x}px - 50%), calc(${p.y}px - 50%)) scale(${scale})`;
      });

      nodeDivs.style("z-index", d => {
        const p = projectedNodes.get(d.id);
        return p ? Math.floor((p.z + 1) * 100) : 0;
      });

      nodeDivs.style("opacity", d => {
        const baseOpacity = getFilteredOpacity(d.pieza);
        if (baseOpacity < 1) return baseOpacity;

        const p = projectedNodes.get(d.id);
        const z = p ? p.z : 0;
        
        if (hoveredNodeId) {
          if (hoveredNodeId === d.id) return 1;
          const isConnected = links.some(l => 
            (l.source.id === hoveredNodeId && l.target.id === d.id) ||
            (l.target.id === hoveredNodeId && l.source.id === d.id)
          );
          return isConnected ? 0.8 : 0.1;
        }

        return Math.max(0.3, 0.5 + (z + 1) * 0.3);
      });

    });

    return () => {
      timer.stop();
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
          La red de la evidencia.<br />
          Historias que se conectan entre sí.<br />
          Explorá el universo de MDE arrastrando la esfera.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 relative cursor-grab active:cursor-grabbing">
        {/* SVG background for drawing bezier curves */}
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        
        {/* HTML overlay for drawing interactive glass capsules */}
        <div ref={htmlNodesRef} className="absolute inset-0 w-full h-full pointer-events-none" />
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
