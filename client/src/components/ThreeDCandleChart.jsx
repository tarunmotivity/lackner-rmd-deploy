// import { Canvas } from "@react-three/fiber";
// import {
//   OrbitControls,
//   Sparkles,
//   Html,
//   Text,
// } from "@react-three/drei";

// import {
//   useState,
//   useMemo,
// } from "react";

// const MAX_HEIGHT = 8;

// const Candle = ({
//   x,
//   open,
//   close,
//   high,
//   low,
//   color,
//   active,
// }) => {
//   const bodyHeight = Math.max(
//     Math.abs(close - open),
//     0.35
//   );

//   const bodyCenter =
//     (open + close) / 2;

//   const wickHeight =
//     Math.max(
//       Math.abs(high - low),
//       0.08
//     );

//   return (
//     <group
//       position={[
//         x,
//         0,
//         active ? 0.9 : 0,
//       ]}
//       scale={active ? 1.14 : 1}
//     >
//       {/* WICK */}

//       <mesh
//         position={[
//           0,
//           (high + low) / 2,
//           0,
//         ]}
//       >
//         <cylinderGeometry
//           args={[
//             0.01,
//             0.01,
//             wickHeight,
//             10,
//           ]}
//         />

//         <meshStandardMaterial
//           color={color}
//           emissive={color}
//           emissiveIntensity={
//             active ? 14 : 4
//           }
//         />
//       </mesh>

//       {/* BODY */}

//       <mesh
//         position={[
//           0,
//           bodyCenter,
//           0,
//         ]}
//       >
//         <boxGeometry
//           args={[
//             0.16,
//             bodyHeight,
//             0.16,
//           ]}
//         />

//         <meshPhysicalMaterial
//           color={color}
//           emissive={color}
//           emissiveIntensity={
//             active ? 14 : 4
//           }
//           roughness={0.15}
//           metalness={1}
//           clearcoat={1}
//         />
//       </mesh>
//     </group>
//   );
// };

// const normalize = (value) => {
//   return (
//     (Number(value || 0) /
//       100000) *
//     MAX_HEIGHT
//   );
// };

// const createStableCandle = (
//   value,
//   index,
//   variance = 0.25
// ) => {
//   const base =
//     normalize(value);

//   const seed =
//     Math.sin(index * 12.9898) *
//     43758.5453;

//   const rand1 =
//     seed - Math.floor(seed);

//   const rand2 =
//     Math.sin(index * 78.233) *
//     12345.678;

//   const rand3 =
//     rand2 - Math.floor(rand2);

//   const open =
//     base *
//     (0.9 + rand1 * variance);

//   const close =
//     base *
//     (0.9 + rand3 * variance);

//   const high =
//     Math.max(open, close) +
//     Math.max(
//       base *
//         (0.15 +
//           rand1 * 0.1),
//       0.08
//     );

//   const low = Math.max(
//     0,
//     Math.min(open, close) -
//       base *
//         (0.12 +
//           rand3 * 0.08)
//   );

//   return {
//     open,
//     close,
//     high,
//     low,
//   };
// };

// const ThreeDCandleChart = ({
//   data = [],
//   formatCurrency = (v) =>
//     `$${Number(
//       v || 0
//     ).toLocaleString()}`,
// }) => {
//   const [
//     hoveredIndex,
//     setHoveredIndex,
//   ] = useState(null);

//   const visibleData =
//     data.slice(0, 16);

//   const candleData =
//     useMemo(() => {
//       return visibleData.map(
//         (d, i) => ({
//           rmd:
//             createStableCandle(
//               d.rmd,
//               i + 1
//             ),

//           tax:
//             createStableCandle(
//               d.tax,
//               i + 50,
//               0.18
//             ),

//           growth:
//             createStableCandle(
//               d.growth,
//               i + 100
//             ),
//         })
//       );
//     }, [visibleData]);

//   return (
//     <Canvas
//       gl={{
//         antialias: true,
//         powerPreference:
//           "high-performance",
//       }}
//       camera={{
//         position: [
//           0,
//           8.5,
//           18,
//         ],
//         fov: 48,
//       }}
//       style={{
//         background:
//           "radial-gradient(circle at top, #020817 0%, #01030b 60%, #000000 100%)",

