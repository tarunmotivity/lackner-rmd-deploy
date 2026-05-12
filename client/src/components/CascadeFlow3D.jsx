/* eslint-disable no-unused-vars */

import React, {
  useMemo,
  useState,
} from "react";

import { Canvas } from "@react-three/fiber";

import {
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
  Environment,
  Html,
  Line,
  Text,
} from "@react-three/drei";

import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";

import * as THREE from "three";

import useRmd from "../hooks/useRmd";

// ======================================================
// NORMALIZE
// ======================================================

const normalize = (
  value,
  max,
  amplitude
) => {
  if (!max || max === 0)
    return 0;

  return (
    (value / max) *
    amplitude
  );
};

// ======================================================
// TOOLTIP
// ======================================================

const FinancialTooltip = ({
  row,
}) => {
  const principal =
    row.endBalance -
    row.growth;

  return (
    <div
      style={{
        background:
          "rgba(15,23,42,0.96)",

        border:
          "1px solid rgba(255,255,255,0.08)",

        borderRadius:
          "14px",

        padding: "12px",

        minWidth: "220px",

        color: "white",

        backdropFilter:
          "blur(12px)",

        boxShadow:
          "0 0 16px rgba(0,212,255,0.12)",

        pointerEvents:
          "none",
      }}
    >
      <div
        style={{
          color: "#38bdf8",
          fontWeight: 700,
          marginBottom:
            "10px",
          fontSize: "15px",
        }}
      >
        Financial Projection
      </div>

      <div>
        Year: {row.year}
      </div>

      <div>
        Age: {row.age}
      </div>

      <div
        style={{
          color: "#ffffff",
        }}
      >
        Balance: $
        {Math.round(
          row.endBalance
        ).toLocaleString()}
      </div>

      <div
        style={{
          color: "#00d4ff",
        }}
      >
        Principal: $
        {Math.round(
          principal
        ).toLocaleString()}
      </div>

      <div
        style={{
          color: "#22c55e",
        }}
      >
        Growth: $
        {Math.round(
          row.growth
        ).toLocaleString()}
      </div>

      <div
        style={{
          color: "#ef4444",
        }}
      >
        Tax: $
        {Math.round(
          row.tax
        ).toLocaleString()}
      </div>

      <div
        style={{
          color: "#8b5cf6",
        }}
      >
        RMD: $
        {Math.round(
          row.rmd || 0
        ).toLocaleString()}
      </div>
    </div>
  );
};

// ======================================================
// AXES
// ======================================================

const Axes = () => {
  return (
    <group>
      <Line
        points={[
          [-12, 0, 2],
          [12, 0, 2],
        ]}
        color="#00d4ff"
        lineWidth={1}
      />

      <Line
        points={[
          [-12, 0, 2],
          [-12, 6, 2],
        ]}
        color="#00d4ff"
        lineWidth={1}
      />

      <Line
        points={[
          [-12, 0, 2],
          [-12, 0, -12],
        ]}
        color="#00d4ff"
        lineWidth={1}
      />

      <Text
        position={[12.5, 0, 2]}
        fontSize={0.2}
        color="#67e8f9"
      >
        Time
      </Text>

      <Text
        position={[
          -12,
          6.3,
          2,
        ]}
        fontSize={0.2}
        color="#67e8f9"
      >
        Wealth
      </Text>

      <Text
        position={[
          -12,
          0,
          -12.8,
        ]}
        fontSize={0.2}
        color="#67e8f9"
      >
        Years
      </Text>
    </group>
  );
};

// ======================================================
// WATERFALL LAYER
// ======================================================

