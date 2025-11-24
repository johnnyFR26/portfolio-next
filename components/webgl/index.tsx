"use client"

import dynamic from "next/dynamic"
import { Suspense, useState, useEffect } from "react"

// Dynamic imports for WebGL components to avoid SSR issues
const ParticleField = dynamic(() => import("./particle-field").then((mod) => ({ default: mod.ParticleField })), {
  ssr: false,
})
const FloatingShapes = dynamic(() => import("./floating-shapes").then((mod) => ({ default: mod.FloatingShapes })), {
  ssr: false,
})
const WaveMesh = dynamic(() => import("./wave-mesh").then((mod) => ({ default: mod.WaveMesh })), { ssr: false })
const GradientSphere = dynamic(() => import("./gradient-sphere").then((mod) => ({ default: mod.GradientSphere })), {
  ssr: false,
})
const NeuralNetwork = dynamic(() => import("./neural-network").then((mod) => ({ default: mod.NeuralNetwork })), {
  ssr: false,
})

export type WebGLSceneType = "particles" | "shapes" | "wave" | "gradient" | "neural"

interface WebGLBackgroundProps {
  scene?: WebGLSceneType
  className?: string
}

export function WebGLBackground({ scene = "particles", className = "" }: WebGLBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`absolute inset-0 -z-10 bg-gray-950 ${className}`} />
  }

  const scenes = {
    particles: <ParticleField />,
    shapes: <FloatingShapes />,
    wave: <WaveMesh />,
    gradient: <GradientSphere />,
    neural: <NeuralNetwork />,
  }

  return (
    <Suspense fallback={<div className={`absolute inset-0 -z-10 bg-gray-950 ${className}`} />}>
      <div className={className}>{scenes[scene]}</div>
    </Suspense>
  )
}

// Export individual components for direct use
export { ParticleField, FloatingShapes, WaveMesh, GradientSphere, NeuralNetwork }
