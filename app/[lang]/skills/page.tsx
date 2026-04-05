"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence, useInView, useSpring, useTransform } from "framer-motion"
import { 
  Settings, Hash, Database, Cloud, Code, Terminal, Zap, 
  Server, Layers, GitBranch, Shield, Activity, ArrowRight,
  Cpu, Box, Search, List, FileCode, BarChart3, Network,
  HardDrive, RefreshCw, Globe, Lock, Gauge, Container
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
}

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

// ============================================
// TYPE DEFINITIONS
// ============================================
type TabType = 'frontend' | 'backend' | 'database' | 'cloud'

interface SidebarItem {
  id: string
  icon: any
  label: string
}

interface Dictionary {
  skillsPage: {
    sidebar: {
      architecture: string
      systems: string
      data: string
      infrastructure: string
      hireMe: string
      settings: string
      logs: string
      rootDir: string
      version: string
      rootAccess: string
    }
    frontend: {
      label: string
      title1: string
      title2: string
      description: string
      systemHealth: string
      uptimeStable: string
      lighthousePerf: string
      fastestTti: string
      timeToInteractive: string
      latencyReduction: string
      uiEngine: string
      proceduralUi: string
      executionStack: string
      technicalCapabilities: string
      reactiveCore: string
      reactiveCoreDesc: string
      industrialUi: string
      industrialUiDesc: string
      developerUx: string
      developerUxDesc: string
    }
    backend: {
      label: string
      title1: string
      title2: string
      title3: string
      description: string
      techStack: string
      highConcurrency: string
      dxOptimized: string
      enterpriseGrade: string
      systemArchitecture: string
      schemaVersion: string
      apiGateway: string
      apiGatewayDesc: string
      modularMicroservices: string
      kubernetesOrchestrated: string
      kafkaBus: string
      kafkaBusDesc: string
      persistenceLayer: string
      relational: string
      cache: string
      search: string
      engineeringPatterns: string
      solidClean: string
      solidCleanDesc: string
      cqrsEvent: string
      cqrsEventDesc: string
      ddd: string
      dddDesc: string
      quoteLog: string
      quote: string
    }
    database: {
      label: string
      title1: string
      title2: string
      description: string
      liveThroughput: string
      latency: string
      read: string
      monitorActive: string
      uptimeStability: string
      engineStack: string
      ormPreference: string
      coreCapabilities: string
      optimizedSearches: string
      optimizedSearchesDesc: string
      advancedIndexing: string
      advancedIndexingDesc: string
      proceduresTriggers: string
      proceduresTriggersDesc: string
      prismaExpert: string
      expert: string
      prismaDesc: string
    }
    cloud: {
      label: string
      title1: string
      title2: string
      description: string
      provisioningEngine: string
      deterministicEnv: string
      deterministicEnvDesc: string
      architectureVisualizer: string
      observability: string
      jaegerTracing: string
      jaegerTracingDesc: string
      opentelemetry: string
      opentelemetryDesc: string
      grafanaDashboards: string
      grafanaDashboardsDesc: string
      metricExplorer: string
      cpuUsage: string
      requestLatency: string
      activeDeployments: string
      count: string
      projectA: string
      projectADesc: string
      projectB: string
      projectBDesc: string
      projectC: string
      projectCDesc: string
      explore: string
    }
    footer: {
      copyright: string
    }
  }
}

// ============================================
// ANIMATED NUMBER COMPONENT
// ============================================
function AnimatedNumber({ 
  value, 
  suffix = "", 
  prefix = "",
  duration = 2,
  delay = 0
}: { 
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  delay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => {
    if (value >= 100) return Math.round(current).toLocaleString()
    if (value >= 10) return current.toFixed(1)
    return current.toFixed(2)
  })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        spring.set(value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, spring, value, delay])

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

// ============================================
// ANIMATED PERCENTAGE COMPONENT
// ============================================
function AnimatedPercentage({ 
  value, 
  label,
  delay = 0
}: { 
  value: number
  label: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref}>
      <motion.div 
        className="text-4xl font-headline font-bold text-kinetic-primary"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay }}
      >
        <AnimatedNumber value={value} suffix="%" delay={delay} />
      </motion.div>
      <div className="text-xs font-code text-[var(--on-surface-variant)]">{label}</div>
    </div>
  )
}

