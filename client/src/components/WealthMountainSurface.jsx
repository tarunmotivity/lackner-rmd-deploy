/* eslint-disable no-unused-vars */

import React, {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
  Environment,
  Html,
  CatmullRomLine,
} from "@react-three/drei";

import * as THREE from "three";

// =========================================
// MOUNTAIN
// =========================================

const MountainMesh = ({ data }) => {
  const meshRef = useRef();

  const [hoveredPoint, setHoveredPoint] =
    useState(null);

  // =========================================
  // DATA
  // =========================================

  const balances = data.map(
    (d) => Number(d.balance || 0)
  );

  const maxBalance = Math.max(
    ...balances,
    1
  );

  // =========================================
  // SMOOTH BALANCES
  // =========================================

  const smoothBalances = balances.map(
    (value, index, arr) => {
      const prev =
        arr[index - 1] ?? value;

      const next =
        arr[index + 1] ?? value;

      return (
        prev * 0.25 +
        value * 0.5 +
        next * 0.25
      );
    }
  );

  // =========================================
  // STABLE HEIGHT SCALE
  // =========================================

  const adaptiveHeight = 5.8;

  // =========================================
  // DIMENSIONS
  // =========================================

  const WIDTH = 22;

  const DEPTH = 16;

  // =========================================
  // GEOMETRY
  // =========================================

  const geometry = useMemo(() => {
    const geo =
      new THREE.PlaneGeometry(
        WIDTH,
        DEPTH,
        140,
        60
      );

    const positions =
      geo.attributes.position;

    for (
      let i = 0;
      i < positions.count;
      i++
    ) {
      const x =
        positions.getX(i);

      const z =
        positions.getY(i);

      const normalizedX =
        (x + WIDTH / 2) /
        WIDTH;

      // =========================================
      // INTERPOLATION FIX
      // =========================================

      const exactIndex =
        normalizedX *
        (smoothBalances.length - 1);

      const leftIndex =
        Math.floor(exactIndex);

      const rightIndex =
        Math.min(
          leftIndex + 1,
          smoothBalances.length - 1
        );

      const t =
        exactIndex -
        leftIndex;

      const leftValue =
        smoothBalances[
          leftIndex
        ];

      const rightValue =
        smoothBalances[
          rightIndex
        ];

      const interpolatedBalance =
        leftValue * (1 - t) +
        rightValue * t;

      const normalizedBalance =
        interpolatedBalance /
        maxBalance;

      // subtle terrain wave

      const wave =
        Math.sin(z * 0.35) *
        0.015;

      const height =
        normalizedBalance *
          adaptiveHeight +
        wave;

      positions.setZ(i, height);
    }

    positions.needsUpdate = true;

    geo.computeVertexNormals();

    return geo;
  }, [
    smoothBalances,
    maxBalance,
  ]);

  // =========================================
  // LINE POINTS
  // =========================================

  const linePoints = useMemo(() => {
    return smoothBalances.map(
      (balance, index) => {
        const x =
          (index /
            (smoothBalances.length -
              1)) *
            WIDTH -
          WIDTH / 2;

        const normalized =
          balance /
          maxBalance;

        const y =
          normalized *
            adaptiveHeight +
          0.12;

        return new THREE.Vector3(
          x,
          y,
          0
        );
      }
    );
  }, [
    smoothBalances,
    maxBalance,
  ]);

  // =========================================
  // PEAK
  // =========================================

  const peakIndex =
    smoothBalances.reduce(
      (
        maxIdx,
        value,
        idx,
        arr
      ) =>
        value >
        arr[maxIdx]
          ? idx
          : maxIdx,
      0
    );

  const lateIndex = Math.floor(
    data.length * 0.82
  );

  // =========================================
  // ANIMATION
  // =========================================

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z =
        Math.sin(
          state.clock.elapsedTime *
            0.04
        ) * 0.0015;
    }
  });

  return (
    <group>
      {/* MAIN SURFACE */}

      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[
          -Math.PI / 2.35,
          0,
          0,
        ]}
        position={[0, -1.7, 0]}
      >
        <meshPhysicalMaterial
          color="#c7fff4"
          transparent
          opacity={0.82}
          roughness={0.25}
          metalness={0.08}
          clearcoat={1}
          clearcoatRoughness={
            0.2
          }
          emissive="#7df9ff"
          emissiveIntensity={
            0.03
          }
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* WIREFRAME */}

      <mesh
        geometry={geometry}
        rotation={[
          -Math.PI / 2.35,
          0,
          0,
        ]}
        position={[0, -1.69, 0]}
      >
        <meshBasicMaterial
          color="#dfffff"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* FLOOR */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[0, -4.2, 0]}
      >
        <circleGeometry
          args={[18, 128]}
        />

        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.04}
        />
      </mesh>

      {/* FLOOR RINGS */}

      {[7, 11, 15].map(
        (r, i) => (
          <mesh
            key={i}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
            position={[
              0,
              -4.15,
              0,
            ]}
          >
            <ringGeometry
              args={[
                r,
                r + 0.04,
                128,
              ]}
            />

            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={
                0.04 - i * 0.01
              }
            />
          </mesh>
        )
      )}

      {/* SMOOTH CURVE */}

      <CatmullRomLine
        points={linePoints}
        color="#d8ffff"
        lineWidth={1.4}
        transparent
        opacity={0.9}
      />

      {/* POINTS */}

      {/* POINTS */}

