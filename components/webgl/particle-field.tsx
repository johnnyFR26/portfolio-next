"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null)
  const light = useRef<THREE.PointLight>(null)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [count])

  const colors = useMemo(() => {
    const temp = []
    const color1 = new THREE.Color("#3b82f6") // blue
    const color2 = new THREE.Color("#a855f7") // purple
    const color3 = new THREE.Color("#ec4899") // pink

    for (let i = 0; i < count; i++) {
      const mixedColor = color1.clone()
      const rand = Math.random()
      if (rand < 0.33) {
        mixedColor.lerp(color2, Math.random())
      } else if (rand < 0.66) {
        mixedColor.lerp(color3, Math.random())
      }
      temp.push(mixedColor.r, mixedColor.g, mixedColor.b)
    }
    return new Float32Array(temp)
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.05
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.075

      // Animate particles
      const positions = mesh.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.getElapsedTime() + positions[i]) * 0.002
      }
      mesh.current.geometry.attributes.position.needsUpdate = true
    }
    if (light.current) {
      light.current.position.x = Math.sin(state.clock.getElapsedTime()) * 3
      light.current.position.y = Math.cos(state.clock.getElapsedTime()) * 3
    }
  })

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="#3b82f6" />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

export function ParticleField() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 5, 15]} />
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  )
}