const WaterfallLayer = ({
  rows,
  type,
  color,
  offsetY,
  maxValue,
  amplitude,
  opacity = 0.85,
}) => {
  const curves =
    useMemo(() => {
      return rows.map(
        (row, rowIndex) => {
          const points = [];

          const z =
            -rowIndex *
            0.7;

          let raw = 0;

          if (
            type ===
            "balance"
          ) {
            raw =
              row.endBalance;
          }

          if (
            type ===
            "principal"
          ) {
            raw =
              row.endBalance -
              row.growth;
          }

          if (
            type ===
            "growth"
          ) {
            raw =
              row.growth;
          }

          if (
            type === "tax"
          ) {
            raw =
              row.tax;
          }

          if (
            type === "rmd"
          ) {
            raw =
              row.rmd || 0;
          }

          const normalized =
            normalize(
              raw,
              maxValue,
              amplitude
            );

          for (
            let i = 0;
            i < 90;
            i++
          ) {
            const t =
              i / 89;

            const x =
              t * 18 - 9;

            const slope =
              Math.sin(
                t * Math.PI
              ) *
              normalized;

            const ripple =
              Math.sin(
                t * 8 +
                  rowIndex *
                    0.2
              ) *
              normalized *
              0.018;

            const y =
              slope +
              ripple +
              offsetY;

            points.push(
              new THREE.Vector3(
                x,
                y,
                z
              )
            );
          }

          return {
            row,
            points,
          };
        }
      );
    }, [
      rows,
      type,
      maxValue,
      amplitude,
      offsetY,
    ]);

  return (
    <group>
      {curves.map(
        (
          curve,
          curveIndex
        ) => (
          <group
            key={curveIndex}
          >
            <Line
              points={
                curve.points
              }
              color={color}
              lineWidth={1.5}
              transparent
              opacity={0.03}
            />

            <Line
              points={
                curve.points
              }
              color={color}
              lineWidth={0.9}
              transparent
              opacity={opacity}
            />

            {curve.points
              .filter(
                (_, i) =>
                  i % 45 === 0
              )
              .map(
                (
                  p,
                  i
                ) => (
                  <Line
                    key={i}
                    points={[
                      [
                        p.x,
                        0,
                        p.z,
                      ],
                      [
                        p.x,
                        p.y,
                        p.z,
                      ],
                    ]}
                    color={
                      color
                    }
                    lineWidth={
                      0.15
                    }
                    transparent
                    opacity={
                      0.02
                    }
                  />
                )
              )}
          </group>
        )
      )}
    </group>
  );
};

// ======================================================
// HOVER
// ======================================================

const HoverInteractionLayer = ({
  rows,
  maxBalance,
}) => {
  const [hovered, setHovered] =
    useState(null);

  const points = useMemo(() => {
    return rows.map((row, i) => {
      const x =
        (i / (rows.length - 1)) *
          18 -
        9;

      const z = -i * 0.7;

      const normalized =
        normalize(
          row.endBalance,
          maxBalance,
          3
        );

      const t =
        i / (rows.length - 1);

      const slope = Math.sin(
        t * Math.PI
      ) * normalized;

      const ripple =
        Math.sin(
          t * 8 + i * 0.2
        ) *
        normalized *
        0.018;

      const y =
        slope + ripple + 0.3;

      return {
        row,
        position: [x, y, z],
      };
    });
  }, [rows, maxBalance]);

  return (
    <group>
      {points.map(
        (point, index) => (
          <group key={index}>
            {/* GUIDE LINE */}
            <Line
              points={[
                [
                  point.position[0],
                  0,
                  point.position[2],
                ],
                [
                  point.position[0],
                  point.position[1],
                  point.position[2],
                ],
              ]}
              color="#ffffff"
              lineWidth={0.25}
              transparent
              opacity={0.05}
            />

            {/* GLOW SPHERE */}
            <mesh
              position={
                point.position
              }
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor =
                  "pointer";
                setHovered(index);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor =
                  "default";
                setHovered(null);
              }}
            >
              <sphereGeometry
                args={[
                  hovered === index
                    ? 0.16
                    : 0.11,
                  24,
                  24,
                ]}
              />

              <meshStandardMaterial
                color={
                  hovered === index
                    ? "#ffffff"
                    : "#00d4ff"
                }
                emissive="#00d4ff"
                emissiveIntensity={
                  hovered === index
                    ? 3
                    : 1.8
                }
              />
            </mesh>

            {/* INVISIBLE BIGGER HIT AREA */}
            <mesh
              position={
                point.position
              }
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(index);
              }}
              onPointerOut={() =>
                setHovered(null)
              }
            >
              <sphereGeometry
                args={[0.45, 12, 12]}
              />

              <meshBasicMaterial
                transparent
                opacity={0}
              />
            </mesh>

            {/* TOOLTIP */}
            {hovered === index && (
              <Html
                position={[
                  point.position[0],
                  point.position[1] +
                    1,
                  point.position[2],
                ]}
                center
                distanceFactor={8}
                zIndexRange={[
                  100,
                  0,
                ]}
                style={{
                  pointerEvents:
                    "none",
                  userSelect: "none",
                }}
              >
                <div
                  style={{
                    transform:
                      "translateY(-10px)",
                    animation:
                      "fadeIn 0.18s ease-out",
                  }}
                >
                  <FinancialTooltip
                    row={point.row}
                  />
                </div>
              </Html>
            )}
          </group>
        )
      )}
    </group>
  );
};

