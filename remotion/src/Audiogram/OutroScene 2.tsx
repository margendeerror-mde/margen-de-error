import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // The moment the barcode transformation begins
  const transformationFrame = 150; 

  // Entrance spring for the word "DUDA"
  const entranceScale = spring({
    frame,
    fps,
    config: { damping: 14 }
  });

  // Stretch the letters vertically into a barcode
  const stretchY = spring({
    frame: frame - transformationFrame,
    fps,
    config: { damping: 200, mass: 5 } // Very rigid, mechanical stretch
  });

  // Fade out the letters, fade in the barcode lines
  const fadeText = interpolate(frame, [transformationFrame, transformationFrame + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Barcode dimensions
  const barcodeLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 40; i++) {
      lines.push({
        id: i,
        thickness: Math.random() * 20 + 2,
        spacing: Math.random() * 15 + 5
      });
    }
    return lines;
  }, []);

  return (
    <div style={{ flex: 1, backgroundColor: "#000", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
      
      {/* Initial Text */}
      <div style={{
        position: "absolute",
        transform: `scale(${entranceScale}) scaleY(${1 + stretchY * 10})`,
        color: "#FFF",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "200px",
        fontWeight: 900,
        letterSpacing: "10px",
        opacity: fadeText,
        zIndex: 2
      }}>
        DUDA
      </div>

      {/* Barcode Reveal */}
      <div style={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        height: "300px",
        opacity: 1 - fadeText,
        zIndex: 1,
        transform: `scaleY(${stretchY})`
      }}>
        {barcodeLines.map((line) => (
          <div key={line.id} style={{
            width: `${line.thickness}px`,
            backgroundColor: "#FFF",
            marginRight: `${line.spacing}px`,
            height: "100%"
          }} />
        ))}
      </div>
      
      {/* Price / Subtitle under the barcode */}
      <div style={{
        position: "absolute",
        bottom: "30%",
        fontFamily: "monospace",
        fontSize: "40px",
        color: "#386641",
        fontWeight: "bold",
        opacity: 1 - fadeText,
        transform: `translateY(${(1 - stretchY) * 50}px)`
      }}>
        FUE EL PRODUCTO.
      </div>

    </div>
  );
};
