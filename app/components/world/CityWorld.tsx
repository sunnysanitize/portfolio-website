"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ROAD_END = -156;

function seeded(index: number, salt = 0) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function Building({ index, side }: { index: number; side: -1 | 1 }) {
  const depth = 7 + seeded(index, 1) * 8;
  const width = 4 + seeded(index, 2) * 7;
  const height = 7 + seeded(index, 3) * 23;
  const z = 8 - index * 8;
  const x = side * (8.5 + width / 2 + seeded(index, 4) * 5);
  const cyan = seeded(index, 6) > 0.48;
  const color = cyan ? "#12f1ff" : "#ff4b26";

  return (
    <group position={[x, height / 2 - 1.5, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#090b13" roughness={0.72} metalness={0.55} />
      </mesh>
      <mesh position={[-side * (width / 2 + 0.025), height * 0.08, 0]}>
        <boxGeometry args={[0.06, height * 0.64, depth * 0.74]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} />
      </mesh>
      {Array.from({ length: Math.min(9, Math.floor(height / 2.4)) }).map((_, floor) => (
        <mesh key={floor} position={[-side * (width / 2 + 0.06), -height / 2 + 1.5 + floor * 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[depth * 0.62, 0.24]} />
          <meshBasicMaterial color={floor % 3 === 0 ? color : "#34445c"} transparent opacity={0.72} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {index % 4 === 0 && (
        <mesh position={[-side * (width / 2 + 0.45), height * 0.15, depth * 0.12]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[depth * 0.48, 2.6, 0.16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </mesh>
      )}
      <mesh position={[0, height / 2 + 0.65, 0]} castShadow>
        <boxGeometry args={[width * 0.52, 1.3, depth * 0.45]} />
        <meshStandardMaterial color="#101522" metalness={0.8} roughness={0.42} />
      </mesh>
      {index % 3 === 0 && <mesh position={[0, height / 2 + 2.4, 0]}><cylinderGeometry args={[0.06, 0.08, 3.5, 6]} /><meshBasicMaterial color={color} /></mesh>}
      {Array.from({ length: 3 }).map((_, column) => (
        <mesh key={`window-${column}`} position={[-side * (width / 2 + 0.07), height * 0.28 - column * 2.7, -depth * 0.28 + column * depth * 0.27]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.15, 1.1]} />
          <meshBasicMaterial color={column === 1 ? "#ffd17a" : color} transparent opacity={0.45 + seeded(index, column + 8) * 0.45} />
        </mesh>
      ))}
    </group>
  );
}

function StreetUnit({ index, side }: { index: number; side: -1 | 1 }) {
  const z = 4 - index * 9;
  const color = index % 2 ? "#12f1ff" : "#ff4b26";
  return (
    <group position={[side * 7.1, 0, z]}>
      <mesh position={[0, 2.9, 0]}><cylinderGeometry args={[0.055, 0.085, 5.8, 7]} /><meshStandardMaterial color="#252b38" metalness={0.9} /></mesh>
      <mesh position={[-side * 0.55, 5.55, 0]}><boxGeometry args={[1.1, 0.08, 0.08]} /><meshStandardMaterial color="#333b49" metalness={0.9} /></mesh>
      <mesh position={[-side * 1.05, 5.42, 0]}><boxGeometry args={[0.32, 0.16, 0.78]} /><meshBasicMaterial color="#e8ffff" toneMapped={false} /></mesh>
      <mesh position={[-side * 2.5, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[4.2, 28]} /><meshBasicMaterial color={color} transparent opacity={0.075} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      {index % 3 === 0 && <pointLight position={[-side * 2.25, 4.8, 0]} color={index % 2 ? "#baf8ff" : "#ffd4b3"} intensity={68} distance={16} decay={2} />}
      <mesh position={[0, 0.42, 0]}><boxGeometry args={[0.32, 0.84, 0.32]} /><meshStandardMaterial color="#161b25" metalness={0.75} /></mesh>
    </group>
  );
}

function DistantTower({ index, side }: { index: number; side: -1 | 1 }) {
  const height = 18 + seeded(index, 15) * 35;
  const width = 5 + seeded(index, 16) * 8;
  return <mesh position={[side * (22 + seeded(index, 17) * 18), height / 2 - 2, 5 - index * 13]}><boxGeometry args={[width, height, 8]} /><meshStandardMaterial color="#050711" emissive={index % 3 === 0 ? "#081529" : "#10060d"} emissiveIntensity={0.5} roughness={1} /></mesh>;
}

function WindowField() {
  const windows = useRef<THREE.InstancedMesh>(null);
  const instances = useMemo(() => {
    const result: { position: [number, number, number]; color: THREE.Color }[] = [];
    for (const side of [-1, 1] as const) {
      for (let index = 0; index < 23; index++) {
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
            result.push({
              position: [x, 0.25 + row * 1.85, z - depth * 0.38 + column * (depth * 0.76 / Math.max(1, columns - 1))],
              color: new THREE.Color(warm ? "#ffb35c" : side === -1 ? "#ff315f" : "#39eaff"),
            });
          }
        }
      }
    }
    return result;
  }, []);

  useLayoutEffect(() => {
    if (!windows.current) return;
    const matrix = new THREE.Matrix4();
    instances.forEach((instance, index) => {
      matrix.makeTranslation(...instance.position);
      windows.current!.setMatrixAt(index, matrix);
      windows.current!.setColorAt(index, instance.color);
    });
    windows.current.instanceMatrix.needsUpdate = true;
    if (windows.current.instanceColor) windows.current.instanceColor.needsUpdate = true;
  }, [instances]);

  return <instancedMesh ref={windows} args={[undefined, undefined, instances.length]} frustumCulled>
    <boxGeometry args={[0.08, 0.48, 0.72]} />
    <meshBasicMaterial toneMapped={false} transparent opacity={0.78} />
  </instancedMesh>;
}

function Hologram({ position, color, tall = false }: { position: [number, number, number]; color: string; tall?: boolean }) {
  return <group position={position}>
    <mesh><boxGeometry args={[0.12, tall ? 6.5 : 3.6, tall ? 3.4 : 5]} /><meshBasicMaterial color={color} transparent opacity={0.11} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh>
    <mesh position={[-0.08, 0, 0]}><boxGeometry args={[0.06, tall ? 6.8 : 3.9, tall ? 3.7 : 5.3]} /><meshBasicMaterial color={color} wireframe transparent opacity={0.65} /></mesh>
    {[-0.34, 0, 0.34].map((offset) => <mesh key={offset} position={[-0.15, offset * (tall ? 7 : 4), 0]}><boxGeometry args={[0.04, 0.035, tall ? 3.2 : 4.8]} /><meshBasicMaterial color={color} /></mesh>)}
    <pointLight color={color} intensity={2.5} distance={9} />
  </group>;
}

function Skybridge({ z, color }: { z: number; color: string }) {
  return <group position={[0, 8.7, z]}>
    <mesh><boxGeometry args={[20, 1.65, 2.15]} /><meshPhysicalMaterial color="#0b101b" metalness={0.82} roughness={0.2} transparent opacity={0.92} /></mesh>
    <mesh position={[0, 0, 1.09]}><planeGeometry args={[17, 0.82]} /><meshBasicMaterial color={color} transparent opacity={0.22} /></mesh>
    {Array.from({ length: 9 }).map((_, index) => <mesh key={index} position={[-7.8 + index * 1.95, 0, 1.12]}><boxGeometry args={[0.08, 1.18, 0.05]} /><meshBasicMaterial color={color} /></mesh>)}
    <mesh position={[0, -0.87, 0]}><boxGeometry args={[14, 0.08, 0.12]} /><meshBasicMaterial color={color} /></mesh>
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
  return <group>{Array.from({ length: 28 }).map((_, index) => {
    const side: -1 | 1 = index % 2 ? -1 : 1;
    const color = index % 3 === 0 ? "#ff315f" : index % 3 === 1 ? "#12f1ff" : "#8c5cff";
    return <group key={index} position={[side * 8.4, 1.25, 2 - index * 5.8]}>
      <mesh><boxGeometry args={[1.35, 2.5, 4.1]} /><meshStandardMaterial color="#0a0d14" metalness={0.7} roughness={0.35} /></mesh>
      <mesh position={[-side * 0.69, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[3.25, 1.45]} /><meshBasicMaterial color={color} transparent opacity={0.28} /></mesh>
      <mesh position={[-side * 0.76, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[2.6, 0.3, 0.08]} /><meshBasicMaterial color={color} /></mesh>
    </group>;
  })}</group>;
}

function Traffic() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((vehicle, index) => {
      const travelled = clock.elapsedTime * (7 + index % 3) + index * 27;
      vehicle.position.z = ((travelled % 175) + 175) % 175 - 165;
    });
  });
  return <group ref={group}>{Array.from({ length: 8 }).map((_, index) => {
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
      <pointLight position={[0, 0, 2.05]} color="#d9ffff" intensity={2.2} distance={7} />
    </group>;
  })}</group>;
}

function City() {
  return (
    <group>
      {Array.from({ length: 15 }).flatMap((_, index) => [<DistantTower key={`dl-${index}`} index={index} side={-1} />, <DistantTower key={`dr-${index}`} index={index + 31} side={1} />])}
      {Array.from({ length: 23 }).flatMap((_, index) => [
        <Building key={`l-${index}`} index={index} side={-1} />,
        <Building key={`r-${index}`} index={index + 43} side={1} />,
      ])}
      <WindowField />
      <Storefronts />
      <Traffic />
      <Hologram position={[-9.2, 7.5, -20]} color="#12f1ff" tall />
      <Hologram position={[9.4, 6, -55]} color="#ff315f" />
      <Hologram position={[-9.4, 7, -91]} color="#8c5cff" tall />
      <Hologram position={[9.2, 5.5, -128]} color="#12f1ff" />
      <Skybridge z={-33} color="#12f1ff" />
      <Skybridge z={-107} color="#ff315f" />
      <Intersection z={-17} color="#12f1ff" />
      <Intersection z={-67} color="#ff315f" />
      <Intersection z={-121} color="#8c5cff" />
      <mesh position={[0, -0.22, -75]} receiveShadow>
        <boxGeometry args={[13, 0.4, 172]} />
        <meshPhysicalMaterial color="#07080d" roughness={0.2} metalness={0.72} clearcoat={0.85} clearcoatRoughness={0.22} />
      </mesh>
      {[-1, 1].map((side) => <group key={`walk-${side}`}>
        <mesh position={[side * 7.25, 0.05, -75]} receiveShadow><boxGeometry args={[1.5, 0.3, 172]} /><meshStandardMaterial color="#11141b" roughness={0.6} metalness={0.35} /></mesh>
        <mesh position={[side * 6.48, 0.2, -75]}><boxGeometry args={[0.09, 0.12, 172]} /><meshBasicMaterial color={side === -1 ? "#ff4b26" : "#12f1ff"} transparent opacity={0.72} /></mesh>
      </group>)}
      {Array.from({ length: 19 }).flatMap((_, index) => [<StreetUnit key={`sl-${index}`} index={index} side={-1} />, <StreetUnit key={`sr-${index}`} index={index} side={1} />])}
      <mesh position={[0, 0.012, -75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 166]} />
        <meshBasicMaterial color="#12f1ff" transparent opacity={0.28} />
      </mesh>
      {Array.from({ length: 35 }).map((_, index) => (
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
      {Array.from({ length: 13 }).map((_, index) => <group key={`barrier-${index}`} position={[index % 2 ? -7.8 : 7.8, 0.48, 1 - index * 13]}>
        <mesh><boxGeometry args={[0.6, 0.75, 3.8]} /><meshStandardMaterial color="#171c26" metalness={0.7} roughness={0.4} /></mesh>
        <mesh position={[index % 2 ? 0.31 : -0.31, 0, 0]}><boxGeometry args={[0.03, 0.16, 3.1]} /><meshBasicMaterial color={index % 2 ? "#ff4b26" : "#12f1ff"} /></mesh>
      </group>)}
    </group>
  );
}

function Car({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const car = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const rearGlow = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (!car.current) return;
    const targetZ = 3 + ROAD_END * progressRef.current;
    car.current.position.z = THREE.MathUtils.damp(car.current.position.z, targetZ, 4.2, delta);
    car.current.position.y = 0.72 + Math.sin(state.clock.elapsedTime * 8) * 0.012;
    car.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.012;
    wheels.current.forEach((wheel) => { wheel.rotation.x -= delta * (3 + progressRef.current * 16); });
    if (rearGlow.current) rearGlow.current.intensity = 3.5 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
  });

  return (
    <group ref={car} position={[2.45, 0.72, 3]} scale={1.08}>
      <mesh position={[0, -0.18, 0]} castShadow>
        <boxGeometry args={[2.45, 0.28, 4.45]} />
        <meshPhysicalMaterial color="#05070a" metalness={0.5} roughness={0.3} clearcoat={1} clearcoatRoughness={0.22} />
      </mesh>
      <mesh position={[0, 0.05, -0.28]} rotation={[-0.045, 0, 0]} castShadow>
        <boxGeometry args={[2.12, 0.42, 3.85]} />
        <meshPhysicalMaterial color="#0b0d12" metalness={0.48} roughness={0.27} clearcoat={1} clearcoatRoughness={0.18} />
      </mesh>
      <mesh position={[0, 0.55, 0.38]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[1.72, 0.68, 1.9]} />
        <meshStandardMaterial color="#07131a" metalness={0.28} roughness={0.12} emissive="#031219" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0.16, -2.18]} rotation={[0.19, 0, 0]}><boxGeometry args={[2.05, 0.23, 0.68]} /><meshPhysicalMaterial color="#0b0e13" metalness={0.45} roughness={0.28} clearcoat={1} /></mesh>
      <mesh position={[0, 0.05, -2.54]}><boxGeometry args={[1.72, 0.08, 0.06]} /><meshBasicMaterial color="#d9ffff" toneMapped={false} /></mesh>
      <mesh position={[0, 0.03, 2.27]}><boxGeometry args={[1.85, 0.11, 0.06]} /><meshBasicMaterial color="#ff174f" toneMapped={false} /></mesh>
      <mesh position={[0, 0.56, 2.02]}><boxGeometry args={[2.35, 0.06, 0.32]} /><meshPhysicalMaterial color="#07090d" metalness={0.5} roughness={0.24} clearcoat={1} /></mesh>
      <mesh position={[0, 0.82, 1.93]}><boxGeometry args={[2.55, 0.08, 0.42]} /><meshPhysicalMaterial color="#0b0e13" metalness={0.45} roughness={0.25} clearcoat={1} /></mesh>
      {[-0.93, 0.93].map((x) => [-1.35, 1.38].map((z) => <group key={`${x}-${z}`} ref={(node) => { if (node && !wheels.current.includes(node)) wheels.current.push(node); }} position={[x, -0.1, z]} rotation={[0, Math.PI / 2, 0]}>
        <mesh><torusGeometry args={[0.38, 0.14, 10, 20]} /><meshStandardMaterial color="#030405" roughness={0.7} /></mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.24, 0.24, 0.08, 12]} /><meshStandardMaterial color="#ff4b26" emissive="#ff4b26" emissiveIntensity={1.5} metalness={0.9} /></mesh>
      </group>))}
      {[-1.12, 1.12].map((x) => <mesh key={x} position={[x, -0.25, 0]}><boxGeometry args={[0.08, 0.06, 3.65]} /><meshBasicMaterial color="#12f1ff" /></mesh>)}
      {[-1.18, 1.18].map((x) => <mesh key={`rim-${x}`} position={[x, 0.08, 0]}><boxGeometry args={[0.055, 0.12, 4.12]} /><meshBasicMaterial color="#71f7ff" toneMapped={false} /></mesh>)}
      <mesh position={[0, 0.34, 2.22]}><boxGeometry args={[2.14, 0.055, 0.08]} /><meshBasicMaterial color="#ff5a76" toneMapped={false} /></mesh>
      <mesh position={[0, 0.3, 0]}><boxGeometry args={[2.14, 0.035, 0.08]} /><meshBasicMaterial color="#12f1ff" toneMapped={false} /></mesh>
      <mesh position={[0, -0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.5, 4.8]} /><meshBasicMaterial color="#12f1ff" transparent opacity={0.28} blending={THREE.AdditiveBlending} /></mesh>
      <pointLight position={[0, 0.15, -2.7]} color="#dffcff" intensity={7} distance={14} />
      <pointLight position={[0, -0.25, 0]} color="#12f1ff" intensity={4} distance={6} />
      <pointLight position={[0, 3.2, 1]} color="#d5e7ff" intensity={12} distance={9} decay={2} />
      <pointLight position={[0, 1.1, 3.2]} color="#ff6480" intensity={18} distance={7} decay={2} />
      <pointLight ref={rearGlow} position={[0, 0.05, 2.5]} color="#ff244d" intensity={5} distance={9} />
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const current = useRef(new THREE.Vector3(8.1, 4.2, 12));
  useFrame(({ camera }, delta) => {
    const carZ = 3 + ROAD_END * progressRef.current;
    const cinematic = Math.sin(progressRef.current * Math.PI * 8) * 0.7;
    current.current.set(8.1 + cinematic, 4.2, carZ + 11.5);
    camera.position.lerp(current.current, 1 - Math.exp(-delta * 3.2));
    camera.lookAt(2.45, 0.7, carZ - 8);
  });
  return null;
}

function Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#03040a"]} />
      <fog attach="fog" args={["#03040a", 17, 72]} />
      <ambientLight intensity={0.38} color="#53618e" />
      <directionalLight position={[4, 12, 8]} color="#9bb3ff" intensity={1.1} castShadow />
      <City />
      <Car progressRef={progressRef} />
      <CameraRig progressRef={progressRef} />
      <Sparkles count={240} scale={[28, 18, 175]} position={[0, 8, -72]} size={1.2} speed={0.35} color="#8ffcff" opacity={0.5} />
    </>
  );
}

export default function CityWorld() {
  const progressRef = useRef(0);
  const [ready, setReady] = useState(false);
  const dpr = useMemo<[number, number]>(() => [1, 1.5], []);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className={`city-canvas ${ready ? "is-ready" : ""}`} aria-hidden="true">
      <Canvas dpr={dpr} camera={{ position: [8.1, 4.2, 12], fov: 48 }} shadows gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={() => setReady(true)}>
        <Scene progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
