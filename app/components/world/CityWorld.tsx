"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import SceneBoundary from "./SceneBoundary";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Phones run the same scene at a fraction of the cost. The expensive part of a
// forward-rendered three.js scene is the *light count* — every light is evaluated
// in every lit fragment and lights are never frustum-culled, so an off-screen
// streetlamp still costs. Low power drops ~35 of the 39 lights, the shadow pass
// and MSAA, which is what keeps the car moving at the same rate as the page.
const LowPowerContext = createContext(false);
const useLowPower = () => useContext(LowPowerContext);

const ROAD_END = -156;
// Scenery runs well past the car's final stop so the drive fades into fog
// instead of ending at a visible edge.
const BUILDING_SLOTS = 30;
const CAR_X = 3.25;
// The camera trails the car by CAMERA_TRAIL and aims LOOK_AHEAD beyond itself.
const CAMERA_TRAIL = 11.5;
const LOOK_AHEAD = 19.5;

function seeded(index: number, salt = 0) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function Building({ index, slot, side }: { index: number; slot: number; side: -1 | 1 }) {
  const depth = 7 + seeded(index, 1) * 8;
  const width = 4 + seeded(index, 2) * 7;
  const height = 7 + seeded(index, 3) * 23;
  const z = 8 - slot * 8;
  const x = side * (8.5 + width / 2 + seeded(index, 4) * 5);
  const color = ["#12f1ff", "#ff3d76", "#a777ff", "#ff9b45"][Math.floor(seeded(index, 6) * 4)];
  const faceX = -side * (width / 2 + 0.065);
  const floors = Math.max(3, Math.floor(height / 2.4));
  const tower = index % 4 !== 1;
  const signKind = (slot + (side === 1 ? 3 : 0)) % 8;

  return (
    <group position={[x, height / 2 - 1.5, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={index % 3 === 0 ? "#101524" : "#090e18"} roughness={0.62} metalness={0.58} />
      </mesh>
      {/* A setback gives the towers a silhouette above the street wall. */}
      {tower && <mesh position={[side * width * 0.09, height / 2 + 1.3, -depth * 0.08]} castShadow>
        <boxGeometry args={[width * 0.69, 2.6, depth * 0.73]} />
        <meshStandardMaterial color="#121b2b" metalness={0.72} roughness={0.4} />
      </mesh>}
      <mesh position={[faceX, -height * 0.39, 0]}>
        <boxGeometry args={[0.22, height * 0.23, depth * 0.91]} />
        <meshStandardMaterial color="#151e2c" metalness={0.8} roughness={0.38} />
      </mesh>
      {/* Structural ribs and horizontal floor plates frame the lit windows. */}
      {[-0.43, 0.43].map((offset) => <mesh key={`rib-${offset}`} position={[faceX - side * 0.08, 0, offset * depth]}>
        <boxGeometry args={[0.23, height * 0.94, 0.16]} />
        <meshStandardMaterial color="#26364b" metalness={0.84} roughness={0.32} />
      </mesh>)}
      {Array.from({ length: floors }).map((_, floor) => (
        <mesh key={floor} position={[faceX - side * 0.08, -height / 2 + 2.3 + floor * 2.4, 0]}>
          <boxGeometry args={[0.14, floor % 3 === 0 ? 0.12 : 0.07, depth * 0.91]} />
          <meshBasicMaterial color={floor % 3 === 0 ? color : "#3b516d"} toneMapped={false} transparent opacity={floor % 3 === 0 ? 0.8 : 0.5} />
        </mesh>
      ))}
      <mesh position={[faceX - side * 0.1, 0, -depth * 0.44]}>
        <boxGeometry args={[0.12, height * 0.92, 0.12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.08]}>
        <boxGeometry args={[width * 0.93, height * 0.94, 0.12]} />
        <meshStandardMaterial color="#101929" metalness={0.72} roughness={0.45} />
      </mesh>
      {[-0.45, 0.45].map((offset) => <mesh key={`front-rib-${offset}`} position={[offset * width, 0, depth / 2 + 0.19]}>
        <boxGeometry args={[0.1, height * 0.95, 0.1]} />
        <meshStandardMaterial color="#2b3b52" metalness={0.8} roughness={0.3} />
      </mesh>)}
      <mesh position={[0, height / 2 - 0.12, depth / 2 + 0.2]}>
        <boxGeometry args={[width * 0.92, 0.11, 0.12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {index % 3 === 0 && index % 6 !== 0 && <group position={[faceX - side * 0.42, height * 0.12, depth * 0.12]}>
        <mesh><boxGeometry args={[0.22, 4.3, depth * 0.48]} /><meshStandardMaterial color="#101725" metalness={0.8} roughness={0.27} /></mesh>
        <mesh position={[-side * 0.13, 0, 0]}><boxGeometry args={[0.06, 3.95, depth * 0.43]} /><meshBasicMaterial color={color} transparent opacity={0.28} toneMapped={false} /></mesh>
        {[-1, 0, 1].map((line) => <mesh key={line} position={[-side * 0.18, line * 1.3, 0]}><boxGeometry args={[0.08, 0.08, depth * 0.39]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>)}
      </group>}
      {index % 6 === 0 && <group position={[faceX - side * 0.3, 6.9 - height / 2, 0]} rotation={[0, -side * Math.PI / 2, 0]}>
        <NeonPanel kind={signKind} color={color} width={depth * 0.55} height={2.1} />
      </group>}
      {side === -1 && height > 13 && index % 3 === 0 && <group position={[faceX - side * 1.05, 7.8 - height / 2, depth * 0.38]}>
        {[1.8, -1.8].map((y) => <mesh key={y} position={[side * 0.55, y, 0]}>
          <boxGeometry args={[1.13, 0.12, 0.2]} />
          <meshStandardMaterial color="#46556a" metalness={0.9} roughness={0.3} />
        </mesh>)}
        <NeonPanel kind={signKind} color={color} width={1.72} height={4.2} />
      </group>}
      {/* Crown, rooftop equipment and a slim beacon. */}
      <mesh position={[0, height / 2 + (tower ? 2.7 : 0.2), 0]}>
        <boxGeometry args={[width * (tower ? 0.75 : 1.02), 0.18, depth * (tower ? 0.79 : 1.02)]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.78} />
      </mesh>
      <mesh position={[-side * width * 0.2, height / 2 + (tower ? 3.15 : 0.7), -depth * 0.18]} castShadow>
        <boxGeometry args={[width * 0.22, 0.9, depth * 0.2]} />
        <meshStandardMaterial color="#253246" metalness={0.86} roughness={0.34} />
      </mesh>
      {index % 3 === 0 && <group position={[side * width * 0.2, height / 2 + (tower ? 4.2 : 1.7), 0]}>
        <mesh><cylinderGeometry args={[0.045, 0.08, 2.7, 6]} /><meshStandardMaterial color="#53647a" metalness={0.9} /></mesh>
        <mesh position={[0, 1.4, 0]}><sphereGeometry args={[0.13, 8, 8]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      </group>}
    </group>
  );
}

function StreetUnit({ index, side }: { index: number; side: -1 | 1 }) {
  const lowPower = useLowPower();
  const z = 4 - index * 9;
  const color = index % 2 ? "#12f1ff" : "#ff4b26";
  return (
    <group position={[side * 7.1, 0, z]}>
      <mesh position={[0, 2.9, 0]}><cylinderGeometry args={[0.055, 0.085, 5.8, 7]} /><meshStandardMaterial color="#252b38" metalness={0.9} /></mesh>
      <mesh position={[-side * 0.55, 5.55, 0]}><boxGeometry args={[1.1, 0.08, 0.08]} /><meshStandardMaterial color="#333b49" metalness={0.9} /></mesh>
      <mesh position={[-side * 1.05, 5.42, 0]}><boxGeometry args={[0.32, 0.16, 0.78]} /><meshBasicMaterial color="#e8ffff" toneMapped={false} /></mesh>
      <mesh position={[-side * 2.5, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[4.2, 28]} /><meshBasicMaterial color={color} transparent opacity={0.075} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      {!lowPower && index % 3 === 0 && <pointLight position={[-side * 2.25, 4.8, 0]} color={index % 2 ? "#baf8ff" : "#ffd4b3"} intensity={68} distance={16} decay={2} />}
      <mesh position={[0, 0.42, 0]}><boxGeometry args={[0.32, 0.84, 0.32]} /><meshStandardMaterial color="#161b25" metalness={0.75} /></mesh>
    </group>
  );
}

function DistantTower({ index, slot, side }: { index: number; slot: number; side: -1 | 1 }) {
  const height = 18 + seeded(index, 15) * 35;
  const width = 5 + seeded(index, 16) * 8;
  return <group position={[side * (22 + seeded(index, 17) * 18), height / 2 - 2, 5 - slot * 13]}>
    <mesh><boxGeometry args={[width, height, 8]} /><meshStandardMaterial color="#070b15" emissive={index % 3 === 0 ? "#081529" : "#10060d"} emissiveIntensity={0.5} roughness={1} /></mesh>
    <mesh position={[0, height / 2 + 0.1, 0]}><boxGeometry args={[width * 0.76, 0.14, 6.2]} /><meshBasicMaterial color={index % 2 ? "#254768" : "#67243f"} /></mesh>
    {Array.from({ length: 5 }).map((_, floor) => <mesh key={floor} position={[0, -height * 0.35 + floor * height * 0.17, 4.07]}><boxGeometry args={[width * 0.66, 0.1, 0.08]} /><meshBasicMaterial color={index % 2 ? "#174362" : "#5b263c"} /></mesh>)}
  </group>;
}

function WindowField() {
  const windows = useRef<THREE.InstancedMesh>(null);
  const frontWindows = useRef<THREE.InstancedMesh>(null);
  const instances = useMemo(() => {
    const sides: { position: [number, number, number]; color: THREE.Color }[] = [];
    const fronts: { position: [number, number, number]; color: THREE.Color }[] = [];
    for (const side of [-1, 1] as const) {
      for (let index = 0; index < BUILDING_SLOTS; index++) {
        const buildingIndex = side === -1 ? index : index + 43;
        const depth = 7 + seeded(buildingIndex, 1) * 8;
        const width = 4 + seeded(buildingIndex, 2) * 7;
        const height = 7 + seeded(buildingIndex, 3) * 23;
        const z = 8 - index * 8;
        const x = side * (8.5 + width / 2 + seeded(buildingIndex, 4) * 5) - side * (width / 2 + 0.09);
        const rows = Math.max(2, Math.floor(height / 2.1));
        const columns = Math.max(3, Math.floor(depth / 1.55));
        for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
          if (seeded(buildingIndex * 97 + row * 11 + column, 21) > 0.34) {
            const warm = seeded(buildingIndex + row, column + 22) > 0.82;
            sides.push({
              position: [x, 0.25 + row * 1.85, z - depth * 0.38 + column * (depth * 0.76 / Math.max(1, columns - 1))],
              color: new THREE.Color(warm ? "#ffb35c" : side === -1 ? "#ff315f" : "#39eaff"),
            });
          }
        }
        const frontColumns = Math.max(2, Math.floor(width / 1.65));
        for (let row = 0; row < rows; row++) for (let column = 0; column < frontColumns; column++) {
          if (seeded(buildingIndex * 71 + row * 13 + column, 32) > 0.38) {
            fronts.push({
              position: [side * (8.5 + width / 2 + seeded(buildingIndex, 4) * 5) - width * 0.36 + column * (width * 0.72 / Math.max(1, frontColumns - 1)), 0.25 + row * 1.85, z + depth / 2 + 0.19],
              color: new THREE.Color(seeded(buildingIndex + column, row + 47) > 0.85 ? "#ffcb80" : side === -1 ? "#ff477a" : "#4eeaff"),
            });
          }
        }
      }
    }
    return { sides, fronts };
  }, []);

  useLayoutEffect(() => {
    if (!windows.current || !frontWindows.current) return;
    const matrix = new THREE.Matrix4();
    for (const [mesh, field] of [[windows.current, instances.sides], [frontWindows.current, instances.fronts]] as const) {
      field.forEach((instance, index) => {
        matrix.makeTranslation(...instance.position);
        mesh.setMatrixAt(index, matrix);
        mesh.setColorAt(index, instance.color);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }, [instances]);

  return <>
    <instancedMesh ref={windows} args={[undefined, undefined, instances.sides.length]} frustumCulled>
      <boxGeometry args={[0.08, 0.48, 0.72]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.78} />
    </instancedMesh>
    <instancedMesh ref={frontWindows} args={[undefined, undefined, instances.fronts.length]} frustumCulled>
      <boxGeometry args={[0.72, 0.48, 0.08]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.78} />
    </instancedMesh>
  </>;
}

function Hologram({ position, color, tall = false }: { position: [number, number, number]; color: string; tall?: boolean }) {
  const lowPower = useLowPower();
  return <group position={position}>
    <mesh><boxGeometry args={[0.12, tall ? 6.5 : 3.6, tall ? 3.4 : 5]} /><meshBasicMaterial color={color} transparent opacity={0.11} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh>
    <mesh position={[-0.08, 0, 0]}><boxGeometry args={[0.06, tall ? 6.8 : 3.9, tall ? 3.7 : 5.3]} /><meshBasicMaterial color={color} wireframe transparent opacity={0.65} /></mesh>
    {[-0.34, 0, 0.34].map((offset) => <mesh key={offset} position={[-0.15, offset * (tall ? 7 : 4), 0]}><boxGeometry args={[0.04, 0.035, tall ? 3.2 : 4.8]} /><meshBasicMaterial color={color} /></mesh>)}
    {!lowPower && <pointLight color={color} intensity={2.5} distance={9} />}
  </group>;
}

function Skybridge({ z, color }: { z: number; color: string }) {
  return <group position={[0, 8.7, z]}>
    <mesh castShadow><boxGeometry args={[20, 1.8, 2.7]} /><meshStandardMaterial color="#0b1220" metalness={0.84} roughness={0.3} /></mesh>
    {[-1, 1].map((face) => <group key={face} position={[0, 0, face * 1.39]}>
      <mesh><boxGeometry args={[18.8, 1.1, 0.08]} /><meshBasicMaterial color={color} transparent opacity={0.12} /></mesh>
      {Array.from({ length: 10 }).map((_, index) => <mesh key={index} position={[-8.5 + index * 1.9, 0, face * 0.06]}><boxGeometry args={[0.11, 1.45, 0.1]} /><meshStandardMaterial color="#46556c" metalness={0.9} roughness={0.3} /></mesh>)}
      {[-0.95, 0.95].map((y) => <mesh key={y} position={[0, y, face * 0.06]}><boxGeometry args={[19.5, 0.11, 0.1]} /><meshBasicMaterial color={y < 0 ? color : "#526d83"} toneMapped={false} /></mesh>)}
    </group>)}
    <mesh position={[0, -1.04, 0]}><boxGeometry args={[13, 0.13, 1.6]} /><meshStandardMaterial color="#263447" metalness={0.9} roughness={0.34} /></mesh>
    {[-6, -2, 2, 6].map((x) => <mesh key={x} position={[x, -1.13, 0]}><boxGeometry args={[0.12, 0.05, 1.3]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>)}
    {[-9.4, 9.4].map((x) => <mesh key={`joint-${x}`} position={[x, 1.12, 0]}><boxGeometry args={[0.4, 0.48, 2.9]} /><meshStandardMaterial color="#344459" metalness={0.9} /></mesh>)}
  </group>;
}

function SignFace({ title, caption, color, width, height }: { title: string; caption: string; color: string; width: number; height: number }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 160;
    const context = canvas.getContext("2d");
    const signMaterial = material.current;
    if (!context || !signMaterial) return;

    context.fillStyle = "#07101c";
    context.fillRect(0, 0, 512, 160);
    context.fillStyle = color;
    context.fillRect(0, 0, 512, 7);
    context.fillRect(18, 21, 5, 118);
    context.strokeStyle = color;
    context.globalAlpha = 0.65;
    context.strokeRect(2, 2, 508, 156);
    context.globalAlpha = 1;

    let titleSize = 67;
    context.font = `800 ${titleSize}px Arial, sans-serif`;
    while (context.measureText(title).width > 447 && titleSize > 30) {
      titleSize -= 2;
      context.font = `800 ${titleSize}px Arial, sans-serif`;
    }
    context.fillStyle = "#f2f9ff";
    context.fillText(title, 38, 86);
    context.font = "700 24px Arial, sans-serif";
    context.fillStyle = color;
    context.fillText(caption, 40, 129);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    signMaterial.map = texture;
    signMaterial.color.set("#ffffff");
    signMaterial.needsUpdate = true;
    return () => {
      signMaterial.map = null;
      signMaterial.color.set("#07101c");
      signMaterial.needsUpdate = true;
      texture.dispose();
    };
  }, [title, caption, color]);

  return <mesh>
    <planeGeometry args={[width, height]} />
    <meshBasicMaterial ref={material} color="#07101c" toneMapped={false} side={THREE.DoubleSide} />
  </mesh>;
}

function NeonGlyph({ kind, color }: { kind: number; color: string }) {
  const bar = (key: string, x: number, y: number, width: number, height: number, rotation = 0) =>
    <mesh key={key} position={[x, y, 0]} rotation={[0, 0, rotation]}><boxGeometry args={[width, height, 0.035]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>;
  const ring = (key: string, x: number, y: number, radius: number) =>
    <mesh key={key} position={[x, y, 0]}><ringGeometry args={[radius - 0.035, radius + 0.035, 24]} /><meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} /></mesh>;

  return <group>
    {kind === 0 && <>{/* bowl and chopsticks */}
      <mesh rotation={[0, 0, Math.PI]}><torusGeometry args={[0.3, 0.04, 8, 24, Math.PI]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      {bar("rim", 0, 0, 0.7, 0.07)}{bar("stick-1", 0.08, 0.25, 0.62, 0.045, 0.42)}{bar("stick-2", -0.1, 0.26, 0.62, 0.045, 0.42)}
    </>}
    {kind === 1 && <>{/* cup */}
      {bar("cup-left", -0.22, 0, 0.05, 0.48)}{bar("cup-right", 0.22, 0, 0.05, 0.48)}
      {bar("cup-bottom", 0, -0.25, 0.51, 0.06)}{bar("cup-rim", 0, 0.25, 0.58, 0.06)}
      {ring("handle", 0.34, 0.02, 0.16)}
    </>}
    {kind === 2 && <>{/* medical cross */}
      {bar("vertical", 0, 0, 0.19, 0.76)}{bar("horizontal", 0, 0, 0.76, 0.19)}
    </>}
    {kind === 3 && <>{/* arcade controller */}
      {bar("body", 0, 0, 0.86, 0.42)}{bar("pad-v", -0.23, 0, 0.065, 0.28)}{bar("pad-h", -0.23, 0, 0.28, 0.065)}
      {ring("button-1", 0.2, 0.07, 0.065)}{ring("button-2", 0.31, -0.08, 0.065)}
    </>}
    {kind === 4 && <>{/* shopping bag */}
      {bar("left", -0.31, -0.08, 0.06, 0.55)}{bar("right", 0.31, -0.08, 0.06, 0.55)}
      {bar("bottom", 0, -0.35, 0.68, 0.06)}{bar("top", 0, 0.2, 0.68, 0.06)}
      <mesh position={[0, 0.2, 0]}><torusGeometry args={[0.17, 0.035, 8, 24, Math.PI]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    </>}
    {kind === 5 && <>{/* paired music notes */}
      {bar("stem-1", 0.02, 0.09, 0.055, 0.65)}{bar("stem-2", 0.39, 0.17, 0.055, 0.65)}
      {bar("beam", 0.2, 0.48, 0.43, 0.09, 0.16)}{ring("note-1", -0.12, -0.32, 0.14)}{ring("note-2", 0.26, -0.25, 0.14)}
    </>}
    {kind === 6 && <>{/* open book */}
      {[-1, 1].map((side) => <group key={side} position={[side * 0.2, 0, 0]}>
        {bar("outer", side * 0.17, 0, 0.055, 0.58)}{bar("top", 0, 0.3, 0.4, 0.055)}{bar("bottom", 0, -0.3, 0.4, 0.055)}
      </group>)}
      {bar("spine", 0, 0, 0.06, 0.65)}
    </>}
    {kind === 7 && <>{/* repair gear */}
      {ring("gear", 0, 0, 0.29)}{ring("hub", 0, 0, 0.09)}
      {[0, 1, 2, 3].map((tooth) => <group key={tooth} rotation={[0, 0, tooth * Math.PI / 2]}>{bar("tooth", 0, 0.37, 0.12, 0.16)}</group>)}
    </>}
  </group>;
}

function NeonPanel({ kind, color, width, height }: { kind: number; color: string; width: number; height: number }) {
  const wide = width > height * 1.5;
  return <group>
    <mesh><boxGeometry args={[width, height, 0.2]} /><meshStandardMaterial color="#0b1422" metalness={0.78} roughness={0.28} /></mesh>
    <mesh position={[0, 0, 0.105]}><planeGeometry args={[width * 0.93, height * 0.86]} /><meshBasicMaterial color={color} transparent opacity={0.14} side={THREE.DoubleSide} /></mesh>
    {[-1, 1].map((side) => <group key={side}>
      <mesh position={[side * (width / 2 - 0.045), 0, 0.13]}><boxGeometry args={[0.07, height, 0.065]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <mesh position={[0, side * (height / 2 - 0.045), 0.13]}><boxGeometry args={[width, 0.07, 0.065]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
    </group>)}
    <group position={[0, 0, 0.17]} scale={Math.min(height * 0.84, 1.5)}><NeonGlyph kind={kind} color={color} /></group>
    {wide ? [-1, 1].map((side) => <mesh key={side} position={[side * width * 0.31, 0, 0.17]}><boxGeometry args={[width * 0.17, 0.06, 0.04]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>) : [-1, 1].map((side) => <group key={side} position={[0, side * height * 0.32, 0.17]}>
      {[-0.27, 0, 0.27].map((x) => <mesh key={x} position={[x, 0, 0]}><boxGeometry args={[0.17, 0.055, 0.04]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>)}
    </group>)}
  </group>;
}

const GANTRY_LABELS = [
  ["EDUCATION", "EXPERIENCE"],
  ["RESEARCH", "PROJECTS"],
  ["CONNECTIONS", "CITY LOOP"],
  ["CITY CENTER", "ALL DISTRICTS"],
  ["OUTER RING", "NORTH GATE"],
  ["OPEN ROAD", "NO EXITS"],
];

function OverheadGantry({ z, index }: { z: number; index: number }) {
  const color = ["#12f1ff", "#ff3d76", "#a777ff", "#ff9b45", "#12f1ff", "#8c5cff"][index % 6];
  return <group position={[0, 0, z]}>
    {[-1, 1].map((side) => <group key={side} position={[side * 7.7, 0, 0]}>
      <mesh position={[0, 5.15, 0]}><boxGeometry args={[0.3, 10.3, 0.35]} /><meshStandardMaterial color="#283548" metalness={0.9} roughness={0.32} /></mesh>
      <mesh position={[0, 9.55, 0.24]}><boxGeometry args={[0.38, 1.7, 0.08]} /><meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.66} /></mesh>
      <mesh position={[0, 10.5, 0]}><boxGeometry args={[0.72, 0.3, 0.7]} /><meshStandardMaterial color="#3b4a5f" metalness={0.9} /></mesh>
    </group>)}
    {[9.3, 10.5].map((y) => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[15.5, 0.16, 0.28]} /><meshStandardMaterial color="#344257" metalness={0.87} roughness={0.35} /></mesh>)}
    {[-6, -3, 0, 3, 6].map((x) => <mesh key={x} position={[x, 9.9, 0]}><boxGeometry args={[0.1, 1.1, 0.16]} /><meshStandardMaterial color="#41516a" metalness={0.85} /></mesh>)}
    {[-3.6, 3.6].map((x, panel) => <group key={x} position={[x, 8.12, 0.27]}>
      <mesh><boxGeometry args={[6.35, 1.8, 0.24]} /><meshStandardMaterial color="#071321" emissive="#071321" emissiveIntensity={0.7} metalness={0.76} roughness={0.25} /></mesh>
      <mesh position={[0, 0.88, 0.15]}><boxGeometry args={[6.15, 0.06, 0.05]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <mesh position={[0, -0.88, 0.15]}><boxGeometry args={[6.15, 0.06, 0.05]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <group position={[0, 0, 0.17]}><SignFace title={GANTRY_LABELS[index % GANTRY_LABELS.length][panel]} caption="STRAIGHT AHEAD" color={color} width={6.1} height={1.56} /></group>
    </group>)}
    <mesh position={[0, 6.85, 0.1]}><boxGeometry args={[11.8, 0.08, 0.24]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
  </group>;
}

function OverheadCable({ from, to, side }: { from: number; to: number; side: -1 | 1 }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 7.7, 10.45, from),
    new THREE.Vector3(side * 7.7, 9.7, from + (to - from) * 0.25),
    new THREE.Vector3(side * 7.7, 9.45, (from + to) / 2),
    new THREE.Vector3(side * 7.7, 9.7, from + (to - from) * 0.75),
    new THREE.Vector3(side * 7.7, 10.45, to),
  ]), [from, to, side]);
  return <group>
    <mesh><tubeGeometry args={[curve, 24, 0.035, 4, false]} /><meshStandardMaterial color="#677a90" metalness={0.9} roughness={0.35} /></mesh>
    {[0.25, 0.5, 0.75].map((point) => <mesh key={point} position={curve.getPoint(point).toArray()}><sphereGeometry args={[0.095, 6, 6]} /><meshBasicMaterial color={side === -1 ? "#ff477a" : "#12f1ff"} toneMapped={false} /></mesh>)}
  </group>;
}

function Intersection({ z, color }: { z: number; color: string }) {
  return <group position={[0, 0.035, z]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[62, 10]} /><meshStandardMaterial color="#0b0d13" roughness={0.28} metalness={0.62} /></mesh>
    {Array.from({ length: 8 }).map((_, index) => <mesh key={index} position={[-5.1 + index * 1.45, 0.025, 3.55]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.72, 2.1]} /><meshBasicMaterial color="#dffeff" transparent opacity={0.7} /></mesh>)}
    {[-1, 1].map((side) => <mesh key={side} position={[side * 5.75, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.72, 0.78, 28]} /><meshBasicMaterial color={color} side={THREE.DoubleSide} /></mesh>)}
    {[-1, 1].map((side) => <mesh key={`cross-${side}`} position={[side * 18, 0.03, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}><planeGeometry args={[0.1, 23]} /><meshBasicMaterial color={color} transparent opacity={0.42} /></mesh>)}
  </group>;
}

function Storefronts() {
  return <group>{Array.from({ length: 41 }).map((_, index) => {
    const side: -1 | 1 = index % 2 ? -1 : 1;
    const color = index % 3 === 0 ? "#ff315f" : index % 3 === 1 ? "#12f1ff" : "#8c5cff";
    const kind = index % 8;
    return <group key={index} position={[side * 8.4, 1.25, 2 - index * 5.8]}>
      <mesh><boxGeometry args={[1.35, 2.5, 4.1]} /><meshStandardMaterial color="#0a0d14" metalness={0.7} roughness={0.35} /></mesh>
      <mesh position={[-side * 0.69, 0.02, 0]} rotation={[0, -side * Math.PI / 2, 0]}><planeGeometry args={[3.25, 1.35]} /><meshBasicMaterial color={color} transparent opacity={0.17} side={THREE.DoubleSide} /></mesh>
      <group position={[-side * 0.86, 1.05, 0]} rotation={[0, -side * Math.PI / 2, 0]}>
        <NeonPanel kind={kind} color={color} width={3.6} height={0.82} />
      </group>
      {[-1.67, 1.67].map((edge) => <mesh key={edge} position={[-side * 0.76, -0.3, edge]}><boxGeometry args={[0.07, 1.55, 0.07]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>)}
      <mesh position={[-side * 0.78, -1.06, 0]}><boxGeometry args={[0.08, 0.07, 3.55]} /><meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.72} /></mesh>
    </group>;
  })}</group>;
}

function Traffic() {
  const lowPower = useLowPower();
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((vehicle, index) => {
      const travelled = clock.elapsedTime * (7 + index % 3) + index * 27;
      vehicle.position.z = ((travelled % 250) + 250) % 250 - 240;
    });
  });
  return <group ref={group}>{Array.from({ length: lowPower ? 4 : 8 }).map((_, index) => {
    const trafficLanes = [-4.35, -1.65];
    const x = trafficLanes[index % trafficLanes.length];
    const accent = index % 3 === 0 ? "#ff315f" : index % 3 === 1 ? "#12f1ff" : "#8c5cff";
    const body = index % 4 === 0 ? "#521528" : index % 4 === 1 ? "#15283b" : index % 4 === 2 ? "#292632" : "#18201f";
    return <group key={index} position={[x, 0.62, -index * 22]} scale={0.86 + (index % 3) * 0.06}>
      <mesh position={[0, -0.12, 0]} castShadow><boxGeometry args={[1.75, 0.34, 3.65]} /><meshStandardMaterial color={body} metalness={0.92} roughness={0.2} /></mesh>
      <mesh position={[0, 0.1, 0.45]} rotation={[0.035, 0, 0]} castShadow><boxGeometry args={[1.58, 0.38, 2.9]} /><meshStandardMaterial color={body} metalness={0.9} roughness={0.17} /></mesh>
      <mesh position={[0, 0.48, -0.35]} rotation={[-0.06, 0, 0]}><boxGeometry args={[1.32, 0.54, 1.45]} /><meshPhysicalMaterial color="#07121b" metalness={0.7} roughness={0.06} clearcoat={1} /></mesh>
      <mesh position={[0, 0.23, 1.79]} rotation={[-0.15, 0, 0]}><boxGeometry args={[1.52, 0.2, 0.48]} /><meshStandardMaterial color={body} metalness={0.95} roughness={0.14} /></mesh>
      <mesh position={[0, 0.08, 1.99]}><boxGeometry args={[1.2, 0.09, 0.05]} /><meshBasicMaterial color="#e8ffff" /></mesh>
      <mesh position={[0, 0.06, -1.86]}><boxGeometry args={[1.25, 0.08, 0.05]} /><meshBasicMaterial color="#ff174f" /></mesh>
      {[-0.73, 0.73].flatMap((wheelX) => [-1.12, 1.12].map((wheelZ) => <group key={`${wheelX}-${wheelZ}`} position={[wheelX, -0.2, wheelZ]} rotation={[0, Math.PI / 2, 0]}>
        <mesh><torusGeometry args={[0.29, 0.105, 8, 16]} /><meshStandardMaterial color="#020304" roughness={0.82} /></mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.16, 0.16, 0.07, 10]} /><meshStandardMaterial color="#85909e" metalness={1} roughness={0.2} /></mesh>
      </group>))}
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.7, 3.7]} /><meshBasicMaterial color={accent} transparent opacity={0.16} blending={THREE.AdditiveBlending} /></mesh>
      {!lowPower && <pointLight position={[0, 0, 2.05]} color="#d9ffff" intensity={2.2} distance={7} />}
    </group>;
  })}</group>;
}

function City() {
  return (
    <group>
      {Array.from({ length: 19 }).flatMap((_, index) => [<DistantTower key={`dl-${index}`} index={index} slot={index} side={-1} />, <DistantTower key={`dr-${index}`} index={index + 31} slot={index} side={1} />])}
      {Array.from({ length: BUILDING_SLOTS }).flatMap((_, index) => [
        <Building key={`l-${index}`} index={index} slot={index} side={-1} />,
        <Building key={`r-${index}`} index={index + 43} slot={index} side={1} />,
      ])}
      <WindowField />
      <Storefronts />
      <Traffic />
      <Hologram position={[-9.2, 7.5, -20]} color="#12f1ff" tall />
      <Hologram position={[9.4, 6, -55]} color="#ff315f" />
      <Hologram position={[-9.4, 7, -91]} color="#8c5cff" tall />
      <Hologram position={[9.2, 5.5, -128]} color="#12f1ff" />
      <Hologram position={[-9.3, 6.8, -171]} color="#ff315f" tall />
      <Hologram position={[9.3, 6.2, -208]} color="#8c5cff" />
      <Skybridge z={-34} color="#12f1ff" />
      <Skybridge z={-83} color="#a777ff" />
      <Skybridge z={-136} color="#ff3d76" />
      <Skybridge z={-189} color="#12f1ff" />
      {[-12, -58, -109, -153, -198, -234].map((z, index) => <OverheadGantry key={z} z={z} index={index} />)}
      {[-1, 1].flatMap((side) => [[-12, -58], [-58, -109], [-109, -153], [-153, -198], [-198, -234]].map(([from, to]) => <OverheadCable key={`${side}-${from}`} from={from} to={to} side={side as -1 | 1} />))}
      <Intersection z={-17} color="#12f1ff" />
      <Intersection z={-67} color="#ff315f" />
      <Intersection z={-121} color="#8c5cff" />
      <Intersection z={-176} color="#12f1ff" />
      <Intersection z={-225} color="#ff315f" />
      <mesh position={[0, -0.22, -112.5]} receiveShadow>
        <boxGeometry args={[13, 0.4, 247]} />
        <meshPhysicalMaterial color="#07080d" roughness={0.2} metalness={0.72} clearcoat={0.85} clearcoatRoughness={0.22} />
      </mesh>
      {[-1, 1].map((side) => <group key={`walk-${side}`}>
        <mesh position={[side * 7.25, 0.05, -112.5]} receiveShadow><boxGeometry args={[1.5, 0.3, 247]} /><meshStandardMaterial color="#11141b" roughness={0.6} metalness={0.35} /></mesh>
        <mesh position={[side * 6.48, 0.2, -112.5]}><boxGeometry args={[0.09, 0.12, 247]} /><meshBasicMaterial color={side === -1 ? "#ff4b26" : "#12f1ff"} transparent opacity={0.72} /></mesh>
      </group>)}
      {Array.from({ length: 27 }).flatMap((_, index) => [<StreetUnit key={`sl-${index}`} index={index} side={-1} />, <StreetUnit key={`sr-${index}`} index={index} side={1} />])}
      <mesh position={[0, 0.012, -112.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 241]} />
        <meshBasicMaterial color="#12f1ff" transparent opacity={0.28} />
      </mesh>
      {Array.from({ length: 50 }).map((_, index) => (
        <group key={index} position={[0, 0.03, 7 - index * 4.8]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 2.35]} />
            <meshBasicMaterial color="#b9fff9" />
          </mesh>
          <mesh position={[-6.15, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 4]} />
            <meshBasicMaterial color="#ff4b26" transparent opacity={0.65} />
          </mesh>
          <mesh position={[6.15, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 4]} />
            <meshBasicMaterial color="#12f1ff" transparent opacity={0.65} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 19 }).map((_, index) => <group key={`barrier-${index}`} position={[index % 2 ? -7.8 : 7.8, 0.48, 1 - index * 13]}>
        <mesh><boxGeometry args={[0.6, 0.75, 3.8]} /><meshStandardMaterial color="#171c26" metalness={0.7} roughness={0.4} /></mesh>
        <mesh position={[index % 2 ? 0.31 : -0.31, 0, 0]}><boxGeometry args={[0.03, 0.16, 3.1]} /><meshBasicMaterial color={index % 2 ? "#ff4b26" : "#12f1ff"} /></mesh>
      </group>)}
    </group>
  );
}

function Car({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const lowPower = useLowPower();
  const car = useRef<THREE.Group>(null);
  const rearGlow = useRef<THREE.PointLight>(null);
  // Spotlights need an Object3D to aim at; one per lamp, parented to the car.
  const beamTargets = useMemo(() => [new THREE.Object3D(), new THREE.Object3D()], []);

  useFrame((state, delta) => {
    if (!car.current) return;
    const targetZ = 3 + ROAD_END * progressRef.current;
    car.current.position.z = THREE.MathUtils.damp(car.current.position.z, targetZ, 4.2, delta);
    car.current.position.y = 0.72;
    car.current.rotation.y = 0;
    if (rearGlow.current) rearGlow.current.intensity = 3.5 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
  });

  return (
    <group ref={car} position={[CAR_X, 0.72, 3]} scale={1.08}>
      {/* sills, main body, fastback greenhouse */}
      <mesh position={[0, -0.18, 0]} castShadow>
        <boxGeometry args={[1.9, 0.28, 4.45]} />
        <meshPhysicalMaterial color="#05070a" metalness={0.5} roughness={0.3} clearcoat={1} clearcoatRoughness={0.22} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-0.045, 0, 0]} castShadow>
        <boxGeometry args={[2.1, 0.42, 4.4]} />
        <meshPhysicalMaterial color="#0b0d12" metalness={0.48} roughness={0.27} clearcoat={1} clearcoatRoughness={0.18} />
      </mesh>
      <mesh position={[0, 0.5, -0.52]} rotation={[-0.62, 0, 0]} castShadow>
        <boxGeometry args={[1.68, 0.16, 0.86]} />
        <meshStandardMaterial color="#07131a" metalness={0.3} roughness={0.12} emissive="#031219" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0.28]} rotation={[0.05, 0, 0]} castShadow>
        <boxGeometry args={[1.72, 0.68, 1.5]} />
        <meshStandardMaterial color="#07131a" metalness={0.28} roughness={0.12} emissive="#031219" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0.5, 1.42]} rotation={[0.72, 0, 0]} castShadow>
        <boxGeometry args={[1.7, 0.16, 1.1]} />
        <meshStandardMaterial color="#07131a" metalness={0.3} roughness={0.12} emissive="#031219" emissiveIntensity={0.5} />
      </mesh>
      {/* third brake light along the top edge of the rear glass */}
      <mesh position={[0, 0.915, 1.03]}><boxGeometry args={[1.22, 0.035, 0.05]} /><meshBasicMaterial color="#ff2038" toneMapped={false} /></mesh>

      {/* nose: splitter, three intakes, round quad-LED lamps */}
      <mesh position={[0, 0.16, -2.18]} rotation={[0.19, 0, 0]}><boxGeometry args={[2.05, 0.23, 0.68]} /><meshPhysicalMaterial color="#0b0e13" metalness={0.45} roughness={0.28} clearcoat={1} /></mesh>
      <mesh position={[0, -0.33, -2.3]}><boxGeometry args={[2.15, 0.06, 0.55]} /><meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.45} /></mesh>
      <mesh position={[0, -0.26, -2.56]}><boxGeometry args={[1.7, 0.07, 0.12]} /><meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.45} /></mesh>
      <mesh position={[0, -0.12, -2.52]}><boxGeometry args={[0.95, 0.24, 0.08]} /><meshStandardMaterial color="#04060a" metalness={0.4} roughness={0.6} /></mesh>
      {[-0.78, 0.78].map((x) => <mesh key={`intake-${x}`} position={[x, -0.12, -2.5]}><boxGeometry args={[0.42, 0.22, 0.08]} /><meshStandardMaterial color="#04060a" metalness={0.4} roughness={0.6} /></mesh>)}
      {[-1, 1].map((side) => <group key={`lamp-${side}`} position={[side * 0.72, 0.16, -2.48]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.21, 0.16, 20]} /><meshStandardMaterial color="#080a0e" metalness={0.6} roughness={0.35} /></mesh>
        <mesh position={[0, 0, -0.085]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.165, 0.165, 0.012, 20]} /><meshStandardMaterial color="#1a2630" metalness={0.5} roughness={0.15} /></mesh>
        {[-0.087, -0.029, 0.029, 0.087].map((y) => <mesh key={y} position={[0, y, -0.094]}><boxGeometry args={[0.07, 0.026, 0.01]} /><meshBasicMaterial color="#e8f7ff" toneMapped={false} /></mesh>)}
      </group>)}

      {/* fender louvres, mirrors, carbon sills */}
      {[-1, 1].map((side) => <group key={`side-${side}`}>
        {[0, 1, 2].map((slot) => <mesh key={slot} position={[side * 0.74, 0.28, -1.78 + slot * 0.17]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.32, 0.015, 0.1]} /><meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.45} />
        </mesh>)}
        <mesh position={[side * 0.99, 0.36, -0.8]} rotation={[0, side * 0.16, 0]}><boxGeometry args={[0.2, 0.09, 0.26]} /><meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.45} /></mesh>
        <mesh position={[side * 1.08, 0.36, -0.74]} rotation={[0, side * 0.16, 0]}><boxGeometry args={[0.015, 0.07, 0.2]} /><meshStandardMaterial color="#1b2b36" metalness={0.9} roughness={0.12} /></mesh>
        <mesh position={[side * 1.0, -0.22, 0.1]}><boxGeometry args={[0.12, 0.12, 2.9]} /><meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.45} /></mesh>
        <mesh position={[side * 1.06, 0.1, 1.15]}><boxGeometry args={[0.06, 0.28, 0.72]} /><meshStandardMaterial color="#04060a" metalness={0.4} roughness={0.6} /></mesh>
      </group>)}

      {/* engine deck louvres */}
      {Array.from({ length: 4 }).map((_, index) => <mesh key={`deck-${index}`} position={[0, 0.348, 1.62 + index * 0.1]} rotation={[-0.045, 0, 0]}>
        <boxGeometry args={[1.3, 0.016, 0.06]} /><meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.45} />
      </mesh>)}
      {/* tail: full-width light bar, vent, diffuser, centre pipes */}
      <mesh position={[0, 0.12, 2.27]}><boxGeometry args={[1.94, 0.13, 0.05]} /><meshStandardMaterial color="#080a0e" metalness={0.55} roughness={0.35} /></mesh>
      <mesh position={[0, 0.12, 2.3]}><boxGeometry args={[1.85, 0.055, 0.03]} /><meshBasicMaterial color="#ff174f" toneMapped={false} /></mesh>
      <mesh position={[0, -0.1, 2.29]}><boxGeometry args={[1.2, 0.16, 0.03]} /><meshStandardMaterial color="#04060a" metalness={0.4} roughness={0.6} /></mesh>
      <group position={[0, -0.3, 2.06]}>
        <mesh><boxGeometry args={[1.8, 0.12, 0.45]} /><meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.45} /></mesh>
        {[-0.66, -0.33, 0, 0.33, 0.66].map((x) => <mesh key={`fin-${x}`} position={[x, 0.09, 0]}><boxGeometry args={[0.05, 0.18, 0.45]} /><meshStandardMaterial color="#14171d" metalness={0.5} roughness={0.45} /></mesh>)}
      </group>
      {[-0.16, 0.16].map((x) => <mesh key={`pipe-${x}`} position={[x, -0.2, 2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.14, 14]} /><meshStandardMaterial color="#1c222a" metalness={0.95} roughness={0.22} />
      </mesh>)}

      {/* centre-lock wheels with yellow ceramic calipers */}
      {[-0.93, 0.93].map((x) => [-1.35, 1.38].map((z) => <group key={`${x}-${z}`} position={[x, -0.1, z]} rotation={[0, Math.PI / 2, 0]}>
        <group>
          <mesh><torusGeometry args={[0.38, 0.14, 10, 20]} /><meshStandardMaterial color="#030405" roughness={0.7} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.26, 0.26, 0.1, 14]} /><meshStandardMaterial color="#0c1016" metalness={0.85} roughness={0.32} /></mesh>
          {Array.from({ length: 5 }).map((_, spoke) => <mesh key={spoke} position={[0.06, 0, 0]} rotation={[(spoke * Math.PI * 2) / 5, 0, 0]}>
            <boxGeometry args={[0.02, 0.07, 0.48]} /><meshStandardMaterial color="#161d26" metalness={0.9} roughness={0.28} />
          </mesh>)}
          <mesh position={[0.075, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.075, 0.075, 0.03, 6]} /><meshBasicMaterial color="#f2c14b" toneMapped={false} /></mesh>
        </group>
        <mesh position={[0.05, 0.2, 0.02]}><boxGeometry args={[0.06, 0.22, 0.1]} /><meshBasicMaterial color="#f2c14b" toneMapped={false} /></mesh>
      </group>))}

      {[-0.98, 0.98].map((x) => <mesh key={x} position={[x, -0.3, 0.1]}><boxGeometry args={[0.04, 0.03, 2.7]} /><meshBasicMaterial color="#12f1ff" toneMapped={false} /></mesh>)}
      <mesh position={[0, -0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.1, 4.6]} /><meshBasicMaterial color="#12f1ff" transparent opacity={0.28} blending={THREE.AdditiveBlending} /></mesh>
      {/* headlights: lens glow, a visible cone in the air and a pool on the road */}
      {[-1, 1].map((side, index) => <group key={`beam-${side}`}>
        <mesh position={[side * 0.72, 0.16, -2.585]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.2, 20]} />
          <meshBasicMaterial color="#e9fbff" transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position={[side * 0.8, 0.04, -5.8]} rotation={[Math.PI / 2 - 0.055, 0, 0]}>
          <coneGeometry args={[0.95, 6.4, 22, 1, true]} />
          <meshBasicMaterial color="#cdeeff" transparent opacity={0.016} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[side * 0.88, -0.665, -6.2]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 2.4, 1]}>
          <circleGeometry args={[1.1, 26]} />
          <meshBasicMaterial color="#bfe9ff" transparent opacity={0.085} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <primitive object={beamTargets[index]} position={[side * 1.5, -0.68, -17]} />
        <spotLight position={[side * 0.72, 0.16, -2.5]} target={beamTargets[index]} color="#e6f9ff" angle={0.38} penumbra={0.8} intensity={42} distance={24} decay={1.8} />
      </group>)}
      <pointLight position={[0, 0.15, -2.7]} color="#dffcff" intensity={7} distance={14} />
      {!lowPower && <>
        <pointLight position={[0, -0.25, 0]} color="#12f1ff" intensity={4} distance={6} />
        <pointLight position={[0, 3.2, 1]} color="#d5e7ff" intensity={12} distance={9} decay={2} />
        <pointLight position={[0, 1.1, 3.2]} color="#ff6480" intensity={18} distance={7} decay={2} />
      </>}
      <pointLight ref={rearGlow} position={[0, 0.05, 2.5]} color="#ff244d" intensity={5} distance={9} />
    </group>
  );
}

