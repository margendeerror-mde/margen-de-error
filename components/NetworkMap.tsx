'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Pieza } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface NetworkMapProps {
  piezas: Pieza[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  pieza: Pieza;
  radius: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  sharedTags: string[];
}

export default function NetworkMap({ piezas }: NetworkMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [activeFilters, setActiveFilters] = useState<{
    tema: string[];
    industria: string[];
    mecanismo: string[];
  }>({
    tema: [],
    industria: [],
    mecanismo: []
  });

  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  // Extraer todas las opciones únicas para los filtros
  const allTemas = Array.from(new Set(piezas.map(p => p.tema))).filter(Boolean);
  const allIndustrias = Array.from(new Set(piezas.map(p => p.industria))).filter(Boolean);
  const allMecanismos = Array.from(new Set(piezas.flatMap(p => p.mecanismo))).filter(Boolean);

  const toggleFilter = (type: 'tema' | 'industria' | 'mecanismo', value: string) => {
    setActiveFilters(prev => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(value) ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Filtrar piezas según filtros activos
    const filteredPiezas = piezas.filter(p => {
      if (activeFilters.tema.length > 0 && !activeFilters.tema.includes(p.tema)) return false;
      if (activeFilters.industria.length > 0 && !activeFilters.industria.includes(p.industria)) return false;
      if (activeFilters.mecanismo.length > 0 && !activeFilters.mecanismo.some(m => p.mecanismo.includes(m as any))) return false;
      return true;
    });

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Preparar nodos
    let nodes: Node[] = filteredPiezas.map(p => ({
      id: p.slug,
      pieza: p,
      radius: 5, // Base radius
    }));

    // Preparar links
    let links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const p1 = nodes[i].pieza;
        const p2 = nodes[j].pieza;
        const shared = [];

        if (p1.tema === p2.tema) shared.push(p1.tema);
        if (p1.industria === p2.industria) shared.push(p1.industria);
        
        const sharedMec = p1.mecanismo.filter(m => p2.mecanismo.includes(m as any));
        if (sharedMec.length > 0) shared.push(...sharedMec);

        if (shared.length > 0) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            sharedTags: shared
          });
        }
      }
    }

    // Calcular tamaño de nodos basado en conexiones (degree)
    nodes.forEach(n => {
      const connections = links.filter(l => l.source === n.id || l.target === n.id).length;
      n.radius = 5 + (connections * 2); // Crece con las conexiones
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    svg.attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");

    // Zoom and pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Forces
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => (d as Node).radius + 10).iterations(2));

    // Dibujar links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "var(--border)")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.min(d.sharedTags.length, 3));

    // Dibujar nodos
    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", "var(--foreground)")
      .attr("stroke", "var(--background)")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(drag(simulation) as any)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("fill", "var(--accent)");
        setHoveredNode(d);
        // Resaltar links conectados
        link.attr("stroke", l => (l.source === d || l.target === d) ? "var(--accent)" : "var(--border)")
            .attr("stroke-opacity", l => (l.source === d || l.target === d) ? 1 : 0.1);
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).attr("fill", "var(--foreground)");
        setHoveredNode(null);
        // Restaurar links
        link.attr("stroke", "var(--border)").attr("stroke-opacity", 0.6);
      })
      .on("click", (event, d) => {
        router.push(`/${d.pieza.seccion}/${d.pieza.slug}`);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
    });

    // Drag behavior
    function drag(simulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [piezas, activeFilters, router]);

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-60px)]">
      {/* Panel Lateral */}
      <div className="w-full md:w-64 border-r border-editorial bg-background overflow-y-auto shrink-0 flex flex-col">
        <div className="p-6 border-b border-editorial">
          <h2 className="font-serif text-2xl">Red Interactiva</h2>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            Explora las conexiones estructurales. Nodos con más conexiones aparecen más grandes.
          </p>
        </div>
        
        <div className="p-6 flex-1">
          <div className="mb-8">
            <h3 className="tag-text text-muted mb-4">Temas</h3>
            <div className="flex flex-col gap-2">
              {allTemas.map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="accent-accent" checked={activeFilters.tema.includes(t)} onChange={() => toggleFilter('tema', t)} />
                  <span className="tag-text group-hover:text-accent transition-colors">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="tag-text text-muted mb-4">Industrias</h3>
            <div className="flex flex-col gap-2">
              {allIndustrias.map(ind => (
                <label key={ind} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="accent-accent" checked={activeFilters.industria.includes(ind)} onChange={() => toggleFilter('industria', ind)} />
                  <span className="tag-text group-hover:text-accent transition-colors">{ind}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="tag-text text-muted mb-4">Mecanismos</h3>
            <div className="flex flex-col gap-2">
              {allMecanismos.map(mec => (
                <label key={mec} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="accent-accent" checked={activeFilters.mecanismo.includes(mec)} onChange={() => toggleFilter('mecanismo', mec)} />
                  <span className="tag-text group-hover:text-accent transition-colors">{mec}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visor de Red */}
      <div ref={containerRef} className="flex-1 relative bg-muted/5 cursor-move">
        <svg ref={svgRef} className="w-full h-full" />
        
        {/* Tooltip Overlay */}
        {hoveredNode && (
          <div className="absolute bottom-8 right-8 bg-background border border-editorial p-6 shadow-2xl max-w-sm pointer-events-none animate-in fade-in slide-in-from-bottom-4">
            <div className="flex gap-2 mb-3">
              <span className="tag-text text-accent">{hoveredNode.pieza.seccion}</span>
            </div>
            <h3 className="font-serif text-2xl leading-tight mb-4">
              {hoveredNode.pieza.titulo}
            </h3>
            <div className="flex flex-col gap-1">
              <span className="tag-text text-muted">Tema: <span className="text-foreground">{hoveredNode.pieza.tema}</span></span>
              <span className="tag-text text-muted">Ind: <span className="text-foreground">{hoveredNode.pieza.industria}</span></span>
              <span className="tag-text text-muted">Mec: <span className="text-foreground">{hoveredNode.pieza.mecanismo.join(', ')}</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
