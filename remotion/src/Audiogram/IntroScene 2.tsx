import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Photocopier light scanning from top to bottom (Frame 0 to 240)
  const scanProgress = interpolate(frame, [0, 240], [0, height], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The violent zoom of the specific quote (starts around frame 390 to match the 13th second)
  const quoteZoomFrame = 390;
  
  // Spring scale for the quote
  const quoteScale = spring({
    frame: frame - quoteZoomFrame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 1 },
  });

  // Fade out the rest of the document when the quote scales
  const documentOpacity = interpolate(frame, [quoteZoomFrame, quoteZoomFrame + 15], [1, 0.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // Blur the document
  const documentBlur = interpolate(frame, [quoteZoomFrame, quoteZoomFrame + 15], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const memoText = `MEMORANDUM CONFIDENCIAL
Fecha: 1969
De: Vicepresidencia Ejecutiva
Para: Directorio Brown & Williamson

Asunto: Estrategia de Comunicación Pública

Es imperativo entender la naturaleza de nuestro mercado. 
No buscamos refutar la ciencia. Buscamos gestionar la percepción.

La duda es nuestro producto.

Dado que es la mejor manera de competir con el "cuerpo de 
hechos" que existe en la mente del público general.
Es también el medio para establecer una controversia.`;

  return (
    <div style={{ flex: 1, backgroundColor: "#050505", position: "relative" }}>
      
      {/* Background Document (Revealed by scanner) */}
      <div 
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: documentOpacity,
          filter: `blur(${documentBlur}px)`,
          // The clip path creates the "revealed" area above the scanner line
          clipPath: `polygon(0 0, 100% 0, 100% ${scanProgress}px, 0 ${scanProgress}px)`
        }}
      >
        <Img 
          src={staticFile("vintage_document.png")} 
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.8, filter: "grayscale(100%) contrast(1.5)" }} 
        />
        <div style={{
          position: "absolute",
          padding: "120px 240px",
          color: "#222",
          fontFamily: "monospace",
          fontSize: "40px",
          fontWeight: "bold",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          mixBlendMode: "multiply",
          zIndex: 2
        }}>
          {memoText}
        </div>
      </div>

      {/* Photocopier Light Beam */}
      {frame < 260 && (
        <div
          style={{
            position: "absolute",
            top: scanProgress,
            left: 0,
            width: "100%",
            height: "8px",
            backgroundColor: "#386641",
            boxShadow: "0 0 40px 10px rgba(56, 102, 65, 0.8)",
            zIndex: 10
          }}
        />
      )}

      {/* The Impact Quote */}
      {frame >= quoteZoomFrame && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            textAlign: "center",
            transform: `translate(-50%, -50%) scale(${quoteScale})`,
            color: "#FFFFFF",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "100px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-2px",
            lineHeight: "1.1",
            textShadow: "0px 20px 40px rgba(0,0,0,0.9)",
            zIndex: 20
          }}
        >
          <span style={{ backgroundColor: "#386641", padding: "0 20px" }}>LA DUDA</span> ES<br/>NUESTRO PRODUCTO.
        </div>
      )}

    </div>
  );
};
