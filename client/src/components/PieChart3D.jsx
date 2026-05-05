// eslint-disable-next-line no-unused-vars
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
 
// eslint-disable-next-line no-unused-vars
const Slice = ({ startAngle, endAngle, color, index, label, value, depth = 0.5 }) => {
  const meshRef = useRef();
 
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.absarc(0, 0, 3, startAngle, endAngle, false);
    s.lineTo(0, 0);
    return s;
  }, [startAngle, endAngle]);
 
  const extrudeSettings = {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  };
 
  // Calculate label position (mid-angle of the slice)
  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = 3.5;
  const lx = Math.cos(midAngle) * labelRadius;
  const ly = Math.sin(midAngle) * labelRadius;
 
  return (
    <group>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      <Html position={[lx, depth + 0.5, ly]} center>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: `2px solid ${color}`,
          color: '#333',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          fontSize: '12px'
        }}>
          {label}: ${Math.round(value).toLocaleString()}
        </div>
      </Html>
    </group>
  );
};
 
const PieGroup = ({ data }) => {
  const groupRef = useRef();
 
  // eslint-disable-next-line no-unused-vars
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });
 
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
 
  const slices = useMemo(() => {
    let currentAngle = 0;
    return data.map((item, index) => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      // eslint-disable-next-line react-hooks/immutability
      currentAngle += sliceAngle;
 
      const colors = ["#7c3aed", "#ef4444", "#22c55e", "#f59e0b", "#3b82f6"];
      return {
        ...item,
        startAngle,
        endAngle,
        color: colors[index % colors.length]
      };
    });
  }, [data, total]);
 
  return (
    <group ref={groupRef}>
      {slices.map((slice, i) => (
        <Slice
          key={i}
          index={i}
          startAngle={slice.startAngle}
          endAngle={slice.endAngle}
          color={slice.color}
          label={slice.label}
          value={slice.value}
        />
      ))}
    </group>
  );
};
 
const PieChart3D = ({ data }) => {
  if (!data || data.length === 0) return null;
 
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 8, 8]} fov={40} />
        <OrbitControls enableZoom={true} enableRotate={true} />
       
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight
          position={[-5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
 
        <PieGroup data={data} />
      </Canvas>
    </div>
  );
};
 
export default PieChart3D;