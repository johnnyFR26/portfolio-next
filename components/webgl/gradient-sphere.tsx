"use client"

import { useRef } from "react"
import { Canvas, useFrame, extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"

const GradientMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#3b82f6"),
    uColor2: new THREE.Color("#a855f7"),
    uColor3: new THREE.Color("#ec4899"),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      pos.x += sin(pos.y * 4.0 + uTime) * 0.1;
      pos.y += sin(pos.x * 4.0 + uTime) * 0.1;
      pos.z += sin(pos.x * 2.0 + pos.y * 2.0 + uTime) * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    
    void main() {
      float mixValue1 = sin(vUv.x * 3.14159 + uTime) * 0.5 + 0.5;
      float mixValue2 = sin(vUv.y * 3.14159 + uTime * 0.5) * 0.5 + 0.5;
      
      vec3 color = mix(uColor1, uColor2, mixValue1);
      color = mix(color, uColor3, mixValue2 * 0.5);
      
      float fresnel = pow(1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0)), 2.0);
      color += fresnel * 0.3;
      
      gl_FragColor = vec4(color, 0.9);
    }
  `,
)

extend({ GradientMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gradientMaterial: any
    }
  }
}

function AnimatedGradientSphere() {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useRef<any>(null)

  useFrame((state) => {
    if (material.current) {
      material.current.uTime = state.clock.getElapsedTime()
    }
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.2
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  return (
    <mesh ref={mesh} scale={2}>
      <icosahedronGeometry args={[1, 64]} />
      <gradientMaterial ref={material} transparent />
    </mesh>
  )
}

export function GradientSphere() {
  return (
    <div className="absolute inset-0 -z-10 opacity-70">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AnimatedGradientSphere />
      </Canvas>
    </div>
  )
}