//         borderRadius: "20px",

//         height: "520px",
//       }}
//     >
//       {/* LIGHTS */}

//       <ambientLight
//         intensity={1}
//       />

//       <pointLight
//         position={[0, 10, 10]}
//         intensity={2.5}
//         color="#00ffff"
//       />

//       <pointLight
//         position={[
//           0,
//           8,
//           -10,
//         ]}
//         intensity={2}
//         color="#7c3aed"
//       />

//       {/* PARTICLES */}

//       <Sparkles
//         count={160}
//         scale={[34, 16, 34]}
//         size={2}
//         speed={0.4}
//         opacity={0.75}
//         color="#ffffff"
//       />

//       {/* GRID */}

//       <gridHelper
//         args={[
//           26,
//           26,
//           "#334155",
//           "#1e293b",
//         ]}
//       />

//       {/* Y AXIS */}

//       {[0, 24, 48, 73, 97].map(
//         (v, i) => (
//           <Text
//             key={i}
//             position={[
//               -10.8,
//               (v / 100) *
//                 MAX_HEIGHT,
//               0,
//             ]}
//             fontSize={0.3}
//             color="#e2e8f0"
//             outlineWidth={0.003}
//             outlineColor="#000000"
//             anchorX="right"
//           >
//             {`$${v}k`}
//           </Text>
//         )
//       )}

//       {/* GRID LINES */}

//       {[24, 48, 73, 97].map(
//         (v, i) => {
//           const y =
//             (v / 100) *
//             MAX_HEIGHT;

//           return (
//             <mesh
//               key={i}
//               position={[
//                 0,
//                 y,
//                 -2,
//               ]}
//               renderOrder={10}
//             >
//               <boxGeometry
//                 args={[
//                   18,
//                   0.04,
//                   0.04,
//                 ]}
//               />

//               <meshBasicMaterial
//                 color="#cbd5e1"
//                 transparent
//                 opacity={0.45}
//                 depthTest={false}
//                 depthWrite={false}
//               />
//             </mesh>
//           );
//         }
//       )}

//       {/* CANDLES */}

//       {visibleData.map(
//         (d, i) => {
//           const active =
//             hoveredIndex === i;

//           const baseX =
//             i * 1.25 - 8;

//           return (
//             <group key={i}>
//               {/* HOVER AREA */}

//               <mesh
//                 position={[
//                   baseX + 0.3,
//                   4,
//                   0,
//                 ]}
//                 onPointerOver={() =>
//                   setHoveredIndex(i)
//                 }
//                 onPointerOut={() =>
//                   setHoveredIndex(
//                     null
//                   )
//                 }
//               >
//                 <boxGeometry
//                   args={[
//                     1.2,
//                     10,
//                     1.8,
//                   ]}
//                 />

//                 <meshBasicMaterial
//                   transparent
//                   opacity={0}
//                 />
//               </mesh>

//               {/* RMD */}

//               <Candle
//                 x={baseX}
//                 {
//                   ...candleData[i]
//                     .rmd
//                 }
//                 color="#7c3aed"
//                 active={active}
//               />

//               {/* TAX */}

//               <Candle
//                 x={baseX + 0.3}
//                 {
//                   ...candleData[i]
//                     .tax
//                 }
//                 color="#ef4444"
//                 active={active}
//               />

//               {/* GROWTH */}

//               <Candle
//                 x={baseX + 0.6}
//                 {
//                   ...candleData[i]
//                     .growth
//                 }
//                 color="#22c55e"
//                 active={active}
//               />

//               {/* LABEL */}

//               <Text
//                 position={[
//                   baseX + 0.3,
//                   -0.7,
//                   0,
//                 ]}
//                 fontSize={0.22}
//                 color="#ffffff"
//                 anchorX="center"
//               >
//                 {d.label}
//               </Text>
//             </group>
//           );
//         }
//       )}

//       {/* TOOLTIP */}

//       {hoveredIndex !==
//         null && (
//         <Html
//           position={[0, 5.8, 0]}
//           center
//           style={{
//             pointerEvents:
//               "none",
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               background:
//                 "rgba(5,10,25,0.97)",

