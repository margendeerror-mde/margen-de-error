'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Pieza, TEMA_COLORS, SECCIONES, INDUSTRIAS, MECANISMOS, TEMAS } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  pieza: Pieza;
  radius: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  sharedTags: {
    industria: boolean;
    mecanismo: boolean;
    tema: boolean;
    seccion: boolean;
  };
  color: string;
}

export default function NetworkMap({ piezas }: { piezas: Pieza[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [activeFilters, setActiveFilters] = useState<{
    seccion: string[];
    tema: string[];
    industria: string[];
    mecanismo: string[];
  }>({
    seccion: [],
    tema: [],
    industria: [],
    mecanismo: []
  });

  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleFilter = (type: 'seccion' | 'tema' | 'industria' | 'mecanismo', value: string) => {
    setActiveFilters(prev => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(value) ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || piezas.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    let nodes: Node[] = piezas.map(p => ({
      id: p.slug,
      pieza: p,
      radius: 0,
    }));

    let links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const p1 = nodes[i].pieza;
        const p2 = nodes[j].pieza;
        
        const industriaMatch = p1.industria === p2.industria;
        const temaMatch = p1.tema === p2.tema;
        const seccionMatch = p1.seccion === p2.seccion;
        
        const m1 = Array.isArray(p1.mecanismo) ? p1.mecanismo : [p1.mecanismo];
        const m2 = Array.isArray(p2.mecanismo) ? p2.mecanismo : [p2.mecanismo];
        const sharedMec = m1.filter(m => m2.includes(m as any));
        const mecanismoMatch = sharedMec.length > 0;

        if (industriaMatch || temaMatch || mecanismoMatch || seccionMatch) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            sharedTags: { 
              industria: industriaMatch, 
              mecanismo: mecanismoMatch, 
              tema: temaMatch,
              seccion: seccionMatch
            },
            color: temaMatch ? TEMA_COLORS[p1.tema] : '#FFFFFF'
          });
        }
      }
    }

    nodes.forEach(n => {
      const connections = links.filter(l => 
        (typeof l.source === 'string' ? l.source === n.id : (l.source as Node).id === n.id) || 
        (typeof l.target === 'string' ? l.target === n.id : (l.target as Node).id === n.id)
      ).length;
      n.radius = 18 + Math.sqrt(connections) * 6;
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(150).strength(0.2))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force("collision", d3.forceCollide<Node>().radius(d => d.radius + 30))
      .alphaDecay(0.05)
      .velocityDecay(0.6);

    simulation.on("end", () => {
      nodes.forEach(d => {
        d.fx = d.x;
        d.fy = d.y;
      });
    });

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d.color)
      .attr("stroke-opacity", d => {
        if (d.sharedTags.tema && d.sharedTags.mecanismo) return 0.4;
        if (d.sharedTags.tema) return 0.2;
        return 0.06;
      })
      .attr("stroke-width", d => (d.sharedTags.tema && d.sharedTags.mecanismo) ? 1.2 : 0.6);

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
          d.fx = event.x; d.fy = event.y;
        }) as any);

    nodeGroup.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => TEMA_COLORS[d.pieza.tema])
      .attr("stroke", "#FFFFFF")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-width", 1);

    nodeGroup.append("text")
      .text(d => d.pieza.titulo.substring(0, 3).toUpperCase())
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "8px")
      .attr("font-family", "var(--font-sans)")
      .attr("font-weight", "bold")
      .attr("fill", "#0A0A0A");

    nodeGroup
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("stroke-opacity", 1).attr("stroke-width", 2);
        setHoveredNode(d);
        
        link.transition().duration(200)
          .attr("stroke-opacity", l => {
            const isConnected = l.source === d || l.target === d;
            return isConnected ? 0.6 : 0.01;
          });
        
        nodeGroup.transition().duration(200)
          .attr("opacity", n => {
            if (n === d) return 1;
            const isConnected = links.some(l => 
              ((l.source as Node).id === d.id && (l.target as Node).id === n.id) || 
              ((l.target as Node).id === d.id && (l.source as Node).id === n.id)
            );
            return isConnected ? 1 : 0.05;
          });
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("stroke-opacity", 0.1).attr("stroke-width", 1);
        setHoveredNode(null);
        
        link.transition().duration(200)
          .attr("stroke-opacity", l => {
            if (l.sharedTags.tema && l.sharedTags.mecanismo) return 0.4;
            if (l.sharedTags.tema) return 0.2;
            return 0.06;
          });
          
        nodeGroup.transition().duration(200).attr("opacity", 1);
      })
      .on("click", (event, d) => router.push(`/${d.pieza.seccion.replace('á', 'a')}/${d.id}`));

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);
      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [piezas, router]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("g.node-group").transition().duration(500)
      .attr("opacity", (n: any) => {
        const sF = activeFilters.seccion.length === 0 || activeFilters.seccion.includes(n.pieza.seccion);
        const tF = activeFilters.tema.length === 0 || activeFilters.tema.includes(n.pieza.tema);
        const iF = activeFilters.industria.length === 0 || activeFilters.industria.includes(n.pieza.industria);
        const m1 = Array.isArray(n.pieza.mecanismo) ? n.pieza.mecanismo : [n.pieza.mecanismo];
        const mF = activeFilters.mecanismo.length === 0 || m1.some((m: string) => activeFilters.mecanismo.includes(m as any));
        return (sF && tF && iF && mF) ? 1 : 0.05;
      });
  }, [activeFilters]);

  return (
    <div className="flex w-full h-full bg-[#0A0A0A] relative overflow-hidden dark-mode font-sans">
      <div className={`absolute left-0 top-0 h-full bg-[#0A0A0A]/90 backdrop-blur-xl border-r border-white/10 z-[210] transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-72 overflow-y-auto scrollbar-hide`}>
        <div className="p-8 pt-24">
          <button onClick={() => setSidebarOpen(false)} className="tag-text mb-12 opacity-50 hover:opacity-100">✕ CERRAR</button>
          <div className="space-y-10">
            <FilterSection label="SECCIÓN" options={SECCIONES} active={activeFilters.seccion} toggle={(v) => toggleFilter('seccion', v)} />
            <FilterSection label="TEMA" options={TEMAS} active={activeFilters.tema} toggle={(v) => toggleFilter('tema', v)} />
            <FilterSection label="INDUSTRIA" options={INDUSTRIAS} active={activeFilters.industria} toggle={(v) => toggleFilter('industria', v)} />
            <FilterSection label="MECANISMO" options={MECANISMOS} active={activeFilters.mecanismo} toggle={(v) => toggleFilter('mecanismo', v)} />
          </div>
        </div>
      </div>

      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="absolute left-8 bottom-8 z-[210] tag-text opacity-50 hover:opacity-100">☰ FILTROS</button>
      )}

      <div className="absolute bottom-8 right-8 z-20 text-right pointer-events-none">
        <p className="font-serif text-sm opacity-40 leading-relaxed">
          Cada nodo es una pieza.<br />
          Cada color es un tema.<br />
          Cada línea es una conexión.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 relative">
        <svg ref={svgRef} className="w-full h-full" />
        {hoveredNode && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white text-[#0A0A0A] p-6 max-w-sm pointer-events-none animate-in fade-in slide-in-from-bottom-4 shadow-2xl z-[220]">
            <span className="tag-text !text-accent block mb-2 uppercase">{hoveredNode.pieza.seccion}</span>
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

function FilterSection({ label, options, active, toggle }: { label: string, options: readonly string[], active: string[], toggle: (v: string) => void }) {
  return (
    <div>
      <h4 className="tag-text !text-white/30 mb-4 tracking-widest">{label}</h4>
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <button 
            key={opt} 
            onClick={() => toggle(opt)}
            className={`tag-text text-left transition-colors !text-[9px] ${active.includes(opt) ? 'text-accent' : 'text-white/60 hover:text-white'}`}
          >
            {active.includes(opt) ? '● ' : '○ '}{opt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
