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
  Html,
  PerspectiveCamera,
  Environment,
  Float,
  Sparkles,
} from "@react-three/drei";

import * as THREE from "three";

// =========================
// SLICE
// =========================

const Slice = ({
  startAngle,
  endAngle,
  color,
  label,
  value,
  percentage,
  depth = 1.15,
  index,
}) => {
  const meshRef = useRef();

  const glowRef = useRef();

  const [hovered, setHovered] =
    useState(false);

  // =========================
  // SHAPE
  // =========================

  const shape = useMemo(() => {
    const s = new THREE.Shape();

    s.moveTo(0, 0);

    s.absarc(
      0,
      0,
      3,
      startAngle,
      endAngle,
      false
    );

    s.lineTo(0, 0);

    return s;
  }, [startAngle, endAngle]);

  // =========================
  // EXTRUDE SETTINGS
  // =========================

  const extrudeSettings =
    useMemo(
      () => ({
        depth,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 2,
        bevelSize: 0.08,
        bevelThickness: 0.08,
      }),
      [depth]
    );

  // =========================
  // TOOLTIP POSITION
  // =========================

  const centerAngle =
    startAngle +
    (endAngle - startAngle) / 2;

  const tooltipRadius = 4;

  const lx =
    Math.cos(centerAngle) *
    tooltipRadius;

  const lz =
    Math.sin(centerAngle) *
    tooltipRadius;

  // =========================
  // ANIMATION
  // =========================

  useFrame((state) => {
    const t =
      state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.position.y =
        hovered
          ? 0.16
          : Math.sin(
              t * 1.5 + index
            ) * 0.025;

      const scale = hovered
        ? 1.025
        : 1;

      meshRef.current.scale.set(
        scale,
        scale,
        scale
      );
    }

    if (glowRef.current) {
      glowRef.current.material.opacity =
        hovered
          ? 0.32 +
            Math.sin(t * 4) *
              0.05
          : 0.1;
    }
  });

  return (
    <group>
      {/* GLOW DISC */}

      <mesh
        ref={glowRef}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[0, -0.02, 0]}
      >
        <circleGeometry
          args={[3.05, 64]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* MAIN SLICE */}

      <Float
        speed={1.5}
        rotationIntensity={0.03}
        floatIntensity={0.08}
      >
        <mesh
          ref={meshRef}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          castShadow
          receiveShadow
          onPointerOver={() =>
            setHovered(true)
          }
          onPointerOut={() =>
            setHovered(false)
          }
        >
          <extrudeGeometry
            args={[
              shape,
              extrudeSettings,
            ]}
          />

          <meshPhysicalMaterial
            color={color}
            roughness={0.25}
            metalness={0.55}
            clearcoat={1}
            clearcoatRoughness={0.15}
            emissive={color}
            emissiveIntensity={
              hovered ? 0.65 : 0.18
            }
          />
        </mesh>
      </Float>

      {/* EDGE GLOW */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          depth + 0.02,
          0,
        ]}
      >
        <ringGeometry
          args={[2.92, 3.02, 128]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={
            hovered ? 0.85 : 0.22
          }
        />
      </mesh>

      {/* HOVER TOOLTIP */}

      {hovered && (
        <Html
          position={[
            lx,
            depth + 1.35,
            lz,
          ]}
          center
          distanceFactor={7}
        >
          <div
            style={{
              background:
                "rgba(15,23,42,0.96)",

              border: `1px solid ${color}`,

              padding: "10px 12px",

              borderRadius: "14px",

              color: "white",

              fontSize: "11px",

              backdropFilter:
                "blur(16px)",

              boxShadow: `0 0 35px ${color}55`,

              minWidth: "145px",

              pointerEvents: "none",
            }}
          >
            <div
              style={{
                color,

                fontWeight: 700,

                marginBottom: "6px",

                fontSize: "12px",
              }}
            >
              {label}
            </div>

            <div
              style={{
                opacity: 0.95,
                marginBottom: "4px",
              }}
            >
              $
              {Math.round(
                value
              ).toLocaleString()}
            </div>

            <div
              style={{
                opacity: 0.7,
                fontSize: "10px",
              }}
            >
              {percentage.toFixed(1)}%
              of portfolio
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// =========================
// PIE GROUP
// =========================

const PieGroup = ({ data }) => {
  const groupRef = useRef();

  // =========================
  // REMOVE ZERO VALUES
  // =========================

  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          Number(item.value) > 0
      ),
    [data]
  );

  // =========================
  // TOTAL
  // =========================

  const total = useMemo(
    () =>
      filteredData.reduce(
        (sum, item) =>
          sum + item.value,
        0
      ),
    [filteredData]
  );

  // =========================
  // FIXED COLORS
  // =========================

  const getColor = (
    label = ""
  ) => {
    const l =
      label.toLowerCase();

    if (
      l.includes("withdraw") ||
      l.includes("rmd")
    ) {
      return "#7c3aed";
    }

    if (l.includes("growth")) {
      return "#22c55e";
    }

    if (l.includes("tax")) {
      return "#ef4444";
    }

    return "#00d4ff";
  };

  // =========================
  // SORT ORDER
  // =========================

  const orderedData = useMemo(() => {
    return [...filteredData].sort(
      (a, b) => {
        const order = {
          Withdrawals: 0,
          Growth: 1,
          Taxes: 2,
        };

        return (
          (order[a.label] ?? 99) -
          (order[b.label] ?? 99)
        );
      }
    );
  }, [filteredData]);

  // =========================
  // SLICES
  // =========================

  const slices = useMemo(() => {
    return orderedData.map(
      (item, index) => {
        const previousTotal =
          orderedData
            .slice(0, index)
            .reduce(
              (sum, d) =>
                sum + d.value,
              0
            );

        const startAngle =
          (previousTotal /
            total) *
          Math.PI *
          2;

        const sliceAngle =
          (item.value / total) *
          Math.PI *
          2;

        const endAngle =
          startAngle +
          sliceAngle;

        return {
          ...item,

          startAngle,

          endAngle,

          percentage:
            (item.value /
              total) *
            100,

          color: getColor(
            item.label
          ),
        };
      }
    );
  }, [orderedData, total]);

  // =========================
  // GROUP FLOATING
  // =========================

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(
          state.clock.elapsedTime *
            0.9
        ) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {slices.map(
        (slice, i) => (
          <Slice
            key={i}
            index={i}
            startAngle={
              slice.startAngle
            }
            endAngle={
              slice.endAngle
            }
            color={slice.color}
            label={slice.label}
            value={slice.value}
            percentage={
              slice.percentage
            }
          />
        )
      )}
    </group>
  );
};

