"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Github, ExternalLink, Mail, Linkedin, Twitter, Code, Star, GitFork, Users, Terminal, Cpu, Database, Cloud, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"

// ============================================
// TYPE DEFINITIONS
// ============================================
interface GitHubUser {
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface GitHubRepo {
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  html_url: string
  homepage?: string
}

interface LanguageStats {
  [key: string]: number
}

interface Project {
  title: string
  description: string
  tech: string[]
  image?: string
  gitHubUrl: string
  liveUrl: string
}

// ============================================
// ANIMATION VARIANTS (Kinetic Precision)
// ============================================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
}

const kineticSlide = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
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
// TERMINAL CURSOR COMPONENT
// ============================================
function TerminalCursor() {
  return (
    <span className="inline-block w-3 h-6 bg-kinetic-primary ml-1 animate-terminal-blink" />
  )
}

// ============================================
// KINETIC COUNTER COMPONENT
// ============================================
function KineticCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, hasStarted])

  return (
    <span ref={ref} className="font-code text-kinetic-primary">
      {count}{suffix}
    </span>
  )
}

// ============================================
// KINETIC SKILL BAR COMPONENT
// ============================================
function KineticSkillBar({ skill, level, delay = 0 }: { skill: string; level: number; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="mb-4 group">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-body text-[var(--on-surface)] group-hover:text-kinetic-primary transition-colors duration-300">
          {skill}
        </span>
        <span className="font-code text-kinetic-primary">{level}%</span>
      </div>
      <div className="w-full h-1 bg-surface-container-high overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-kinetic-primary to-kinetic-secondary"
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${level}%` : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
        />
      </div>
    </div>
  )
}

// ============================================
// KINETIC PROJECT CARD COMPONENT
// ============================================
function KineticProjectCard({ project, index, dict }: { project: Project; index: number; dict: any }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={scaleIn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-surface-container-low border-0 overflow-hidden"
      style={{ boxShadow: isHovered ? '0 0 30px rgba(0, 245, 255, 0.15)' : 'none' }}
    >
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kinetic-primary to-transparent animate-scan-line" />
        </div>
      )}
      
      <div className="relative overflow-hidden h-48">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={400}
          height={200}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/90 backdrop-blur-sm flex items-center justify-center gap-3 p-4"
            >
              <Link
                href={project.gitHubUrl}
                className="btn-kinetic flex items-center gap-2 px-4 py-2 text-sm"
              >
                <Github className="w-4 h-4" />
                {dict.projects.code}
              </Link>
              <Link
                href={project.liveUrl}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-kinetic-primary to-kinetic-secondary text-surface-container-lowest font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                {dict.projects.liveDemo}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6">
        <h3 className="font-headline text-xl text-[var(--on-surface)] mb-2 group-hover:text-kinetic-primary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="font-body text-sm text-[var(--on-surface-variant)] mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech, techIndex) => (
            <span key={techIndex} className="chip-kinetic text-xs">{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// KINETIC STAT CARD COMPONENT
// ============================================
function KineticStatCard({ label, value, suffix, icon: Icon }: { label: string; value: number; suffix: string; icon?: any }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4 }}
      className="card-kinetic p-6 text-center group"
    >
      {Icon && (
        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-surface-container-high group-hover:bg-kinetic-primary/10 transition-colors duration-300">
          <Icon className="w-6 h-6 text-kinetic-primary" />
        </div>
      )}
      <div className="text-3xl md:text-4xl font-headline font-bold mb-2">
        <KineticCounter end={value} suffix={suffix} />
      </div>
      <div className="font-body text-sm text-[var(--on-surface-variant)]">{label}</div>
    </motion.div>
  )
}

// ============================================
// KINETIC NAV COMPONENT
// ============================================
function KineticNav({ dict, currentLocale }: { dict: any; currentLocale: Locale }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-surface-container-high' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.05 }} className="font-headline text-xl font-bold">
          <span className="text-kinetic-primary">&lt;</span>
          <span className="text-[var(--on-surface)]">Dev</span>
          <span className="text-kinetic-secondary">/</span>
          <span className="text-kinetic-primary">&gt;</span>
        </motion.div>
        
        <div className="flex items-center gap-8">
          {['about', 'projects', 'contact'].map((section) => (
            <Link key={section} href={`#${section}`} className="nav-kinetic font-body text-sm uppercase tracking-wider">
              {dict.nav[section]}
            </Link>
          ))}
          <LanguageSwitcher currentLocale={currentLocale} />
        </div>
      </div>
    </motion.nav>
  )
}

