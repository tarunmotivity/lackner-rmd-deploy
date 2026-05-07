/* eslint-disable no-unused-vars */
import { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Html,
  Sparkles,
  Stars,
  Line
} from "@react-three/drei";
import { Card, CardContent, Typography, Box } from "@mui/material";
import * as THREE from "three";
import useRmd from "../hooks/useRmd";
import { formatCurrency } from "../utils/format";
 
const GlowPoint = ({ position, color, isHovered, label, fullData }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const currentY = useRef(0);
  const targetY = position[1];
  const hasAnimated = useRef(false);
 
  useEffect(() => {
    if (hasAnimated.current) {
      currentY.current = targetY;
      return;
    }
   
    let start = null;
    const animate = (time) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / 1000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      currentY.current = eased * targetY;
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimated.current = true;
      }
    };
    requestAnimationFrame(animate);
  }, [targetY]);
 
  useFrame((state) => {
    if (meshRef.current) {
      // Points now stay perfectly locked to the trend line
      meshRef.current.position.y = currentY.current;
     
      const targetScale = (isHovered || hovered) ? 1.6 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
     
      if (isHovered || hovered) {
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, position[2] + 1.5, 0.1);
      } else {
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, position[2], 0.1);
      }
 
      if (glowRef.current) {
        glowRef.current.position.copy(meshRef.current.position);
        glowRef.current.scale.copy(meshRef.current.scale).multiplyScalar(2.2);
      }
    }
  });
 
  return (
    <group>
      <mesh
        ref={meshRef}
        position={[position[0], 0, position[2]]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isHovered ? 8 : 2}
          metalness={1}
          roughness={0}
          reflectivity={1}
          clearcoat={1}
        />
      </mesh>
 
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered || isHovered ? 0.5 : 0.2}
          depthWrite={false}
        />
      </mesh>
 
      {(hovered || isHovered) && <pointLight intensity={5} distance={7} color={color} />}
    </group>
  );
};
 
const ParallaxWrapper = ({ children }) => {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      const x = (state.mouse.x * 1.2);
      const y = (state.mouse.y * 0.4);
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x, 0.05);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, y, 0.05);
    }
  });
  return <group ref={group}>{children}</group>;
};
 