{linePoints.map(
  (point, index) => {
    const d = data[index];

    if (index % 4 !== 0)
      return null;

    return (
      <group key={index}>
        {/* VISIBLE POINT */}
        <mesh
          position={[
            point.x,
            point.y,
            point.z,
          ]}
          onPointerOver={(e) => {
            e.stopPropagation();

            document.body.style.cursor =
              "pointer";

            setHoveredPoint({
              ...d,
              x: point.x,
              y: point.y,
            });
          }}
          onPointerOut={(e) => {
            e.stopPropagation();

            document.body.style.cursor =
              "default";

            setHoveredPoint(
              (prev) =>
                prev?.year ===
                d.year
                  ? null
                  : prev
            );
          }}
        >
          <sphereGeometry
  args={[
    hoveredPoint?.year ===
    d.year
      ? 0.12
      : 0.08,
    18,
    18,
  ]}
/>

<meshStandardMaterial
  color="#e6ffff"
  emissive="#7dd3fc"
  emissiveIntensity={
    hoveredPoint?.year ===
    d.year
      ? 1.2
      : 0.45
  }
  roughness={0.3}
  metalness={0.15}
/>
        </mesh>

        {/* INVISIBLE HIT AREA */}
        <mesh
          position={[
            point.x,
            point.y,
            point.z,
          ]}
          onPointerOver={(e) => {
            e.stopPropagation();

            setHoveredPoint({
              ...d,
              x: point.x,
              y: point.y,
            });
          }}
          onPointerOut={() => {
            setHoveredPoint(
              (prev) =>
                prev?.year ===
                d.year
                  ? null
                  : prev
            );
          }}
        >
          <sphereGeometry
            args={[0.28, 12, 12]}
          />

          <meshBasicMaterial
            transparent
            opacity={0}
          />
        </mesh>
      </group>
    );
  }
)}

      {/* TOOLTIP */}

      {hoveredPoint && (
        <Html
  position={[
    hoveredPoint.x,
    hoveredPoint.y + 0.9,
    0,
  ]}
  center
  distanceFactor={8}
  zIndexRange={[100, 0]}
  style={{
    pointerEvents: "none",
    userSelect: "none",
  }}
>
          <div
            style={{
              position:
                "relative",

              transform:
                hoveredPoint.x <
                -8
                  ? "translate(40px,-120%)"
                  : hoveredPoint.x >
                    8
                  ? "translate(-220px,-120%)"
                  : hoveredPoint.y >
                    5
                  ? "translate(-50%,40px)"
                  : "translate(-50%,-120%)",

              background:
                "rgba(15,23,42,0.96)",

              border:
                "1px solid rgba(0,212,255,0.25)",

              borderRadius:
                "16px",

              padding:
                "14px 16px",

              color: "white",

              minWidth:
                "190px",

              backdropFilter:
                "blur(14px)",

              boxShadow:
                "0 0 30px rgba(0,212,255,0.12)",

              pointerEvents:
                "none",

              transition:
                "all 0.18s ease",
            }}
          >
            <div
              style={{
                color:
                  "#38bdf8",

                fontWeight:
                  700,

                marginBottom:
                  "8px",

                fontSize:
                  "15px",
              }}
            >
              Year{" "}
              {
                hoveredPoint.year
              }
            </div>

            <div
              style={{
                fontSize:
                  "13px",

                opacity: 0.9,
              }}
            >
              Age:{" "}
              {hoveredPoint.age}
            </div>

            <div
              style={{
                fontSize:
                  "13px",

                opacity: 0.9,

                marginTop:
                  "6px",
              }}
            >
              Balance: $
              {Math.round(
                hoveredPoint.balance
              ).toLocaleString()}
            </div>
          </div>
        </Html>
      )}

      {/* PEAK LABEL */}

      {linePoints[peakIndex] && (
        <Html
          position={[
            linePoints[peakIndex]
              .x,
            linePoints[peakIndex]
              .y + 1.2,
            0,
          ]}
          center
        >
          <div
            style={{
              color: "white",

              fontWeight: 700,

              fontSize: "14px",

              textShadow:
                "0 0 12px rgba(0,0,0,0.8)",

              pointerEvents:
                "none",
            }}
          >
            Peak
            <br />
            Balance
          </div>
        </Html>
      )}

      {/* RETIREMENT */}

      {linePoints[lateIndex] && (
        <Html
          position={[
            linePoints[lateIndex]
              .x,
            linePoints[lateIndex]
              .y + 1,
            0,
          ]}
          center
        >
          <div
            style={{
              color:
                "rgba(255,255,255,0.9)",

              fontWeight: 600,

              fontSize: "13px",

              textShadow:
                "0 0 12px rgba(0,0,0,0.8)",

              pointerEvents:
                "none",
            }}
          >
            Late
            <br />
            Retirement
          </div>
        </Html>
      )}
    </group>
  );
};

