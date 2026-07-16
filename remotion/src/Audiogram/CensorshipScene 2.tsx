import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
} from "remotion";

export const CensorshipScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create an array of lines to be redacted
  const lines = [
    { text: "TOP SECRET - INTERNAL USE ONLY", top: "10%" },
    { text: "DEPARTMENT OF JUSTICE", top: "25%" },
    { text: "CIVIL DISCOVERY - TOBACCO LITIGATION", top: "35%" },
    { text: "EXHIBIT #4129", top: "45%" },
    {
      text: "It is apparent that we must suppress the correlation.",
      top: "65%",
    },
    {
      text: "The public must not be alarmed by the recent findings.",
      top: "75%",
    },
    { text: "Maintain the narrative of uncertainty at all costs.", top: "85%" },
  ];

  return (
    <div style={{ flex: 1, backgroundColor: "#000", position: "relative" }}>
      {/* Photorealistic Vintage Document */}
      <Img
        src={staticFile("vintage_document.png")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.6) sepia(0.5) contrast(1.2)",
          zIndex: 1,
        }}
        durationInFrames={391}
        from={1}
      />
      {/* Corporate Stamp that survives redaction */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          color: "#c0392b",
          border: "8px solid #c0392b",
          padding: "20px 40px",
          fontFamily: "monospace",
          fontSize: "40px",
          fontWeight: "bold",
          transform: "rotate(-15deg)",
          opacity: 0.8,
          mixBlendMode: "multiply",
          zIndex: 10,
        }}
      >
        BROWN & WILLIAMSON
      </div>
      {lines.map((line, index) => {
        // Stagger the redaction based on the index
        const redactStartFrame = 30 + index * 25;

        // Progress of the black marker stroke (0 to 100%)
        const redactProgress = interpolate(
          frame,
          [redactStartFrame, redactStartFrame + 15],
          [0, 100],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        // Shake the text a bit when redacted
        const shake = interpolate(
          frame,
          [redactStartFrame, redactStartFrame + 5, redactStartFrame + 10],
          [0, 5, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: line.top,
              left: "15%",
              fontFamily: "monospace",
              fontSize: "40px",
              color: "#888",
              transform: `translateX(${shake}px)`,
              zIndex: 5,
            }}
          >
            {line.text}

            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "-10px",
                height: "60px",
                width: `${redactProgress}%`,
                backgroundColor: "#111",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                zIndex: 6,
              }}
            />
          </div>
        );
      })}
      {/* Cinematic Transition to Evidence Boxes */}
      {frame > 220 &&
        (() => {
          const boxesOpacity = interpolate(frame, [220, 280], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const boxesScale = interpolate(frame, [220, 390], [1, 1.1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 20,
                opacity: boxesOpacity,
                backgroundColor: "#000",
              }}
            >
              <Img
                src={staticFile("evidence_boxes.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${boxesScale})`,
                }}
              />
            </div>
          );
        })()}
    </div>
  );
};
