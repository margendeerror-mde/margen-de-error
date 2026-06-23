import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, Sequence, useVideoConfig, Series } from "remotion";
import { IntroScene } from "./IntroScene";
import { CensorshipScene } from "./CensorshipScene";
import { MimicryScene } from "./MimicryScene";
import { MazeScene } from "./MazeScene";
import { OutroScene } from "./OutroScene";
import { Oscilloscope } from "./Oscilloscope";
import { Spectrum } from "./Spectrum";
import { NetworkAnimation } from "./NetworkAnimation";
import { BASE_SIZE } from "./constants";
import { FONT_FAMILY } from "./font";
import { AudiogramCompositionSchemaType } from "./schema";

export const Audiogram: React.FC<AudiogramCompositionSchemaType> = ({
  visualizer,
  audioFileUrl,
  coverImageUrl,
  titleText,
  titleColor,
  audioOffsetInSeconds,
  captions,
}) => {
  const { durationInFrames, fps, width } = useVideoConfig();

  if (!captions) {
    throw new Error(
      "subtitles should have been provided through calculateMetadata",
    );
  }

  const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);
  const baseNumberOfSamples = Number(visualizer.numberOfSamples);

  return (
    <AbsoluteFill>
      <Sequence from={-audioOffsetInFrames}>
        <Audio src={audioFileUrl} from={-103} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            color: "white",
            padding: "48px",
            backgroundColor: "#0A0A0A", // Margen de Error dark background
            fontFamily: FONT_FAMILY,
            position: "relative",
          }}
        >
          <Series>
            {/* Scene 1: Photocopier Intro (approx 25 seconds = 750 frames to account for music intro) */}
            <Series.Sequence durationInFrames={750}>
              <IntroScene />
            </Series.Sequence>

            {/* Scene 2: Censorship & Secretismo (15 seconds = 450 frames) */}
            <Series.Sequence durationInFrames={450}>
              <CensorshipScene />
            </Series.Sequence>

            {/* Scene 3: Network Animation and Visualizer (40 seconds = 1200 frames) */}
            <Series.Sequence durationInFrames={1200}>
              <div
                style={{
                  display: "flex",
                  zIndex: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "40px",
                }}
              >
                <Img
                  style={{ borderRadius: "12px", maxHeight: "350px" }}
                  src={coverImageUrl}
                  from={1}
                />
                <div
                  style={{
                    marginLeft: "64px",
                    lineHeight: "1.25",
                    fontWeight: 800,
                    color: titleColor,
                    fontSize: "72px",
                  }}
                >
                  {titleText}
                </div>
              </div>
              <div
                style={{
                  zIndex: 10,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "120px",
                }}
              >
                <div style={{ width: "80%" }}>
                  <Oscilloscope
                    waveColor={visualizer.color}
                    // @ts-expect-error visualizer union type is too strict
                    padding={visualizer.padding}
                    audioSrc={audioFileUrl}
                    key={audioFileUrl}
                    numberOfSamples={baseNumberOfSamples}
                    // @ts-expect-error visualizer union type is too strict
                    windowInSeconds={visualizer.windowInSeconds}
                    // @ts-expect-error visualizer union type is too strict
                    posterization={visualizer.posterization}
                    // @ts-expect-error visualizer union type is too strict
                    amplitude={visualizer.amplitude}
                  />
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                }}
              >
                <NetworkAnimation
                  captions={captions}
                  audioOffsetInFrames={audioOffsetInFrames}
                />
              </div>
            </Series.Sequence>

            {/* Scene 4: Mimicry (40 seconds = 1200 frames) */}
            <Series.Sequence durationInFrames={1200}>
              <MimicryScene />
            </Series.Sequence>

            {/* Scene 5: Maze Paralysis (60 seconds = 1800 frames) */}
            <Series.Sequence durationInFrames={1800}>
              <MazeScene />
            </Series.Sequence>

            {/* Scene 6: Outro (Rest of the video) */}
            <Series.Sequence
              durationInFrames={Math.max(10, durationInFrames - 4200)}
            >
              <OutroScene />
            </Series.Sequence>
          </Series>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
