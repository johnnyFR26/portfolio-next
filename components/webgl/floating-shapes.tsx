"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Box, Torus, Icosahedron } from "@react-three/drei"
import type * as THREE from "three"

function AnimatedSphere({
  position,
  color,
  speed = 1,
  distort = 0.3,
}: { position: [number, number, number]; color: string; speed?: number; distort?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere
        ref={mesh}
        args={[0.6, 64, 64]}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={hovered ? distort + 0.2 : distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function AnimatedBox({
  position,
  color,
  speed = 1,
}: { position: [number, number, number]; color: string; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * speed * 0.5
      mesh.current.rotation.y = state.clock.getElapsedTime() * speed * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
      <Box ref={mesh} args={[0.8, 0.8, 0.8]} position={position}>
        <MeshWobbleMaterial color={color} attach="material" factor={0.4} speed={2} roughness={0.1} metalness={0.9} />
      </Box>
    </Float>
  )
}

function AnimatedTorus({
  position,
  color,
  speed = 1,
}: { position: [number, number, number]; color: string; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * speed * 0.3
      mesh.current.rotation.z = state.clock.getElapsedTime() * speed * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
      <Torus ref={mesh} args={[0.5, 0.2, 16, 32]} position={position}>
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} emissive={color} emissiveIntensity={0.2} />
      </Torus>
    </Float>
  )
}

function AnimatedIcosahedron({
  position,
  color,
  speed = 1,
}: { position: [number, number, number]; color: string; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * speed * 0.4
      mesh.current.rotation.y = state.clock.getElapsedTime() * speed * 0.6
    }
  })

  return (
    <Float speed={1.8} rotationIntensity={1} floatIntensity={2}>
      <Icosahedron ref={mesh} args={[0.6, 1]} position={position}>
        <meshStandardMaterial color={color} wireframe roughness={0.3} metalness={0.7} />
      </Icosahedron>
    </Float>
  )
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <spotLight position={[0, 5, 5]} intensity={0.8} color="#ec4899" angle={0.3} />

        <AnimatedSphere position={[-3, 1, 0]} color="#3b82f6" speed={0.8} distort={0.4} />
        <AnimatedSphere position={[3, -1, -2]} color="#a855f7" speed={1.2} distort={0.3} />
        <AnimatedBox position={[2, 2, -1]} color="#ec4899" speed={0.6} />
        <AnimatedBox position={[-2.5, -1.5, 1]} color="#06b6d4" speed={0.9} />
        <AnimatedTorus position={[0, -2, 0]} color="#f59e0b" speed={1} />
        <AnimatedTorus position={[-1, 2, -2]} color="#10b981" speed={0.7} />
        <AnimatedIcosahedron position={[3.5, 0, 1]} color="#3b82f6" speed={0.5} />
        <AnimatedIcosahedron position={[-3.5, -0.5, -1]} color="#a855f7" speed={0.8} />
      </Canvas>
    </div>
  )
}