const ScatterPoints = ({ chartData, scaleY, spacingX }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
 
  return (
    <group>
      {chartData.map((d, i) => (
        <group key={`scatter-group-${i}`} position={[d.x, 0, 0]}>
          <mesh
            visible={false}
            position={[0, 5, 0]}
            onPointerOver={(e) => { e.stopPropagation(); setHoveredIndex(i); }}
            onPointerOut={(e) => { e.stopPropagation(); setHoveredIndex(null); }}
          >
            <boxGeometry args={[spacingX * 0.9, 12, 6]} />
          </mesh>
 
          {i % 2 === 0 && (
            <Text position={[0, 0.5, 4.7]} fontSize={0.7} color="#ffffff" fontWeight="900">
              {d.label?.split(" ")[0] || d.age}
            </Text>
          )}
 
          {d.points.map((p, j) => {
            const height = p.value * scaleY;
            if (height <= 0.01) return null;
            return (
              <GlowPoint
                key={`${i}-${j}`}
                position={[0, height, p.offsetZ]}
                color={p.color}
                isHovered={hoveredIndex === i}
                label={d.label}
                fullData={d}
              />
            );
          })}
 
          {hoveredIndex === i && (
            <Html position={[0, 16, 0]} center zIndexRange={[100, 0]}>
              <div style={{
                background: "rgba(5, 8, 22, 0.96)",
                backdropFilter: "blur(20px)",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(217, 70, 239, 0.15)",
                color: "#fff",
                minWidth: "180px",
                pointerEvents: "none"
              }}>
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "10px", marginBottom: "12px", fontSize: "15px", fontWeight: "900", color: "#0ea5e9", letterSpacing: "0.05em" }}>
                  {d.label}
                </div>
                {d.points.map((p) => (
                  <div key={p.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }} />
                      <span style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>{p.key.toUpperCase()}</span>
                    </div>
                    <span style={{ fontWeight: "800", fontSize: "15px" }}>{formatCurrency(p.value)}</span>
                  </div>
                ))}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
};
 
const AnimatedAxis = ({ position, args, color }) => {
  const meshRef = useRef();
  const [scale, setScale] = useState(0);
 
  useEffect(() => {
    let start = null;
    const animate = (time) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setScale(eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);
 
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 0.8 + Math.sin(state.clock.getElapsedTime() * 3) * 0.2;
      meshRef.current.material.opacity = pulse;
    }
  });
 
  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={args[0] > args[1] ? [scale, 1, 1] : [1, scale, 1]}
    >
      <boxGeometry args={args} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
};
 
const ScatterScene = ({ data }) => {
  const { maxVal, spacingX, chartData } = useMemo(() => {
    let max = 0;
    data.forEach((d) => {
      max = Math.max(max, d.rmd, d.tax, d.growth);
    });
    max = max * 1.15; // 15% padding for 'neat' look at the top
    const numPoints = data.length || 1;
    const spacing = 22 / numPoints;
    return {
      maxVal: max,
      spacingX: spacing,
      chartData: data.map((d, index) => ({
        ...d,
        label: d.label || `${d.age} (${d.year})`,
        x: (index - numPoints / 2) * spacing,
        points: [
          { key: "rmd", value: d.rmd, color: "#d946ef", offsetZ: -2 },
          { key: "tax", value: d.tax, color: "#f43f5e", offsetZ: 0 },
          { key: "growth", value: d.growth, color: "#10b981", offsetZ: 2 },
        ],
      })),
    };
  }, [data]);
 
  const scaleY = 10 / (maxVal || 1);
 
  return (
    <group position={[0, -4.5, 0]}>
      <ParallaxWrapper>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} transparent opacity={0.95} />
        </mesh>
        <gridHelper args={[60, 60, "#1e293b", "#1e293b"]} position={[0, 0, 0]} transparent opacity={0.4} />
        <AnimatedAxis position={[-13.5, 5, 0]} args={[0.05, 10, 0.05]} color="#0ea5e9" />
        <AnimatedAxis position={[0, 0, 4.7]} args={[27, 0.05, 0.05]} color="#0ea5e9" />
        <ScatterPoints chartData={chartData} scaleY={scaleY} spacingX={spacingX} />
        <Stars radius={120} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={500} scale={[45, 25, 25]} size={2.5} speed={0.6} color="#fff" />
      </ParallaxWrapper>
 
      {/* Y Axis Labels */}
      {[0.25, 0.5, 0.75, 1].map((step) => {
        const yValue = maxVal * step;
        const yHeight = 10 * step;
        return (
          <group key={`y-axis-${step}`}>
            <mesh position={[0, yHeight, -3]}>
              <boxGeometry args={[40, 0.02, 0.02]} />
              <meshBasicMaterial color="#0ea5e9" transparent opacity={0.2} />
            </mesh>
            <Text position={[-15.5, yHeight, 0]} fontSize={0.7} color="#ffffff" fontWeight="800" anchorX="right">
              {"$" + (yValue / 1000).toFixed(0) + "k"}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
 
const ScatterProjection = ({ compact = false }) => {
  const { result } = useRmd();
  if (!result || result.rows.length === 0) return null;
  const data = result.rows.slice(0, 30);
 
 const content = (
  <Box
    sx={{
      width: "100%",
      height: compact ? "100%" : "100%",

      display: "flex",
      flexDirection: "column",

      overflow: "visible",

      borderRadius: "18px",
    }}
  >
      <Box
  sx={{
    width: "100%",
    height: "420px",

    position: "relative",

    overflow: "visible",

    borderRadius: "18px",
  }}
>
        <Canvas camera={{ position: [0, 5, 34], fov: 38 }} shadows style={{ background: compact ? "transparent" : "#050816", borderRadius: "16px", overflow: 'visible' }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[20, 20, 10]} intensity={1.5} color="#a855f7" />
          <pointLight position={[-20, 20, -10]} intensity={1} color="#10b981" />
          <ScatterScene data={data} />
          <OrbitControls
            makeDefault
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 8}
            maxAzimuthAngle={Math.PI / 8}
            enablePan={false}
          />
        </Canvas>
      </Box>
 
 <Box
  sx={{
    display: "flex",

    gap: 4,

    justifyContent: "center",

    pt: 1.2,
    pb: 0.4,

    flexWrap: "wrap",
  }}
>
        {[
          { label: 'RMD', color: '#d946ef' },
          { label: 'Tax', color: '#f43f5e' },
          { label: 'Growth', color: '#10b981' }
        ].map(item => (
          <Box key={item.label} display="flex" alignItems="center" gap={2}>
            <Box sx={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: '50%', boxShadow: `0 0 15px ${item.color}`, border: '2px solid rgba(255,255,255,0.3)' }} />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em' }}>{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
 
  if (compact) return content;
 
  return (
    <Card
      className="dark"
      sx={{
        borderRadius: 5,
        overflow: 'visible',
        background: 'linear-gradient(135deg, #050816 0%, #0f172a 100%) !important',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
        position: 'relative',
      }}
    >
      <CardContent sx={{ overflow: 'visible', p: 4 }}>
        {content}
      </CardContent>
    </Card>
  );
};
 
export default ScatterProjection;