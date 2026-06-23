import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const MimicryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate paths for two waves
  const points = 100;
  
  // Science Wave (Clean, predictable sine wave)
  const sciencePath = useMemo(() => {
    let path = `M 0 ${height / 2}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      // Animate the phase based on frame
      const y = height / 2 + Math.sin((i / 10) + (frame / 10)) * 100;
      path += ` L ${x} ${y}`;
    }
    return path;
  }, [frame, width, height]);

  // Industry Mimicry Wave (Tries to match, but has noise/glitches)
  const mimicryPath = useMemo(() => {
    let path = `M 0 ${height / 2}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      // Base wave attempts to copy science wave
      let y = height / 2 + Math.sin((i / 10) + (frame / 10)) * 100;
      
      // Add random glitch spikes every few frames to simulate false science
      if (Math.random() > 0.9 && frame % 5 === 0) {
        y += (Math.random() - 0.5) * 150;
      }
      // Add general noisy variance
      y += Math.sin(frame * i) * 5;

      path += ` L ${x} ${y}`;
    }
    return path;
  }, [frame, width, height]);

  // Fade in the mimicry wave later
  const mimicryOpacity = interpolate(frame, [60, 120], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{ flex: 1, backgroundColor: "#0A0A0A", position: "relative" }}>
      
      <div style={{ position: "absolute", top: "10%", width: "100%", textAlign: "center", color: "#FFF", fontFamily: "sans-serif", fontSize: "40px", fontWeight: "bold" }}>
        MIMETISMO CIENTÍFICO
      </div>

      <svg width="100%" height="100%">
        {/* The Truth (Science) */}
        <path 
          d={sciencePath} 
          fill="none" 
          stroke="#386641" 
          strokeWidth="10" 
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0px 0px 20px #386641)" }}
        />
        
        {/* The Doubt (Industry) */}
        <path 
          d={mimicryPath} 
          fill="none" 
          stroke="#c0392b" 
          strokeWidth="6" 
          strokeLinecap="round"
          style={{ opacity: mimicryOpacity, filter: "drop-shadow(0px 0px 10px #c0392b)" }}
        />
      </svg>
      
      {/* Legend */}
      <div style={{ position: "absolute", bottom: "10%", left: "10%", color: "#386641", fontFamily: "monospace", fontSize: "30px", fontWeight: "bold" }}>
        SEÑAL: CONSENSO
      </div>
      <div style={{ position: "absolute", bottom: "10%", right: "10%", color: "#c0392b", fontFamily: "monospace", fontSize: "30px", fontWeight: "bold", opacity: mimicryOpacity }}>
        RUIDO: DUDA
      </div>

    </div>
  );
};