/**
 * Samples scroll position inside the render loop instead of from scroll events.
 *
 * On iOS the momentum phase of a scroll is run by the compositor, and `scroll`
 * events are dispatched to JS coalesced and irregularly — bursts, then gaps —
 * with no alignment to the frame clock. Feeding those bursts into the car's
 * damp() turned a constant-velocity scroll into surge/stall: the target leapt
 * when a burst landed, the car chased it, then the target went stale and the
 * car coasted. The DOM cards never showed it because the compositor moves them
 * directly, which is exactly why the two looked out of step.
 *
 * Reading window.scrollY once per frame instead gives the same value the
 * compositor is scrolling the cards to, at the same cadence we draw. This is
 * what ScrollTrigger and Lenis both do, and for the same reason.
 */
function ScrollProgress({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const maxRef = useRef(1);

  useEffect(() => {
    // scrollHeight is a layout read, so it stays out of the frame loop and is
    // refreshed only when something can actually have changed the page height.
    const measure = () => {
      maxRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [progressRef]);

  useFrame(() => {
    progressRef.current = Math.min(1, Math.max(0, window.scrollY / maxRef.current));
  });

  return null;
}

function CameraRig({ progressRef, compact }: { progressRef: React.MutableRefObject<number>; compact: boolean }) {
  const current = useRef(new THREE.Vector3(6.2, 4.2, 12));
  useFrame(({ camera }, delta) => {
    const carZ = 3 + ROAD_END * progressRef.current;
    const cinematic = Math.sin(progressRef.current * Math.PI * 8) * 0.7;
    current.current.set(6.2 + cinematic, 4.2, carZ + CAMERA_TRAIL);
    camera.position.lerp(current.current, 1 - Math.exp(-delta * 3.2));
    // Wide layouts frame the car off to one side so the copy sits clear of it;
    // narrow ones have no side column, so yaw the aim until the car is centred.
    const lookX = compact
      ? camera.position.x + (CAR_X - camera.position.x) / (CAMERA_TRAIL / LOOK_AHEAD)
      : -4.1;
    camera.lookAt(lookX, 0.7, carZ - (LOOK_AHEAD - CAMERA_TRAIL));
  });
  return null;
}

function Scene({ progressRef, compact, lowPower }: { progressRef: React.MutableRefObject<number>; compact: boolean; lowPower: boolean }) {
  // The provider lives inside <Canvas> on purpose: react-three-fiber renders its
  // own reconciler tree, so context from outside the canvas does not reach it.
  return (
    <LowPowerContext.Provider value={lowPower}>
      <color attach="background" args={["#03040a"]} />
      <fog attach="fog" args={["#03040a", 17, 72]} />
      {/* Ambient comes up to cover for the ~35 punctual lights low power drops. */}
      <ambientLight intensity={lowPower ? 0.56 : 0.38} color="#53618e" />
      <directionalLight position={[4, 12, 8]} color="#9bb3ff" intensity={1.1} castShadow={!lowPower} />
      <ScrollProgress progressRef={progressRef} />
      <City />
      <Car progressRef={progressRef} />
      <CameraRig progressRef={progressRef} compact={compact} />
      <Sparkles count={lowPower ? 70 : 300} scale={[28, 18, 250]} position={[0, 8, -110]} size={1.2} speed={0.35} color="#8ffcff" opacity={0.5} />
    </LowPowerContext.Provider>
  );
}

export default function CityWorld() {
  const progressRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  // null until the media queries have been read. dpr, antialias and shadows are
  // all WebGL-context creation options, so mounting <Canvas> before we know the
  // tier would force a full context teardown and rebuild a tick later.
  const [quality, setQuality] = useState<"low" | "high" | null>(null);
  const lowPower = quality === "low";

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const update = () => setQuality(query.matches ? "low" : "high");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div className={`city-canvas ${ready ? "is-ready" : ""}`} aria-hidden="true">
      {quality !== null && (
        <SceneBoundary>
          <Canvas
            dpr={lowPower ? 1 : [1, 1.5]}
            camera={{ position: [6.2, 4.2, 12], fov: 48 }}
            shadows={!lowPower}
            gl={{ antialias: !lowPower, powerPreference: "high-performance" }}
            onCreated={() => setReady(true)}
          >
            <Scene progressRef={progressRef} compact={compact} lowPower={lowPower} />
          </Canvas>
        </SceneBoundary>
      )}
    </div>
  );
}
