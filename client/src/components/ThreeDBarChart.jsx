import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
 
const ThreeDScene = ({ data, formatCurrency }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
 
  const { maxVal, spacingX, chartData } = useMemo(() => {
    let max = 0;
    data.forEach((d) => {
      max = Math.max(max, d.rmd, d.tax, d.growth);
    });
 
    const numPoints = data.length || 1;
    const chartWidth = 22;
    const spacing = chartWidth / numPoints;
    const barWidth = spacing * 0.25;
 
    return {
      maxVal: max,
      spacingX: spacing,
      chartData: data.map((d, index) => ({
        ...d,
        x: (index - numPoints / 2) * spacing,
        bars: [
          { key: "rmd", value: d.rmd, color: "#7c3aed", offset: -barWidth },
          { key: "tax", value: d.tax, color: "#ef4444", offset: 0 },
          { key: "growth", value: d.growth, color: "#22c55e", offset: barWidth },
        ],
      })),
    };
  }, [data]);
 
  const scaleY = 10 / (maxVal || 1);
 
  return (
    <group position={[0, -4, 0]}>
    
      <gridHelper args={[26, 26, "#e5e7eb", "#f3f4f6"]} position={[0, 0, 0]} />
 
      
      {[0.25, 0.5, 0.75, 1].map((step) => {
        const yValue = maxVal * step;
        const yHeight = 10 * step;
        return (
          <group key={`y-axis-${step}`}>
            <mesh position={[0, yHeight, -2]}>
              <boxGeometry args={[26, 0.05, 0.05]} />
              <meshBasicMaterial color="#d1d5db" />
            </mesh>
            <Text
              position={[-13.5, yHeight, 0]}
              fontSize={0.8}
              color="#000000"
              fontWeight="bold"
              anchorX="right"
              anchorY="middle"
            >
              {"$" + (yValue / 1000).toFixed(0) + "k"}
            </Text>
          </group>
        );
      })}
 
      {chartData.map((d, i) => (
        <group
          key={`group-${i}`}
          position={[d.x, 0, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredIndex(i);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredIndex(null);
          }}
        >
          {/* X Axis Label */}
          {i % 2 === 0 && (
            <Text
              position={[0, -1.5, 3]}
              fontSize={0.7}
              color="#000000"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {d.label.split(" ")[0]}
            </Text>
          )}
 
         
          <mesh visible={false} position={[0, 5, 0]}>
            <boxGeometry args={[spacingX, 10, 4]} />
          </mesh>
 
          {d.bars.map((b, j) => {
            const height = b.value * scaleY;
            if (height <= 0.01) return null;
            const isHovered = hoveredIndex === i;
            return (
              <mesh
                key={`${i}-${j}`}
                position={[b.offset, height / 2, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[spacingX * 0.22, height, 0.4]} />
                <meshPhysicalMaterial
                  color={b.color}
                  roughness={0.2}
                  metalness={0.1}
                  clearcoat={isHovered ? 1 : 0}
                  clearcoatRoughness={0.1}
                  emissive={b.color}
                  emissiveIntensity={isHovered ? 0.3 : 0}
                />
              </mesh>
            );
          })}
 
          
          {hoveredIndex === i && (
            <Html
              position={[0, Math.max(...d.bars.map((b) => b.value * scaleY)) + 1, 0]}
              center
              style={{ pointerEvents: "none", zIndex: 100 }}
            >
              <div
                style={{
                  background: "rgba(17, 24, 39, 0.9)",
                  backdropFilter: "blur(8px)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  whiteSpace: "nowrap",
                  fontSize: "13px",
                  color: "#f9fafb",
                  fontFamily: "'Inter', sans-serif",
                  border: "1px solid rgba(255,255,255,0.1)",
                  minWidth: "160px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    paddingBottom: "4px",
                  }}
                >
                  Age: {d.label}
                </div>
                {d.bars.map((b) => (
                  <div
                    key={b.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: b.color,
                        }}
                      />
                      <span style={{ color: "#d1d5db", textTransform: "capitalize" }}>
                        {b.key}
                      </span>
                    </div>
                    <span style={{ fontWeight: "600", marginLeft: "12px" }}>
                      {formatCurrency(b.value)}
                    </span>
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
 
const ThreeDBarChart = ({ data, formatCurrency }) => {
  return (
    <Canvas camera={{ position: [0, 4, 23], fov: 45 }} shadows>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.4} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={10}
        maxDistance={50}
      />
      <ThreeDScene data={data} formatCurrency={formatCurrency} />
    </Canvas>
  );
};
 
export default ThreeDBarChart;