// =========================
// MAIN COMPONENT
// =========================

const PieChart3D = ({
  data,
}) => {
  if (
    !data ||
    data.length === 0
  )
    return null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "620px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "22px",
        background:
          "radial-gradient(circle at center, #071326 0%, #020617 45%, #000000 100%)",
      }}
    >
      {/* INFO BOX */}

      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          background:
            "rgba(15,23,42,0.75)",
          backdropFilter:
            "blur(14px)",
          border:
            "1px solid rgba(255,255,255,0.08)",
          borderRadius: "18px",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.25)",
          padding: "14px 18px",
          color: "white",
          maxWidth: "280px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: "6px",
            color: "#38bdf8",
          }}
        >
          3D Portfolio Allocation
        </div>

        <div
          style={{
            fontSize: "12px",
            lineHeight: 1.6,
            opacity: 0.7,
          }}
        >
          Interactive 3D portfolio
          visualization with
          animated orbital motion,
          live slice glow and
          cinematic lighting.
        </div>
      </div>

      {/* CANVAS */}

      <Canvas shadows>
        {/* CAMERA */}

        <PerspectiveCamera
          makeDefault
          position={[0, 6.5, 11]}
          fov={38}
        />

        {/* CONTROLS */}

        <OrbitControls
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          minDistance={7}
          maxDistance={18}
        />

        {/* LIGHTS */}

        <ambientLight
          intensity={0.45}
        />

        <directionalLight
          position={[6, 12, 8]}
          intensity={2}
          castShadow
          shadow-mapSize-width={
            2048
          }
          shadow-mapSize-height={
            2048
          }
        />

        <pointLight
          position={[-8, 6, -5]}
          intensity={2}
          color="#00d4ff"
        />

        <pointLight
          position={[8, 4, 5]}
          intensity={1.4}
          color="#7c3aed"
        />

        {/* ENVIRONMENT */}

        <Environment preset="city" />

        {/* FLOOR */}

        <mesh
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          position={[0, -1, 0]}
          receiveShadow
        >
          <circleGeometry
            args={[8, 128]}
          />

          <meshStandardMaterial
            color="#03111f"
            roughness={0.85}
            metalness={0.15}
          />
        </mesh>

        {/* UNDER GLOW */}

        <mesh
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          position={[0, -0.94, 0]}
        >
          <circleGeometry
            args={[3.8, 64]}
          />

          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.08}
          />
        </mesh>

        {/* GRID RINGS */}

        {[4, 5.5, 7].map(
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
                -0.98 +
                  i * 0.001,
                0,
              ]}
            >
              <ringGeometry
                args={[
                  r,
                  r + 0.03,
                  128,
                ]}
              />

              <meshBasicMaterial
                color="#00d4ff"
                transparent
                opacity={
                  0.08 -
                  i * 0.02
                }
              />
            </mesh>
          )
        )}

        {/* SPARKLES */}

        <Sparkles
          count={80}
          scale={[20, 8, 20]}
          size={2}
          speed={0.4}
          opacity={0.35}
          color="#ffffff"
        />

        {/* PIE */}

        <PieGroup data={data} />
      </Canvas>
    </div>
  );
};

export default PieChart3D;