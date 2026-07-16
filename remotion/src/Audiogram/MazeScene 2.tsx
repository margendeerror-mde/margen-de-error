import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const MazeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // The main arrow's progress (trying to move across the screen)
  const mainArrowX = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 20, mass: 10 }
  });

  // When the frame hits 120, the noise arrows start appearing
  const noiseArrowsFrame = 120;
  
  // Create an array of random noise arrows
  const noiseArrows = useMemo(() => {
    const arrows = [];
    for (let i = 0; i < 50; i++) {
      arrows.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * 360,
        delay: Math.random() * 60 // Appear randomly within 2 seconds after trigger
      });
    }
    return arrows;
  }, [width, height]);

  // Main arrow stops moving as noise appears
  const stoppingPower = interpolate(frame, [noiseArrowsFrame, noiseArrowsFrame + 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ flex: 1, backgroundColor: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      
      {/* Title */}
      <div style={{ position: "absolute", top: "10%", width: "100%", textAlign: "center", color: "#FFF", fontFamily: "sans-serif", fontSize: "40px", fontWeight: "bold" }}>
        PARÁLISIS POR ANÁLISIS
      </div>

      {/* Main Forward Arrow (Consensus/Action) */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "10%",
        transform: `translate(0, -50%) translateX(${mainArrowX * 500 * stoppingPower}px)`,
        color: "#386641",
        fontSize: "150px",
        zIndex: 10,
        filter: "drop-shadow(0px 0px 30px #386641)"
      }}>
        ➔
      </div>

      {/* Noise Arrows (Doubt/Paralysis) */}
      {noiseArrows.map((arrow) => {
        const arrowScale = spring({
          frame: frame - (noiseArrowsFrame + arrow.delay),
          fps,
          config: { damping: 12 }
        });

        return (
          <div key={arrow.id} style={{
            position: "absolute",
            top: arrow.y,
            left: arrow.x,
            transform: `translate(-50%, -50%) rotate(${arrow.rotation}deg) scale(${arrowScale})`,
            color: "#c0392b",
            fontSize: "80px",
            opacity: 0.6,
            zIndex: 5
          }}>
            ➔
          </div>
        );
      })}

    </div>
  );
};
