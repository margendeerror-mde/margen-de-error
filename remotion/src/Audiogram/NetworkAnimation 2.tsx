import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const NetworkAnimation: React.FC<{ captions: Array<{text: string, startMs: number}>; audioOffsetInFrames: number }> = ({ captions, audioOffsetInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find frames for key concepts based on when they appear in the captions
  const findWordFrame = (keyword: string) => {
    const found = captions.find(c => c.text.toLowerCase().includes(keyword));
    if (!found) return 999999;
    return Math.round((found.startMs / 1000) * fps) + audioOffsetInFrames;
  };

  const frameTabacalera = useMemo(() => findWordFrame("tabacalera"), [captions]);
  const frameDuda = useMemo(() => findWordFrame("duda"), [captions]);
  const frameCiencia = useMemo(() => findWordFrame("ciencia"), [captions]);
  const frameAzucarera = useMemo(() => findWordFrame("azucarera"), [captions]);
  const framePlomo = useMemo(() => findWordFrame("plomo"), [captions]);

  // Basic springs for entering nodes based on their spoken time
  const scale1 = spring({ frame: frame - frameTabacalera, fps, config: { damping: 12 } }); // Tabacalera
  const scale2 = spring({ frame: frame - frameDuda, fps, config: { damping: 12 } }); // Duda Central
  const scale3 = spring({ frame: frame - frameCiencia, fps, config: { damping: 12 } }); // Ciencia
  const scale4 = spring({ frame: frame - frameAzucarera, fps, config: { damping: 12 } }); // Azucarera
  const scale5 = spring({ frame: frame - framePlomo, fps, config: { damping: 12 } }); // Plomo

  // Line drawing based on frame distance between two nodes. Ensure ranges are monotonically increasing.
  const line1Progress = interpolate(frame, [Math.min(frameTabacalera, frameDuda), Math.max(frameTabacalera, frameDuda) + 1], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const line2Progress = interpolate(frame, [Math.min(frameCiencia, frameDuda), Math.max(frameCiencia, frameDuda) + 1], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const line3Progress = interpolate(frame, [Math.min(frameAzucarera, frameDuda), Math.max(frameAzucarera, frameDuda) + 1], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      {/* Animated SVG Lines connecting concepts to the central "Duda" */}
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <line
          x1="20%" y1="30%" x2="50%" y2="50%"
          stroke="rgba(255,255,255,0.2)" strokeWidth="4"
          strokeDasharray="1000"
          strokeDashoffset={1000 - (1000 * line1Progress)}
        />
        <line
          x1="80%" y1="70%" x2="50%" y2="50%"
          stroke="rgba(255,255,255,0.2)" strokeWidth="4"
          strokeDasharray="1000"
          strokeDashoffset={1000 - (1000 * line2Progress)}
        />
        <line
          x1="20%" y1="80%" x2="50%" y2="50%"
          stroke="rgba(255,255,255,0.2)" strokeWidth="4"
          strokeDasharray="1000"
          strokeDashoffset={1000 - (1000 * line3Progress)}
        />
      </svg>

      {/* Concept Nodes */}
      <div style={{
        position: "absolute", top: "25%", left: "20%", transform: `translate(-50%, -50%) scale(${scale1})`,
        padding: "32px 64px", borderRadius: 80, backgroundColor: "#000", border: "4px solid #386641",
        color: "white", fontFamily: "sans-serif", fontSize: 48, fontWeight: "bold"
      }}>
        Tabacaleras
      </div>

      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${scale2})`,
        padding: "48px 96px", borderRadius: 100, backgroundColor: "#386641",
        color: "white", fontFamily: "sans-serif", fontSize: 64, fontWeight: "bold",
        boxShadow: "0 0 80px rgba(56, 102, 65, 0.8)",
        textAlign: "center"
      }}>
        Duda como Producto
      </div>

      <div style={{
        position: "absolute", top: "70%", left: "80%", transform: `translate(-50%, -50%) scale(${scale3})`,
        padding: "32px 64px", borderRadius: 80, backgroundColor: "#000", border: "4px solid #386641",
        color: "white", fontFamily: "sans-serif", fontSize: 48, fontWeight: "bold"
      }}>
        Consenso Científico
      </div>

      <div style={{
        position: "absolute", top: "80%", left: "20%", transform: `translate(-50%, -50%) scale(${scale4})`,
        padding: "32px 64px", borderRadius: 80, backgroundColor: "#000", border: "4px solid #386641",
        color: "white", fontFamily: "sans-serif", fontSize: 48, fontWeight: "bold"
      }}>
        Azucareras
      </div>

      <div style={{
        position: "absolute", top: "20%", left: "80%", transform: `translate(-50%, -50%) scale(${scale5})`,
        padding: "32px 64px", borderRadius: 80, backgroundColor: "#000", border: "4px solid #386641",
        color: "white", fontFamily: "sans-serif", fontSize: 48, fontWeight: "bold"
      }}>
        Plomo
      </div>
    </div>
  );
};
