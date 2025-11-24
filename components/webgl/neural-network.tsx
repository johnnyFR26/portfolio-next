"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function NeuralNodes({ count = 50 }) {
  const mesh = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)

  const { positions, connections } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const connections: number[] = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }

    // Create connections between nearby nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < 2.5) {
          connections.push(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2],
            positions[j * 3],
            positions[j * 3 + 1],
            positions[j * 3 + 2],
          )
        }
      }
    }

    return { positions, connections: new Float32Array(connections) }
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.1
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
      linesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2
    }
  })

  return (
    <group>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#3b82f6" transparent opacity={0.9} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length / 3}
            array={connections}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.2} />
      </lineSegments>
    </group>
  )
}

function PulsingLight() {
  const light = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (light.current) {
      light.current.intensity = 2 + Math.sin(state.clock.getElapsedTime() * 2) * 0.5
      light.current.position.x = Math.sin(state.clock.getElapsedTime()) * 3
      light.current.position.z = Math.cos(state.clock.getElapsedTime()) * 3
    }
  })

  return <pointLight ref={light} color="#3b82f6" distance={15} />
}

export function NeuralNetwork() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 5, 20]} />
        <ambientLight intensity={0.3} />
        <PulsingLight />
        <NeuralNodes count={60} />
      </Canvas>
    </div>
  )
}
