"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Box, Waves, Circle, Network } from "lucide-react"
import type { WebGLSceneType } from "./index"

interface SceneSwitcherProps {
  currentScene: WebGLSceneType
  onSceneChange: (scene: WebGLSceneType) => void
  labels?: {
    particles?: string
    shapes?: string
    wave?: string
    gradient?: string
    neural?: string
  }
}

export function SceneSwitcher({ currentScene, onSceneChange, labels }: SceneSwitcherProps) {
  const scenes: { id: WebGLSceneType; icon: React.ReactNode; label: string }[] = [
    { id: "particles", icon: <Sparkles className="w-4 h-4" />, label: labels?.particles || "Particles" },
    { id: "shapes", icon: <Box className="w-4 h-4" />, label: labels?.shapes || "Shapes" },
    { id: "wave", icon: <Waves className="w-4 h-4" />, label: labels?.wave || "Wave" },
    { id: "gradient", icon: <Circle className="w-4 h-4" />, label: labels?.gradient || "Gradient" },
    { id: "neural", icon: <Network className="w-4 h-4" />, label: labels?.neural || "Neural" },
  ]

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {scenes.map((scene) => (
        <Button
          key={scene.id}
          variant={currentScene === scene.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSceneChange(scene.id)}
          className={`gap-2 ${
            currentScene === scene.id
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          }`}
        >
          {scene.icon}
          <span className="hidden sm:inline">{scene.label}</span>
        </Button>
      ))}
    </div>
  )
}