//               backdropFilter:
//                 "blur(25px)",

//               padding: "14px",

//               borderRadius:
//                 "20px",

//               boxShadow:
//                 "0 0 80px rgba(0,255,255,0.25)",

//               color: "#f8fafc",

//               width: "220px",

//               border:
//                 "1px solid rgba(255,255,255,0.08)",

//               fontFamily:
//                 "Inter, sans-serif",
//             }}
//           >
//             {/* AGE */}

//             <div
//               style={{
//                 fontSize:
//                   "14px",

//                 fontWeight:
//                   "900",

//                 marginBottom:
//                   "14px",

//                 borderBottom:
//                   "1px solid rgba(255,255,255,0.08)",

//                 paddingBottom:
//                   "10px",

//                 color:
//                   "#ffffff",
//               }}
//             >
//               Age:{" "}
//               {
//                 visibleData?.[
//                   hoveredIndex
//                 ]?.label
//               }
//             </div>

//             {[
//               {
//                 label: "RMD",

//                 value: Number(
//                   visibleData?.[
//                     hoveredIndex
//                   ]?.rmd || 0
//                 ),

//                 color:
//                   "#7c3aed",
//               },

//               {
//                 label: "Tax",

//                 value: Number(
//                   visibleData?.[
//                     hoveredIndex
//                   ]?.tax || 0
//                 ),

//                 color:
//                   "#ef4444",
//               },

//               {
//                 label:
//                   "Growth",

//                 value: Number(
//                   visibleData?.[
//                     hoveredIndex
//                   ]?.growth || 0
//                 ),

//                 color:
//                   "#22c55e",
//               },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 style={{
//                   display:
//                     "flex",

//                   justifyContent:
//                     "space-between",

//                   alignItems:
//                     "center",

//                   marginBottom:
//                     "12px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display:
//                       "flex",

//                     alignItems:
//                       "center",

//                     gap: "12px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 12,

//                       height: 12,

//                       borderRadius:
//                         "50%",

//                       background:
//                         item.color,

//                       boxShadow: `0 0 18px ${item.color}`,

//                       flexShrink: 0,
//                     }}
//                   />

//                   <span
//                     style={{
//                       fontSize:
//                         "14px",

//                       color:
//                         "#ffffff",

//                       fontWeight:
//                         "700",
//                     }}
//                   >
//                     {item.label}
//                   </span>
//                 </div>

//                 <span
//                   style={{
//                     fontWeight:
//                       "900",

//                     fontSize:
//                       "14px",

//                     color:
//                       "#ffffff",

//                     marginLeft:
//                       "20px",

//                     whiteSpace:
//                       "nowrap",
//                   }}
//                 >
//                   {formatCurrency?.(
//                     Number(
//                       item.value ||
//                         0
//                     )
//                   ) || "$0"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </Html>
//       )}

//       {/* CONTROLS */}

//       <OrbitControls
//         enablePan={false}
//         enableZoom
//         enableRotate
//         target={[0, 2.5, 0]}
//         minDistance={14}
//         maxDistance={24}
//         maxPolarAngle={
//           Math.PI / 2.3
//         }
//         minPolarAngle={
//           Math.PI / 2.9
//         }
//       />
//     </Canvas>
//   );
// };

// export default ThreeDCandleChart;

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Sparkles,
  Html,
  Text,
} from "@react-three/drei";

import {
  useState,
  useMemo,
} from "react";

const MAX_HEIGHT = 8;

