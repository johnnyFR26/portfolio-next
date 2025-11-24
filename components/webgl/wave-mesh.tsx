"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function Wave() {
  const mesh = useRef<THREE.Mesh>(null)

  const { positions, colors } = useMemo(() => {
    const segmentsX = 100
    const segmentsY = 100
    const positions = new Float32Array((segmentsX + 1) * (segmentsY + 1) * 3)
    const colors = new Float32Array((segmentsX + 1) * (segmentsY + 1) * 3)

    let i = 0
    for (let y = 0; y <= segmentsY; y++) {
      for (let x = 0; x <= segmentsX; x++) {
        positions[i] = (x / segmentsX - 0.5) * 10
        positions[i + 1] = 0
        positions[i + 2] = (y / segmentsY - 0.5) * 10

        const color = new THREE.Color()
        color.setHSL(0.6 + (x / segmentsX) * 0.2, 0.8, 0.5)
        colors[i] = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b

        i += 3
      }
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (mesh.current) {
      const pos = mesh.current.geometry.attributes.position.array as Float32Array
      const time = state.clock.getElapsedTime()

      let i = 0
      for (let y = 0; y <= 100; y++) {
        for (let x = 0; x <= 100; x++) {
          const px = pos[i]
          const pz = pos[i + 2]
          pos[i + 1] = Math.sin(px * 0.5 + time) * 0.3 + Math.sin(pz * 0.5 + time * 0.5) * 0.3
          i += 3
        }
      }
      mesh.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[10, 10, 100, 100]} />
      <meshStandardMaterial color="#3b82f6" wireframe side={THREE.DoubleSide} transparent opacity={0.3} />
    </mesh>
  )
}

export function WaveMesh() {
  return (
    <div className="absolute inset-0 -z-10 opacity-50">
      <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#3b82f6" />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#a855f7" />
        <Wave />
      </Canvas>
    </div>
  )
}