// =========================================
// MAIN COMPONENT
// =========================================

const WealthMountainSurface = ({
  data = [],
}) => {
  if (!data.length)
    return null;

  return (
    <div

    onPointerLeave={() => {
      document.body.style.cursor =
        "default";
    }}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "720px",

        borderRadius:
          "24px",

        overflow: "hidden",

        position:
          "relative",

        background:
          "radial-gradient(circle at center, #071326 0%, #020617 55%, #000000 100%)",
      }}
    >
      {/* AURORA */}

      <div
        style={{
          position:
            "absolute",

          inset: 0,

          background:
            "radial-gradient(circle at 15% 20%, rgba(0,212,255,0.08), transparent 35%), radial-gradient(circle at 85% 70%, rgba(124,58,237,0.06), transparent 40%)",

          pointerEvents:
            "none",

          filter:
            "blur(60px)",
        }}
      />

      {/* HUD */}

      <div
        style={{
          position:
            "absolute",

          top: 24,

          right: 24,

          width: "240px",

          background:
            "rgba(15,23,42,0.78)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          borderRadius:
            "18px",

          padding:
            "18px",

          color: "white",

          backdropFilter:
            "blur(16px)",

          boxShadow:
            "0 0 35px rgba(0,0,0,0.28)",

          zIndex: 1000,
        }}
      >
        <div
          style={{
            color: "#38bdf8",

            fontWeight: 700,

            marginBottom:
              "14px",

            fontSize: "20px",
          }}
        >
          Financial Insights
        </div>

        <div
          style={{
            fontSize:
              "14px",

            lineHeight:
              1.9,

            opacity: 0.92,
          }}
        >
          <div>
            Peak Wealth: $
            {Math.round(
              Math.max(
                ...balancesSafe(
                  data
                )
              )
            ).toLocaleString()}
          </div>

          <div>
            Projection
            Years:{" "}
            {data.length}
          </div>

          <div>
            Total Taxes: $
            {Math.round(
              data.reduce(
                (s, d) =>
                  s +
                  Number(
                    d.tax || 0
                  ),
                0
              )
            ).toLocaleString()}
          </div>

          <div>
            Total Growth:
            $
            {Math.round(
              data.reduce(
                (s, d) =>
                  s +
                  Number(
                    d.growth ||
                      0
                  ),
                0
              )
            ).toLocaleString()}
          </div>
        </div>
      </div>

      <Canvas
        shadows
        camera={{
          position: [0, 8, 24],
          fov: 45,
        }}
      >
        {/* FOG */}

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
            0,
            8,
            24,
          ]}
          fov={45}
        />

        {/* CONTROLS */}

        <OrbitControls
          enableZoom
          enableRotate
          autoRotate={false}
          minDistance={12}
          maxDistance={30}
          target={[0, 1, 0]}
        />

        {/* LIGHTS */}

        <ambientLight
          intensity={0.55}
        />

        <directionalLight
          position={[
            10,
            14,
            8,
          ]}
          intensity={1.8}
        />

        <pointLight
          position={[
            -10,
            8,
            -4,
          ]}
          intensity={1.2}
          color="#00d4ff"
        />

        <pointLight
          position={[
            10,
            8,
            8,
          ]}
          intensity={0.8}
          color="#7c3aed"
        />

        {/* ENVIRONMENT */}

        <Environment preset="night" />

        {/* PARTICLES */}

        <Sparkles
  count={220}
  scale={[
    34,
    16,
    34,
  ]}
  size={3}
  speed={0.45}
  opacity={0.65}
  color="#ffffff"
/>

        {/* MOUNTAIN */}

        <MountainMesh
          data={data}
        />
      </Canvas>
    </div>
  );
};

// =========================================
// SAFE BALANCES
// =========================================

function balancesSafe(data) {
  return data.map((d) =>
    Number(d.balance || 0)
  );
}

export default WealthMountainSurface;