// ======================================================
// MAIN
// ======================================================

const CascadeFlow3D = () => {
  const { result } = useRmd();

  const rows =
    result?.rows?.slice(
      0,
      20
    ) || [];

  if (!rows.length)
    return null;

  const maxBalance =
    Math.max(
      ...rows.map(
        (r) =>
          r.endBalance
      )
    );

  const maxGrowth =
    Math.max(
      ...rows.map(
        (r) =>
          r.growth || 0
      )
    );

  const maxTax =
    Math.max(
      ...rows.map(
        (r) =>
          r.tax || 0
      )
    );

  const maxRmd =
    Math.max(
      ...rows.map(
        (r) =>
          r.rmd || 0
      )
    );

  const maxPrincipal =
    Math.max(
      ...rows.map(
        (r) =>
          r.endBalance -
          r.growth
      )
    );

  const totalTax =
    rows.reduce(
      (s, r) =>
        s + r.tax,
      0
    );

  const totalGrowth =
    rows.reduce(
      (s, r) =>
        s + r.growth,
      0
    );

  return (
    <div
      style={{
        width: "100%",
        height: "520px",

        borderRadius:
          "18px",

        overflow:
          "hidden",

        position:
          "relative",

        background:
          "radial-gradient(circle at center, #020617 0%, #000000 100%)",
      }}
    >
      {/* HUD */}

      <div
        style={{
          position:
            "absolute",

          top: 14,
          right: 14,

          zIndex: 10,

          width: "220px",

          padding:
            "12px",

          borderRadius:
            "16px",

          background:
            "rgba(15,23,42,0.72)",

          backdropFilter:
            "blur(12px)",

          border:
            "1px solid rgba(255,255,255,0.06)",

          color: "white",
        }}
      >
        <div
          style={{
            color: "#38bdf8",

            fontWeight: 700,

            fontSize: "16px",

            marginBottom:
              "10px",
          }}
        >
          Financial Waterfall
        </div>

        <div
          style={{
            lineHeight: 1.7,

            fontSize:
              "12px",
          }}
        >
          <div>
            Projection Years:{" "}
            {rows.length}
          </div>

          <div>
            Peak Balance: $
            {Math.round(
              maxBalance
            ).toLocaleString()}
          </div>

          <div>
            Total Tax: $
            {Math.round(
              totalTax
            ).toLocaleString()}
          </div>

          <div>
            Total Growth:
            $
            {Math.round(
              totalGrowth
            ).toLocaleString()}
          </div>
        </div>
      </div>

      {/* CANVAS */}

      <Canvas
        dpr={[1, 1.2]}
        gl={{
          antialias: true,
          powerPreference:
            "high-performance",
        }}
      >
        <color
          attach="background"
          args={["#020617"]}
        />

        <fog
          attach="fog"
          args={[
            "#020617",
            20,
            50,
          ]}
        />

        {/* CAMERA */}

       <PerspectiveCamera
  makeDefault
  position={[
    -12.4,
    5.9,
    16.8,
  ]}
  fov={49}
 />
        <OrbitControls
          enableZoom
          enableRotate
          minDistance={10}
          maxDistance={22}
          target={[
            0,
            1,
            -4,
          ]}
        />

        {/* LIGHTS */}

        <ambientLight
          intensity={0.75}
        />

        <directionalLight
          position={[
            8,
            12,
            6,
          ]}
          intensity={1.5}
        />

        <pointLight
          position={[
            -6,
            7,
            0,
          ]}
          color="#00d4ff"
          intensity={1.5}
        />

        {/* ENV */}

        <Environment preset="night" />

        {/* EFFECTS */}

        <EffectComposer>
          <Bloom
            intensity={0.28}
            luminanceThreshold={
              0.2
            }
            mipmapBlur
          />

          <Vignette
            eskil={false}
            offset={0.1}
            darkness={0.9}
          />
        </EffectComposer>

        {/* PARTICLES */}

        <Sparkles
          count={180}
          scale={[
            24,
            12,
            24,
          ]}
          size={0.5}
          speed={0.12}
          opacity={0.35}
          color="#dfffff"
          noise={0.35}
        />

        {/* FLOOR */}

        <mesh
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          position={[
            0,
            -0.2,
            -4,
          ]}
        >
          <planeGeometry
            args={[50, 50]}
          />

          <meshStandardMaterial
            color="#050816"
            metalness={0.2}
            roughness={0.95}
          />
        </mesh>

        {/* ORBITAL RINGS */}

        {[5, 8, 11].map(
          (r, i) => (
            <mesh
              key={i}
              rotation={[
                -Math.PI / 2,
                0,
                i * 0.2,
              ]}
              position={[
                0,
                0,
                -4,
              ]}
            >
              <ringGeometry
                args={[
                  r,
                  r + 0.02,
                  96,
                ]}
              />

              <meshBasicMaterial
                color="#00d4ff"
                transparent
                opacity={0.015}
              />
            </mesh>
          )
        )}

        {/* AXES */}

        <Axes />

        {/* BALANCE */}

        <WaterfallLayer
          rows={rows}
          type="balance"
          color="#ffffff"
          offsetY={0.3}
          maxValue={
            maxBalance
          }
          amplitude={3}
          opacity={0.65}
        />

        {/* PRINCIPAL */}

        <WaterfallLayer
          rows={rows}
          type="principal"
          color="#00d4ff"
          offsetY={0}
          maxValue={
            maxPrincipal
          }
          amplitude={2.5}
          opacity={0.75}
        />

        {/* GROWTH */}

        <WaterfallLayer
          rows={rows}
          type="growth"
          color="#22c55e"
          offsetY={-0.18}
          maxValue={
            maxGrowth
          }
          amplitude={1.2}
          opacity={0.75}
        />

        {/* TAX */}

        <WaterfallLayer
          rows={rows}
          type="tax"
          color="#ef4444"
          offsetY={-0.36}
          maxValue={maxTax}
          amplitude={0.9}
          opacity={0.75}
        />

        {/* RMD */}

        <WaterfallLayer
          rows={rows}
          type="rmd"
          color="#8b5cf6"
          offsetY={-0.54}
          maxValue={maxRmd}
          amplitude={1}
          opacity={0.75}
        />

        {/* HOVER */}

        <HoverInteractionLayer
          rows={rows}
          maxBalance={
            maxBalance
          }
        />
      </Canvas>
    </div>
  );
};

export default CascadeFlow3D;