// ============================================
// KINETIC HERO COMPONENT
// ============================================
function KineticHero({ dict }: { dict: any }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const y2 = useTransform(scrollY, [0, 500], [0, 100])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ y }} className="absolute top-1/4 -left-32 w-96 h-96 bg-kinetic-primary/10 blur-[100px]" />
        <motion.div style={{ y: y2 }} className="absolute bottom-1/4 -right-32 w-96 h-96 bg-kinetic-secondary/10 blur-[100px]" />
      </div>

      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={kineticSlide} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low font-code text-sm text-kinetic-primary">
              <Terminal className="w-4 h-4" />
              <span>~/portfolio</span>
              <TerminalCursor />
            </span>
          </motion.div>

          <motion.div variants={scaleIn} className="mb-8">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-kinetic-primary to-kinetic-secondary opacity-20 animate-glow-pulse" />
              <div className="w-full h-full bg-surface-container-low flex items-center justify-center border border-surface-container-high">
                <Code className="w-12 h-12 text-kinetic-primary" />
              </div>
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text">{dict.hero.title}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="font-body text-xl md:text-2xl text-[var(--on-surface-variant)] mb-12 max-w-3xl mx-auto">
            {dict.hero.description}
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-4 justify-center mb-12">
            <Link href="#contact" className="btn-kinetic flex items-center gap-2 px-8 py-4 text-lg font-medium">
              <Mail className="w-5 h-5" />
              {dict.hero.getInTouch}
            </Link>
            <Link
              href="https://github.com/johnnyFR26"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 text-lg font-medium border border-surface-container-high bg-surface-container-low text-[var(--on-surface)] hover:border-kinetic-primary hover:text-kinetic-primary transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              {dict.hero.viewGithub}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-6 justify-center">
            {[
              { icon: Github, href: "https://github.com/johnnyFR26" },
              { icon: Linkedin, href: "#" },
              { icon: Twitter, href: "#" }
            ].map(({ icon: Icon, href }, index) => (
              <Link
                key={index}
                href={href}
                className="w-12 h-12 flex items-center justify-center bg-surface-container-low border border-surface-container-high text-[var(--on-surface-variant)] hover:text-kinetic-primary hover:border-kinetic-primary hover:shadow-glow-primary transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[var(--on-surface-variant)]">
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================
// GITHUB API FUNCTIONS
// ============================================
async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (!response.ok) throw new Error("Failed to fetch user")
    return await response.json()
  } catch (error) {
    console.error("Error fetching GitHub user:", error)
    return null
  }
}

async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`)
    if (!response.ok) throw new Error("Failed to fetch repos")
    return await response.json()
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    return []
  }
}

function calculateLanguageStats(repos: GitHubRepo[]): LanguageStats {
  const stats: LanguageStats = {}
  repos.forEach((repo) => {
    if (repo.language) {
      stats[repo.language] = (stats[repo.language] || 0) + 1
    }
  })
  return stats
}

// ============================================
// MAIN PORTFOLIO COMPONENT
// ============================================
export default function Portfolio({ params }: { params: Promise<{ lang: Locale }> }) {
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [languageStats, setLanguageStats] = useState<LanguageStats>({})
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [dict, setDict] = useState<any>(null)
  const [currentLocale, setCurrentLocale] = useState<Locale>("en")

  const GITHUB_USERNAME = "johnnyFR26"

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params
      setCurrentLocale(resolvedParams.lang)
      const dictionary = await getDictionary(resolvedParams.lang)
      setDict(dictionary)

      setLoading(true)
      const [user, repos] = await Promise.all([fetchGitHubUser(GITHUB_USERNAME), fetchGitHubRepos(GITHUB_USERNAME)])
      if (user) setGithubUser(user)
      if (repos.length > 0) {
        setGithubRepos(repos)
        setLanguageStats(calculateLanguageStats(repos))
      }
      setLoading(false)

      const projectsData: Project[] = [
        { title: "Animaldle", description: "Game of guessing animals", tech: ["Angular", "TypeScript", "Adonis"], image: "/placeholder.svg", gitHubUrl: "https://github.com/johnnyFR26/animaldle", liveUrl: "https://animaldle-etec.vercel.app/" },
        { title: "Finanz", description: "Financial management app with AI assistant", tech: ["Angular", "TypeScript", "Fastify", "GraphQL", "Prisma", "n8n"], image: "/placeholder.svg", gitHubUrl: "https://github.com/johnnyFR26/finanz", liveUrl: "https://finanz-beta.vercel.app/" },
        { title: "Minerva", description: "Management app of exams for universities", tech: ["Angular", "TypeScript", "Fastify", "GraphQL", "Prisma", "Nx"], image: "/placeholder.svg", gitHubUrl: "https://github.com/johnnyFR26/minerva", liveUrl: "https://minerva-staging.vercel.app/" },
        { title: "E-Commerce", description: "E-Commerce platform", tech: ["Angular", "TypeScript", "Adonis", "Restfull", "websockets"], image: "/placeholder.svg", gitHubUrl: "https://github.com/johnnyFR26/marktplace", liveUrl: "https://marketplace-dun-beta.vercel.app/mundoburguer" },
        { title: "This Portfolio", description: "Portfolio created with next", tech: ["Next.js", "TypeScript", "Tailwind CSS"], image: "/placeholder.svg", gitHubUrl: "https://github.com/johnnyFR26/portfolio-next", liveUrl: "#" },
        { title: "Discord Clone", description: "Discord clone", tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Socket.io", "Clerk"], image: "/placeholder.svg", gitHubUrl: "https://github.com/johnnyFR26/Fractus-comunity", liveUrl: "https://discordia-wm.vercel.app/" },
      ]
      setProjects(projectsData)
    }
    loadData()
  }, [params])

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

  const skills = {
    [dict.skills.frontend]: [{ name: "Angular", level: 100 }, { name: "React/Next.js", level: 95 }, { name: "TypeScript", level: 90 }, { name: "Tailwind CSS", level: 88 }],
    [dict.skills.backend]: [{ name: "Node.js", level: 100 }, { name: "Go", level: 80 }, { name: "NoSQL", level: 78 }, { name: "PostgreSQL", level: 82 }],
    [dict.skills.toolsOthers]: [{ name: "Git/GitHub", level: 92 }, { name: "Docker", level: 75 }, { name: "AWS", level: 70 }, { name: "Pulumi & Terraform", level: 73 }],
  }

  const totalStars = githubRepos.reduce((sum: number, repo: GitHubRepo) => sum + repo.stargazers_count, 0)
  const totalForks = githubRepos.reduce((sum: number, repo: GitHubRepo) => sum + repo.forks_count, 0)
  const topLanguages = Object.entries(languageStats).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 4).map(([lang, count]) => ({ lang, percent: Math.round(((count as number) / githubRepos.length) * 100) }))
  const stats = [
    { label: dict.about.stats.projectsCompleted, value: 50, suffix: "+", icon: Cpu },
    { label: dict.about.stats.githubRepos, value: githubUser?.public_repos || 0, suffix: "", icon: Code },
    { label: dict.about.stats.totalStars, value: totalStars, suffix: "", icon: Star },
    { label: dict.about.stats.followers, value: githubUser?.followers || 0, suffix: "", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-surface text-[var(--on-surface)]">
      <KineticNav dict={dict} currentLocale={currentLocale} />
      <KineticHero dict={dict} />

      {/* Stats Section */}
      <section id="about" className="py-24 px-6 bg-surface-container-lowest">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">{dict.about.title}</span></h2>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-kinetic-primary to-kinetic-secondary" />
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat, index) => (<KineticStatCard key={index} {...stat} />))}
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={kineticSlide} className="card-kinetic p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center bg-kinetic-primary/10"><Github className="w-5 h-5 text-kinetic-primary" /></div>
                  <h3 className="font-headline text-xl font-semibold">{dict.about.github.title}</h3>
                </div>
                {loading ? (
                  <div className="space-y-4">{[...Array(4)].map((_, i) => (<div key={i} className="h-6 bg-surface-container-high animate-pulse" />))}</div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { icon: Code, label: dict.about.github.totalRepositories, value: githubUser?.public_repos || 0, color: 'text-kinetic-primary' },
                      { icon: Star, label: dict.about.github.totalStars, value: totalStars, color: 'text-yellow-400' },
                      { icon: GitFork, label: dict.about.github.totalForks, value: totalForks, color: 'text-green-400' },
                      { icon: Users, label: dict.about.github.followers, value: githubUser?.followers || 0, color: 'text-kinetic-secondary' },
                    ].map(({ icon: Icon, label, value, color }, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-surface-container-high last:border-0">
                        <span className="flex items-center gap-3 text-[var(--on-surface-variant)]"><Icon className="w-4 h-4" />{label}</span>
                        <span className={`font-code font-semibold ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div variants={kineticSlide} className="card-kinetic p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center bg-kinetic-secondary/10"><Terminal className="w-5 h-5 text-kinetic-secondary" /></div>
                  <h3 className="font-headline text-xl font-semibold">{dict.about.languages.title}</h3>
                </div>
                {loading ? (
                  <div className="space-y-4">{[...Array(4)].map((_, i) => (<div key={i} className="h-8 bg-surface-container-high animate-pulse" />))}</div>
                ) : (
                  <div className="space-y-4">
                    {topLanguages.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-body text-[var(--on-surface)]">{item.lang}</span>
                          <span className="font-code text-kinetic-primary">{item.percent}%</span>
                        </div>
                        <div className="w-full h-1 bg-surface-container-high overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-kinetic-primary to-kinetic-secondary" initial={{ width: 0 }} whileInView={{ width: `${item.percent}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 px-6 bg-surface">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">{dict.skills.title}</span></h2>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-kinetic-primary to-kinetic-secondary" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(skills).map(([category, skillList], categoryIndex) => (
                <motion.div key={category} variants={scaleIn} className="card-kinetic p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 flex items-center justify-center ${categoryIndex === 0 ? 'bg-kinetic-primary/10' : categoryIndex === 1 ? 'bg-kinetic-secondary/10' : 'bg-green-500/10'}`}>
                      {categoryIndex === 0 && <Code className="w-5 h-5 text-kinetic-primary" />}
                      {categoryIndex === 1 && <Database className="w-5 h-5 text-kinetic-secondary" />}
                      {categoryIndex === 2 && <Cloud className="w-5 h-5 text-green-500" />}
                    </div>
                    <h3 className="font-headline text-lg font-semibold">{category}</h3>
                  </div>
                  {skillList.map((skill: { name: string; level: number }, index: number) => (
                    <KineticSkillBar key={skill.name} skill={skill.name} level={skill.level} delay={categoryIndex * 200 + index * 100} />
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-surface-container-lowest">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">{dict.projects.title}</span></h2>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-kinetic-primary to-kinetic-secondary" />
            </motion.div>

            <motion.div variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (<KineticProjectCard key={index} project={project} index={index} dict={dict} />))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-surface relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-kinetic-primary/5 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kinetic-secondary/5 blur-[100px]" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={staggerContainer} className="text-center max-w-2xl mx-auto">
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">{dict.contact.title}</span></h2>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-kinetic-primary to-kinetic-secondary mb-8" />
              <p className="font-body text-xl text-[var(--on-surface-variant)]">{dict.contact.description}</p>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link href="mailto:contact@example.com" className="inline-flex items-center gap-3 px-10 py-5 text-lg font-medium bg-gradient-to-r from-kinetic-primary to-kinetic-secondary text-surface-container-lowest hover:shadow-glow-primary transition-all duration-300">
                <Mail className="w-5 h-5" />
                {dict.contact.startConversation}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-surface-container-lowest border-t border-surface-container-high">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-sm text-[var(--on-surface-variant)]">&copy; {new Date().getFullYear()} Johnny Fontes Rabelo. {dict.footer.builtWith}</p>
            <div className="flex items-center gap-2">
              <span className="font-code text-xs text-kinetic-primary">v1.0.0</span>
              <span className="text-surface-container-high">|</span>
              <span className="font-code text-xs text-[var(--on-surface-variant)]">Kinetic Precision Design System</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