const Candle = ({
  x,
  open,
  close,
  high,
  low,
  color,
  active,
}) => {
  const bodyHeight = Math.max(
    Math.abs(close - open),
    0.35
  );

  const bodyCenter =
    (open + close) / 2;

  const wickHeight =
    Math.max(
      Math.abs(high - low),
      0.08
    );

  return (
    <group
      position={[
        x,
        0,
        active ? 0.9 : 0,
      ]}
      scale={active ? 1.14 : 1}
    >
      {/* WICK */}

      <mesh
        position={[
          0,
          (high + low) / 2,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.02,
            0.02,
            wickHeight,
            12,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            active ? 14 : 4
          }
        />
      </mesh>

      {/* BODY */}

      <mesh
        position={[
          0,
          bodyCenter,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.24,
            bodyHeight,
            0.24,
          ]}
        />

        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={
            active ? 14 : 4
          }
          roughness={0.15}
          metalness={1}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
};

const normalize = (value) => {
  return (
    (Number(value || 0) /
      100000) *
    MAX_HEIGHT
  );
};

const createStableCandle = (
  value,
  index,
  variance = 0.25
) => {
  const base =
    normalize(value);

  const seed =
    Math.sin(index * 12.9898) *
    43758.5453;

  const rand1 =
    seed - Math.floor(seed);

  const rand2 =
    Math.sin(index * 78.233) *
    12345.678;

  const rand3 =
    rand2 - Math.floor(rand2);

  const open =
    base *
    (0.9 + rand1 * variance);

  const close =
    base *
    (0.9 + rand3 * variance);

  const high =
    Math.max(open, close) +
    Math.max(
      base *
        (0.15 +
          rand1 * 0.1),
      0.08
    );

  const low = Math.max(
    0,
    Math.min(open, close) -
      base *
        (0.12 +
          rand3 * 0.08)
  );

  return {
    open,
    close,
    high,
    low,
  };
};

const ThreeDCandleChart = ({
  data = [],
  formatCurrency = (v) =>
    `$${Number(
      v || 0
    ).toLocaleString()}`,
}) => {
  const [
    hoveredIndex,
    setHoveredIndex,
  ] = useState(null);

  const visibleData =
    data.slice(0, 16);

  const candleData =
    useMemo(() => {
      return visibleData.map(
        (d, i) => ({
          rmd:
            createStableCandle(
              d.rmd,
              i + 1
            ),

          tax:
            createStableCandle(
              d.tax,
              i + 50,
              0.18
            ),

          growth:
            createStableCandle(
              d.growth,
              i + 100
            ),
        })
      );
    }, [visibleData]);

  return (
    <Canvas
  shadows
  dpr={[1, 1.5]}
  gl={{
    antialias: true,
    powerPreference:
      "high-performance",
  }}
  camera={{
  position: [
    0,
    7.2,
    15.5,
  ],
  fov: 46,
}}
      style={{
        background:
          "radial-gradient(circle at top, #020817 0%, #01030b 60%, #000000 100%)",

        borderRadius: "20px",

        height: "520px",
      }}
    >
      {/* LIGHTS */}

      <ambientLight
        intensity={1}
      />

      <pointLight
        position={[0, 10, 10]}
        intensity={2.5}
        color="#00ffff"
      />

      <pointLight
        position={[
          0,
          8,
          -10,
        ]}
        intensity={2}
        color="#7c3aed"
      />

      {/* PARTICLES */}

      <Sparkles
        count={160}
        scale={[34, 16, 34]}
        size={2}
        speed={0.4}
        opacity={0.75}
        color="#ffffff"
      />

      {/* GRID */}

      <gridHelper
  args={[
    20,
    20,
    "#3b82f6",
    "#0f172a",
  ]}
  position={[0, 0, 0]}
/>

      {/* Y AXIS */}

      {[0, 24, 48, 73, 97].map(
        (v, i) => (
          <Text
            key={i}
            position={[
              -10.8,
              (v / 100) *
                MAX_HEIGHT,
              0,
            ]}
            fontSize={0.3}
            color="#e2e8f0"
            outlineWidth={0.003}
            outlineColor="#000000"
            anchorX="right"
          >
            {`$${v}k`}
          </Text>
        )
      )}

      {/* GRID LINES */}

      {[24, 48, 73, 97].map(
        (v, i) => {
          const y =
            (v / 100) *
            MAX_HEIGHT;

          return (
            <mesh
              key={i}
              position={[
                0,
                y,
                -2,
              ]}
              renderOrder={10}
            >
              <boxGeometry
                args={[
                  18,
                  0.04,
                  0.04,
                ]}
              />

              <meshBasicMaterial
                color="#cbd5e1"
                transparent
                opacity={0.45}
                depthTest={false}
                depthWrite={false}
              />
            </mesh>
          );
        }
      )}

      {/* CANDLES */}

      {visibleData.map(
        (d, i) => {
          const active =
            hoveredIndex === i;

       const baseX =
  i * 1.18 - 8.8;

          return (
            <group key={i}>
              {/* HOVER AREA */}

              <mesh
                position={[
                  baseX + 0.3,
                  4,
                  0,
                ]}
                onPointerOver={() =>
                  setHoveredIndex(i)
                }
                onPointerOut={() =>
                  setHoveredIndex(
                    null
                  )
                }
              >
                <boxGeometry
                  args={[
                    1.2,
                    10,
                    1.8,
                  ]}
                />

                <meshBasicMaterial
                  transparent
                  opacity={0}
                />
              </mesh>

              {/* RMD */}

              <Candle
                x={baseX}
                {
                  ...candleData[i]
                    .rmd
                }
                color="#7c3aed"
                active={active}
              />

              {/* TAX */}

              <Candle
                x={baseX + 0.3}
                {
                  ...candleData[i]
                    .tax
                }
                color="#ef4444"
                active={active}
              />

              {/* GROWTH */}

              <Candle
                x={baseX + 0.6}
                {
                  ...candleData[i]
                    .growth
                }
                color="#22c55e"
                active={active}
              />

              {/* LABEL */}

              <Text
                position={[
                  baseX + 0.3,
                  -0.7,
                  0,
                ]}
                fontSize={0.22}
                color="#ffffff"
                anchorX="center"
              >
                {d.label}
              </Text>
            </group>
          );
        }
      )}

      {/* TOOLTIP */}

      {hoveredIndex !==
        null && (
        <Html
         position={[0, 6.6, 0]}
          center
          style={{
            pointerEvents:
              "none",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background:
                "rgba(5,10,25,0.97)",

              backdropFilter:
                "blur(25px)",

              padding: "14px",

              borderRadius:
                "20px",

              boxShadow:
                "0 0 80px rgba(0,255,255,0.25)",

              color: "#f8fafc",

              width: "220px",

              border:
                "1px solid rgba(255,255,255,0.08)",

              fontFamily:
                "Inter, sans-serif",
            }}
          >
            {/* AGE */}

            <div
              style={{
                fontSize:
                  "14px",

                fontWeight:
                  "900",

                marginBottom:
                  "14px",

                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",

                paddingBottom:
                  "10px",

                color:
                  "#ffffff",
              }}
            >
              Age:{" "}
              {
                visibleData?.[
                  hoveredIndex
                ]?.label
              }
            </div>

            {[
              {
                label: "RMD",

                value: Number(
                  visibleData?.[
                    hoveredIndex
                  ]?.rmd || 0
                ),

                color:
                  "#7c3aed",
              },

              {
                label: "Tax",

                value: Number(
                  visibleData?.[
                    hoveredIndex
                  ]?.tax || 0
                ),

                color:
                  "#ef4444",
              },

              {
                label:
                  "Growth",

                value: Number(
                  visibleData?.[
                    hoveredIndex
                  ]?.growth || 0
                ),

                color:
                  "#22c55e",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  marginBottom:
                    "12px",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: 12,

                      height: 12,

                      borderRadius:
                        "50%",

                      background:
                        item.color,

                      boxShadow: `0 0 18px ${item.color}`,

                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      fontSize:
                        "14px",

                      color:
                        "#ffffff",

                      fontWeight:
                        "700",
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                <span
                  style={{
                    fontWeight:
                      "900",

                    fontSize:
                      "14px",

                    color:
                      "#ffffff",

                    marginLeft:
                      "20px",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {formatCurrency?.(
                    Number(
                      item.value ||
                        0
                    )
                  ) || "$0"}
                </span>
              </div>
            ))}
          </div>
        </Html>
      )}

      {/* CONTROLS */}

      
      <OrbitControls
  enablePan={false}
  enableZoom
  enableRotate
  target={[0, 2.8, 0]}
  minDistance={12}
  maxDistance={22}
  maxPolarAngle={
    Math.PI / 2.2
  }
  minPolarAngle={
    Math.PI / 3
  }
/>
    </Canvas>
  );
};

export default ThreeDCandleChart;