// ============================================
// ANIMATED BAR CHART COMPONENT
// ============================================
function AnimatedBarChart({ heights }: { heights: number[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className="flex items-end gap-2 h-40 mt-6">
      {heights.map((height, i) => (
        <motion.div 
          key={i} 
          className="flex-1 flex flex-col gap-1"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
          style={{ transformOrigin: "bottom" }}
        >
          <motion.div 
            className="bg-kinetic-primary" 
            style={{ height: `${height}%` }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: i * 0.05 + 0.3 }}
          />
          <motion.div 
            className="bg-kinetic-secondary/50" 
            style={{ height: `${100 - height}%` }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: i * 0.05 + 0.4 }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// ANIMATED METRIC CARD COMPONENT
// ============================================
function AnimatedMetricCard({ 
  label, 
  value, 
  numericValue,
  suffix = "",
  sublabel, 
  color = "kinetic-primary",
  delay = 0
}: { 
  label: string
  value: string
  numericValue?: number
  suffix?: string
  sublabel?: string
  color?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div 
      ref={ref}
      className="bg-surface-container-low border border-surface-container-high p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-xs font-code text-[var(--on-surface-variant)] uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-headline font-bold text-${color}`}>
        {numericValue !== undefined ? (
          <AnimatedNumber value={numericValue} suffix={suffix} delay={delay} />
        ) : (
          value
        )}
      </div>
      {sublabel && <div className="text-xs font-code text-[var(--on-surface-variant)] mt-1">{sublabel}</div>}
    </motion.div>
  )
}

// ============================================
// TERMINAL LOG COMPONENT
// ============================================
function TerminalLog({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className="bg-surface-container-lowest p-4 font-code text-xs space-y-1 border border-surface-container-high">
      {lines.map((line, index) => (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`
            ${line.startsWith('[SYS') ? 'text-kinetic-primary' : ''}
            ${line.startsWith('[HEALTH') ? 'text-green-400' : ''}
            ${line.startsWith('[METRIC') ? 'text-yellow-400' : ''}
            ${line.startsWith('[ALERT') ? 'text-red-400' : ''}
            ${line.startsWith('[INFO') ? 'text-blue-400' : ''}
            ${!line.startsWith('[') ? 'text-[var(--on-surface-variant)]' : ''}
          `}
        >
          {line}
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// CODE BLOCK COMPONENT
// ============================================
function CodeBlock({ code, filename, language }: { code: string; filename: string; language?: string }) {
  return (
    <div className="bg-surface-container-lowest border border-surface-container-high overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border-b border-surface-container-high">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-2 font-code text-xs text-[var(--on-surface-variant)]">{filename}</span>
      </div>
      <pre className="p-4 font-code text-xs overflow-x-auto">
        <code className="text-[var(--on-surface)]">{code}</code>
      </pre>
    </div>
  )
}

// ============================================
// METRIC CARD COMPONENT
// ============================================
function MetricCard({ label, value, sublabel, color = "kinetic-primary" }: { label: string; value: string; sublabel?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div 
      ref={ref}
      className="bg-surface-container-low border border-surface-container-high p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="text-xs font-code text-[var(--on-surface-variant)] uppercase tracking-wider mb-1">{label}</div>
      <motion.div 
        className={`text-2xl font-headline font-bold text-${color}`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {value}
      </motion.div>
      {sublabel && <div className="text-xs font-code text-[var(--on-surface-variant)] mt-1">{sublabel}</div>}
    </motion.div>
  )
}

// ============================================
// ARCHITECTURE CARD COMPONENT
// ============================================
function ArchitectureCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-low border border-surface-container-high p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high">
          <Icon className="w-5 h-5 text-kinetic-primary" />
        </div>
        <h4 className="font-headline text-sm font-semibold uppercase tracking-wider">{title}</h4>
      </div>
      {children}
    </div>
  )
}

// ============================================
// FEATURE ITEM COMPONENT
// ============================================
function FeatureItem({ number, title, description, items }: { number: string; title: string; description: string; items?: string[] }) {
  return (
    <div className="border-l-2 border-kinetic-primary pl-4 py-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 flex items-center justify-center bg-kinetic-primary text-surface-container-lowest text-xs font-bold">
          {number}
        </span>
        <h4 className="font-headline font-semibold">{title}</h4>
      </div>
      <p className="text-sm text-[var(--on-surface-variant)] mb-2">{description}</p>
      {items && (
        <div className="space-y-1">
          {items.map((item, index) => (
            <div key={index} className="text-xs font-code text-[var(--on-surface-variant)]">
              &gt; {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// TECH CHIP COMPONENT
// ============================================
function TechChip({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-3 py-1.5 text-xs font-code
      ${active 
        ? 'bg-kinetic-primary text-surface-container-lowest' 
        : 'bg-surface-container-high text-[var(--on-surface)]'
      }
    `}>
      &gt; {children}
    </span>
  )
}

// ============================================
// SERVICE BOX COMPONENT
// ============================================
function ServiceBox({ label }: { label: string }) {
  return (
    <div className="px-4 py-2 bg-surface-container-lowest border border-surface-container-high text-xs font-code text-center">
      {label}
    </div>
  )
}

// ============================================
// FRONTEND SECTION
// ============================================
function FrontendSection({ dict }: { dict: Dictionary }) {
  const t = dict.skillsPage.frontend
  const angularCode = `@Component({
  selector: 'app-core-terminal',
  standalone: true,
  template: '<section class="kinetic-container">...</section>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreTerminalComponent {
  // Modern Signals Implementation
  readonly telemetry = signal<DataPoint[]>([]);
  readonly activeState = computed(() =>
    this.telemetry().filter(t => t.active)
  );

  constructor() {
    effect(() => console.log('System Stream:', this.activeState()));
  }
}`

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs font-code text-kinetic-primary mb-4">{t.label}</div>
          <h1 className="font-headline text-5xl md:text-6xl font-bold mb-2">
            {t.title1}
          </h1>
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-kinetic-primary mb-6">
            {t.title2}
          </h1>
          <p className="text-[var(--on-surface-variant)] text-lg leading-relaxed mb-6">
            {t.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <TechChip active>ANGULAR SIGNALS</TechChip>
            <TechChip active>RXJS REACTIVE DESIGN</TechChip>
            <TechChip active>TAILWIND CSS ENGINE</TechChip>
            <TechChip>FIGMA TO CODE</TechChip>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-surface-container-low border border-surface-container-high p-4">
            <div className="text-xs font-code text-[var(--on-surface-variant)] mb-2">{t.systemHealth}</div>
            <div className="text-4xl font-headline font-bold text-kinetic-primary">
              <AnimatedNumber value={99.8} suffix="%" />
            </div>
            <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.uptimeStable}</div>
          </div>
          <div className="flex justify-between items-center bg-surface-container-low border border-surface-container-high p-4">
            <span className="text-xs font-code text-[var(--on-surface-variant)]">{t.lighthousePerf}</span>
            <span className="font-code text-kinetic-primary">
              <AnimatedNumber value={99} suffix="/100" />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Code Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <CodeBlock code={angularCode} filename="app.component.ts" />
        
        <div className="flex flex-col justify-center space-y-4">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Zap className="w-10 h-10 text-kinetic-primary" />
            <div>
              <div className="font-headline text-2xl font-bold">{t.fastestTti}</div>
              <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.timeToInteractive}</div>
            </div>
          </motion.div>
          <motion.div 
            className="text-5xl font-headline font-bold text-kinetic-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatedNumber value={0.42} suffix="" delay={0.3} /><span className="text-lg">MS</span>
          </motion.div>
          <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.latencyReduction}</div>
        </div>
      </div>

      {/* Project Showcase */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-surface-container-lowest border border-surface-container-high p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent z-10" />
          <div className="relative z-0 h-48 bg-surface-container-low" />
          <div className="relative z-20 mt-4">
            <div className="text-xs font-code text-[var(--on-surface-variant)]">PROJECT // 01</div>
            <div className="font-headline text-lg font-bold">KINETIC_DASHBOARD</div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-surface-container-low border border-surface-container-high p-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-xs font-code text-kinetic-primary mb-4">{t.uiEngine}</div>
          <div className="font-headline text-xl font-bold mb-4">GRID_ARCHITECT_v2</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i} 
                className="h-24 bg-kinetic-primary/20 border border-kinetic-primary/40"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
            ))}
          </div>
          <p className="text-xs font-code text-[var(--on-surface-variant)]">
            {t.proceduralUi}
          </p>
        </motion.div>
      </div>

      {/* Execution Stack */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline text-2xl font-bold uppercase tracking-wider">{t.executionStack}</h2>
          <span className="text-xs font-code text-[var(--on-surface-variant)]">{t.technicalCapabilities}</span>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp}>
            <FeatureItem 
              number="01" 
              title={t.reactiveCore}
              description={t.reactiveCoreDesc}
              items={["STATE MANAGEMENT ORCHESTRATION", "CUSTOM STRUCTURAL DIRECTIVES", "ZONE-LESS PERFORMANCE OPTIMIZATION"]}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FeatureItem 
              number="02" 
              title={t.industrialUi}
              description={t.industrialUiDesc}
              items={["DESIGN SYSTEM TOKENIZATION", "ADVANCED CSS/SVG ANIMATIONS", "RESPONSIVE MICRO-LAYOUTS"]}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FeatureItem 
              number="03" 
              title={t.developerUx}
              description={t.developerUxDesc}
              items={["ATOMIC DESIGN STRUCTURE", "SEMANTIC HTML5/ARIA", "BUNDLE SIZE OPTIMIZATION"]}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================
// BACKEND SECTION
// ============================================
function BackendSection({ dict }: { dict: Dictionary }) {
  const t = dict.skillsPage.backend
  const terminalLines = [
    "[SYS_MONITOR] Connected to cluster-01...",
    "[HEALTH] Nodes active: 14/14",
    "[METRIC] Latency p99: 14ms",
    "[METRIC] Throughput: 45k req/sec",
    "[ALERT] Auto-scaling event triggered: scale-up +2"
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs font-code text-kinetic-primary mb-4">{t.label}</div>
          <h1 className="font-headline text-5xl md:text-6xl font-bold mb-2">{t.title1}</h1>
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-kinetic-primary mb-2">{t.title2}</h1>
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-kinetic-primary mb-6">{t.title3}</h1>
          <p className="text-[var(--on-surface-variant)] text-lg leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-xs font-code text-[var(--on-surface-variant)] mb-2">{t.techStack}</div>
          <motion.div 
            className="flex items-center justify-between py-2 border-b border-surface-container-high"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="font-body">Golang</span>
            <span className="text-xs font-code text-kinetic-primary">{t.highConcurrency}</span>
          </motion.div>
          <motion.div 
            className="flex items-center justify-between py-2 border-b border-surface-container-high"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="font-body">Node.js (Nest/Fastify)</span>
            <span className="text-xs font-code text-kinetic-primary">{t.dxOptimized}</span>
          </motion.div>
          <motion.div 
            className="flex items-center justify-between py-2 border-b border-surface-container-high"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-body">Java Spring Boot</span>
            <span className="text-xs font-code text-kinetic-primary">{t.enterpriseGrade}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* System Architecture Blueprint */}
      <div>
        <h2 className="font-headline text-2xl font-bold uppercase tracking-wider mb-2">{t.systemArchitecture}</h2>
        <p className="text-xs font-code text-[var(--on-surface-variant)] mb-8">{t.schemaVersion}</p>

        <motion.div 
          className="grid lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* API Gateway */}
          <motion.div variants={fadeUp}>
            <ArchitectureCard icon={Network} title={t.apiGateway}>
              <p className="text-sm text-[var(--on-surface-variant)]">
                {t.apiGatewayDesc}
              </p>
            </ArchitectureCard>
          </motion.div>

          {/* Modular Microservices */}
          <motion.div variants={fadeUp} className="bg-surface-container-low border border-surface-container-high p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline text-sm font-semibold uppercase tracking-wider">{t.modularMicroservices}</h4>
              <span className="text-xs font-code px-2 py-1 bg-kinetic-primary text-surface-container-lowest">{t.kubernetesOrchestrated}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ServiceBox label="ORDER_SVC" />
              <ServiceBox label="AUTH_SVC" />
              <ServiceBox label="PAYMENT_SVC" />
              <ServiceBox label="NOTIF_SVC" />
            </div>
          </motion.div>

          {/* Kafka Bus */}
          <motion.div variants={fadeUp}>
            <ArchitectureCard icon={RefreshCw} title={t.kafkaBus}>
              <p className="text-sm text-[var(--on-surface-variant)]">
                {t.kafkaBusDesc}
              </p>
            </ArchitectureCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Persistence Layer & Terminal */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-surface-container-low border border-surface-container-high p-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-kinetic-primary" />
            <h4 className="font-headline text-sm font-semibold uppercase tracking-wider">{t.persistenceLayer}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.relational}</div>
              <div className="font-body font-semibold">PostgreSQL</div>
            </div>
            <div>
              <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.cache}</div>
              <div className="font-body font-semibold">Redis Cluster</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.search}</div>
            <div className="font-body font-semibold">Elasticsearch</div>
          </div>
        </motion.div>

        <TerminalLog lines={terminalLines} />
      </div>

      {/* Engineering Patterns */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-headline text-2xl font-bold uppercase tracking-wider mb-8">{t.engineeringPatterns}</h2>
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              <FeatureItem
                number="01"
                title={t.solidClean}
                description={t.solidCleanDesc}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <FeatureItem
                number="02"
                title={t.cqrsEvent}
                description={t.cqrsEventDesc}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <FeatureItem
                number="03"
                title={t.ddd}
                description={t.dddDesc}
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-64 bg-surface-container-low border border-surface-container-high overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent z-10" />
            <Image 
              src="/placeholder.svg" 
              alt="Server Architecture" 
              fill 
              className="object-cover opacity-50"
            />
          </div>
          <div className="bg-kinetic-primary p-6 text-surface-container-lowest">
            <div className="text-xs font-code mb-2">{t.quoteLog}</div>
            <p className="font-body italic">
              "{t.quote}"
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================
// DATABASE SECTION
// ============================================
function DatabaseSection({ dict }: { dict: Dictionary }) {
  const t = dict.skillsPage.database
  const prismaCode = `model OptimizationLog {
  id        String   @id @default(uuid())
  queryTime Int      @default(0)
  status    String   @default("ACTIVE")
  createdAt DateTime @default(now())

  @@index([status, createdAt])
}`

  const chartHeights = [65, 45, 80, 60, 90, 70, 55, 75, 85, 50, 95, 40]

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-xs font-code text-kinetic-primary mb-4">{t.label}</div>
        <h1 className="font-headline text-5xl md:text-6xl font-bold mb-2">{t.title1}</h1>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-kinetic-primary mb-6">{t.title2}</h1>
        <p className="text-[var(--on-surface-variant)] text-lg leading-relaxed max-w-3xl">
          {t.description}
        </p>
      </motion.div>

      {/* Live Throughput */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2 bg-surface-container-low border border-surface-container-high p-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-headline text-xl font-bold">{t.liveThroughput}</h3>
              <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.latency}: 12MS // {t.read}: 4.2K OPS/S</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.monitorActive}</div>
              <div className="text-3xl font-headline font-bold text-kinetic-primary">
                <AnimatedNumber value={99.98} suffix="%" />
              </div>
              <div className="text-xs font-code text-[var(--on-surface-variant)]">{t.uptimeStability}</div>
            </div>
          </div>
          
          {/* Animated Chart Visualization */}
          <AnimatedBarChart heights={chartHeights} />
          <div className="flex items-center gap-6 mt-4 text-xs font-code">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-kinetic-primary" /> PostgreSQL Nodes
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-kinetic-secondary/50" /> Redis Cache Hit
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-surface-container-low border border-surface-container-high p-4">
            <div className="text-xs font-code text-[var(--on-surface-variant)] mb-3">{t.engineStack}</div>
            <div className="space-y-3">
              {[
                { name: "PostgreSQL", tag: "RELATIONAL" },
                { name: "MongoDB", tag: "DOCUMENT" },
                { name: "Redis", tag: "IN-MEMORY" },
                { name: "MySQL", tag: "LEGACY_COMPAT" },
              ].map((db, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="font-body">{db.name}</span>
                  <span className="text-xs font-code text-kinetic-primary">{db.tag}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low border border-surface-container-high p-4">
            <div className="text-xs font-code text-[var(--on-surface-variant)] mb-2">{t.ormPreference}</div>
            <div className="font-code text-kinetic-primary">
              import &#123; Prisma &#125;<br />
              from<br />
              '@prisma/client'
            </div>
          </div>
        </motion.div>
      </div>

      {/* Core Capabilities */}
      <div>
        <h2 className="font-headline text-2xl font-bold uppercase tracking-wider mb-8">{t.coreCapabilities}</h2>
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="text-center">
            <motion.div 
              className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-surface-container-high"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Zap className="w-6 h-6 text-kinetic-primary" />
            </motion.div>
            <h4 className="font-headline font-bold mb-2">{t.optimizedSearches}</h4>
            <p className="text-sm text-[var(--on-surface-variant)] mb-4">
              {t.optimizedSearchesDesc}
            </p>
            <div className="text-xs font-code text-[var(--on-surface-variant)]">// EXPLAIN ANALYZE</div>
          </motion.div>
          <motion.div variants={fadeUp} className="text-center">
            <motion.div 
              className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-surface-container-high"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <List className="w-6 h-6 text-kinetic-primary" />
            </motion.div>
            <h4 className="font-headline font-bold mb-2">{t.advancedIndexing}</h4>
            <p className="text-sm text-[var(--on-surface-variant)] mb-4">
              {t.advancedIndexingDesc}
            </p>
            <div className="text-xs font-code text-[var(--on-surface-variant)]">// INDEX_CONCURRENTLY</div>
          </motion.div>
          <motion.div variants={fadeUp} className="text-center">
            <motion.div 
              className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-surface-container-high"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FileCode className="w-6 h-6 text-kinetic-primary" />
            </motion.div>
            <h4 className="font-headline font-bold mb-2">{t.proceduresTriggers}</h4>
            <p className="text-sm text-[var(--on-surface-variant)] mb-4">
              {t.proceduresTriggersDesc}
            </p>
            <div className="text-xs font-code text-[var(--on-surface-variant)]">// ACID_COMPLIANCE</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Prisma ORM Expert */}
      <motion.div 
        className="bg-surface-container-low border border-surface-container-high p-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-headline text-2xl font-bold mb-2">
              {t.prismaExpert} <span className="text-kinetic-primary">{t.expert}</span>
            </h3>
            <p className="text-[var(--on-surface-variant)] mb-6">
              {t.prismaDesc}
            </p>
            <div className="space-y-3">
              {["STRICT TYPE SAFETY", "AUTOMATED MIGRATIONS", "QUERY OPTIMIZATION (N+1 PREVENTION)"].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-kinetic-primary"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                  />
                  <span className="text-sm font-code">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <CodeBlock code={prismaCode} filename="schema.prisma" />
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// CLOUD SECTION
// ============================================
function CloudSection({ dict }: { dict: Dictionary }) {
  const t = dict.skillsPage.cloud
  const pulumiCode = `import * as aws from "@pulumi/aws";

export const vpc = new aws.ec2.Vpc("kinetic-vpc", {
  cidrBlock: "10.0.0.0/16",
  enableDnsHostnames: true,
  tags: { Name: "PROD_ENVIRONMENT" },
});

const cluster = new aws.ecs.Cluster("platform-core", {
  relArn: eksRole.arn,
  vpcConfig: { subnetIds: vpc.publicSubnetIds },
});`

  const terminalLines = [
    "[INFO] 2024-08-24 14:20:01 // NODE_01 // STATUS_OK",
    "[INFO] 2024-08-24 14:20:04 // NODE_02 // STATUS_OK",
    "[METRIC] Latency: Threshold check..... pass (204ms p99)",
    "[TRACE] Span ID 7D-9FA01... propagation to 3 svcs.ims"
  ]

  const projects = [
    {
      id: "PROJECT_A",
      title: t.projectA,
      description: t.projectADesc
    },
    {
      id: "PROJECT_B",
      title: t.projectB,
      description: t.projectBDesc
    },
    {
      id: "PROJECT_C",
      title: t.projectC,
      description: t.projectCDesc
    }
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-xs font-code text-kinetic-primary mb-4 flex items-center gap-2">
          <motion.div 
            className="w-1 h-4 bg-kinetic-primary"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />
          {t.label}
        </div>
        <h1 className="font-headline text-5xl md:text-6xl font-bold mb-2">{t.title1}</h1>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-kinetic-primary mb-6">{t.title2}</h1>
        <p className="text-[var(--on-surface-variant)] text-lg leading-relaxed max-w-3xl">
          {t.description}
        </p>
      </motion.div>

      {/* Provisioning Engine */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="w-5 h-5 text-kinetic-primary" />
            <h3 className="font-headline text-xl font-bold uppercase">{t.provisioningEngine}</h3>
          </div>
          <CodeBlock code={pulumiCode} filename="infrastructure.ts" />
          <div className="flex gap-2 mt-4">
            <TechChip>PULUMI (TS)</TechChip>
            <TechChip>AWS_EKS</TechChip>
            <TechChip>VPC_PEERING</TechChip>
          </div>
        </motion.div>

        <motion.div 
          className="bg-kinetic-primary p-6 text-surface-container-lowest flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="w-10 h-10 mb-4 flex items-center justify-center bg-surface-container-lowest/20"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="w-5 h-5" />
          </motion.div>
          <h4 className="font-headline text-xl font-bold mb-4">{t.deterministicEnv}</h4>
          <p className="font-body opacity-90">
            {t.deterministicEnvDesc}
          </p>
        </motion.div>
      </div>

      {/* Architecture Visualizer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="font-code">├─</span>
            <span className="font-headline font-bold uppercase">{t.architectureVisualizer}</span>
            <span className="font-code text-[var(--on-surface-variant)]">// v1.02</span>
          </div>
          <div className="flex gap-1">
            <motion.div 
              className="w-2 h-2 bg-kinetic-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.div 
              className="w-2 h-2 bg-kinetic-secondary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            />
          </div>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: Network, label: "API_GATEWAY" },
            { icon: Server, label: "MICROSERVICES" },
            { icon: Layers, label: "PERSISTENCE_LAYER" },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp}
              className="bg-surface-container-low border border-surface-container-high p-6 text-center"
              whileHover={{ scale: 1.02, borderColor: "var(--kinetic-primary)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <item.icon className="w-10 h-10 mx-auto mb-4 text-[var(--on-surface)]" />
              </motion.div>
              <div className="text-xs font-code text-[var(--on-surface-variant)]">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="h-48 bg-surface-container-low border border-surface-container-high relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-kinetic-primary/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Observability */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-kinetic-primary" />
            <h3 className="font-headline text-xl font-bold uppercase">{t.observability}</h3>
          </div>
          <motion.div 
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              <FeatureItem
                number="01"
                title={t.jaegerTracing}
                description={t.jaegerTracingDesc}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <FeatureItem
                number="02"
                title={t.opentelemetry}
                description={t.opentelemetryDesc}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <FeatureItem
                number="03"
                title={t.grafanaDashboards}
                description={t.grafanaDashboardsDesc}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-surface-container-lowest border border-surface-container-high overflow-hidden"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-surface-container-high">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="font-code text-xs text-kinetic-primary">{t.metricExplorer}</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 text-kinetic-primary" />
            </motion.div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <AnimatedMetricCard label={t.cpuUsage} value="42.8%" numericValue={42.8} suffix="%" delay={0} />
              <AnimatedMetricCard label={t.requestLatency} value="124ms" numericValue={124} suffix="ms" delay={0.1} />
            </div>
            <motion.div 
              className="h-24 bg-surface-container-high mb-4 overflow-hidden relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {/* Animated wave line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <motion.path
                  d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50"
                  fill="none"
                  stroke="var(--kinetic-primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
            <TerminalLog lines={terminalLines} />
          </div>
        </motion.div>
      </div>

      {/* Active Deployments */}
      <motion.div 
        className="bg-surface-container-low border border-surface-container-high p-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-2xl font-bold uppercase">{t.activeDeployments}</h3>
          <span className="text-xs font-code text-[var(--on-surface-variant)]">{t.count}: 03</span>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project, i) => (
            <motion.div 
              key={i} 
              className="group cursor-pointer"
              variants={fadeUp}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-xs font-code text-[var(--on-surface-variant)] mb-2">{project.id}</div>
              <h4 className="font-headline font-bold mb-2">{project.title}</h4>
              <p className="text-sm text-[var(--on-surface-variant)] mb-4">{project.description}</p>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowRight className="w-5 h-5 text-[var(--on-surface-variant)] group-hover:text-kinetic-primary transition-colors" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

// ============================================
// SKILLS PAGE CONTENT (with useSearchParams)
// ============================================
function SkillsPageContent({ params }: { params: Promise<{ lang: Locale }> }) {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as TabType | null
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl || 'frontend')
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [currentLocale, setCurrentLocale] = useState<Locale>("en")

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params
      setCurrentLocale(resolvedParams.lang)
      const dictionary = await getDictionary(resolvedParams.lang)
      setDict(dictionary as unknown as Dictionary)
    }
    loadData()
  }, [params])

  // Update active tab when URL param changes
  useEffect(() => {
    if (tabFromUrl && ['frontend', 'backend', 'database', 'cloud'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  if (!dict) {
    return (
      <div className="min-h-screen bg-surface text-[var(--on-surface)] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-kinetic-primary border-t-transparent animate-spin" />
          <p className="font-code text-kinetic-primary">Initializing...</p>
        </motion.div>
      </div>
    )
  }

  const t = dict.skillsPage.sidebar

  const tabs: { id: TabType; label: string }[] = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'database', label: 'Database' },
    { id: 'cloud', label: 'Cloud' },
  ]

  const sidebarItems: SidebarItem[] = [
    { id: 'architecture', icon: Settings, label: t.architecture },
    { id: 'systems', icon: Hash, label: t.systems },
    { id: 'data', icon: Database, label: t.data },
    { id: 'infrastructure', icon: Cloud, label: t.infrastructure },
  ]

  return (
    <div className="min-h-screen bg-surface text-[var(--on-surface)] flex">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-48 bg-surface-container-lowest border-r border-surface-container-high z-40 flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-surface-container-high">
          <Link href={`/${currentLocale}`} className="font-headline text-kinetic-primary font-bold">
            KINETIC_CORE
          </Link>
          <div className="text-xs font-code text-[var(--on-surface-variant)] mt-1">{t.rootDir}</div>
          <div className="text-xs font-code text-kinetic-primary">{t.version}</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = 
              (item.id === 'architecture' && activeTab === 'frontend') ||
              (item.id === 'systems' && activeTab === 'backend') ||
              (item.id === 'data' && activeTab === 'database') ||
              (item.id === 'infrastructure' && activeTab === 'cloud')
            
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  if (item.id === 'architecture') setActiveTab('frontend')
                  if (item.id === 'systems') setActiveTab('backend')
                  if (item.id === 'data') setActiveTab('database')
                  if (item.id === 'infrastructure') setActiveTab('cloud')
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm font-code transition-colors text-left
                  ${isActive 
                    ? 'bg-kinetic-primary text-surface-container-lowest' 
                    : 'text-[var(--on-surface-variant)] hover:text-kinetic-primary hover:bg-surface-container-high'
                  }
                `}
                whileHover={{ x: isActive ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.button>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-surface-container-high space-y-3">
          <Link 
            href={`/${currentLocale}#contact`}
            className="block w-full py-2 px-4 bg-kinetic-primary text-surface-container-lowest text-center font-code text-sm font-medium hover:bg-kinetic-primary/90 transition-colors"
          >
            {t.hireMe}
          </Link>
          <div className="flex items-center gap-3 text-[var(--on-surface-variant)]">
            <button className="hover:text-kinetic-primary transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <span className="text-xs font-code">{t.settings}</span>
          </div>
          <div className="flex items-center gap-3 text-[var(--on-surface-variant)]">
            <button className="hover:text-kinetic-primary transition-colors">
              <Terminal className="w-4 h-4" />
            </button>
            <span className="text-xs font-code">{t.logs}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-48">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-surface border-b border-surface-container-high">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <nav className="flex items-center gap-3 lg:gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    font-code text-xs lg:text-sm transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'text-kinetic-primary border-b-2 border-kinetic-primary pb-1' 
                      : 'text-[var(--on-surface-variant)] hover:text-kinetic-primary'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2 lg:gap-4">
              <LanguageSwitcher currentLocale={currentLocale} />
              <Link 
                href={`/${currentLocale}`}
                className="hidden sm:flex px-3 py-1 border border-surface-container-high text-xs font-code hover:border-kinetic-primary hover:text-kinetic-primary transition-colors items-center gap-2"
              >
                <Terminal className="w-3 h-3" />
                {t.rootAccess}
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'frontend' && <FrontendSection dict={dict} />}
              {activeTab === 'backend' && <BackendSection dict={dict} />}
              {activeTab === 'database' && <DatabaseSection dict={dict} />}
              {activeTab === 'cloud' && <CloudSection dict={dict} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-surface-container-high px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between text-xs font-code text-[var(--on-surface-variant)]">
            <span>{dict.skillsPage.footer.copyright}</span>
            <div className="flex items-center gap-4">
              <Link href="https://github.com/johnnyFR26" className="hover:text-kinetic-primary transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-kinetic-primary transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-kinetic-primary transition-colors">Source</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

// ============================================
// LOADING FALLBACK COMPONENT
// ============================================
function SkillsLoadingFallback() {
  return (
    <div className="min-h-screen bg-surface text-[var(--on-surface)] flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-2 border-kinetic-primary border-t-transparent animate-spin" />
        <p className="font-code text-kinetic-primary">Initializing...</p>
      </motion.div>
    </div>
  )
}

// ============================================
// MAIN SKILLS PAGE COMPONENT (with Suspense)
// ============================================
export default function SkillsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <Suspense fallback={<SkillsLoadingFallback />}>
      <SkillsPageContent params={params} />
    </Suspense>
  )
}
