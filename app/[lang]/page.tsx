"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink, Mail, Linkedin, Twitter, Code, Star, GitFork, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"

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

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

// Skills component
function SkillBar({ skill, level, delay = 0 }: { skill: string; level: number; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-300 font-medium">{skill}</span>
        <span className="text-blue-400">{level}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out ${
            isVisible ? `w-[${level}%]` : "w-0"
          }`}
          style={{ width: isVisible ? `${level}%` : "0%" }}
        />
      </div>
    </div>
  )
}

// GitHub API functions
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

export default function Portfolio({ params }: { params: Promise<{ lang: Locale }> }) {
  const [isVisible, setIsVisible] = useState(false)
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

      // Load dictionary
      const dictionary = await getDictionary(resolvedParams.lang)
      setDict(dictionary)

      setIsVisible(true)

      // Fetch GitHub data
      setLoading(true)
      const [user, repos] = await Promise.all([fetchGitHubUser(GITHUB_USERNAME), fetchGitHubRepos(GITHUB_USERNAME)])

      if (user) setGithubUser(user)
      if (repos.length > 0) {
        setGithubRepos(repos)
        setLanguageStats(calculateLanguageStats(repos))
      }
      setLoading(false)

      // Fetch projects data
      const projectsData: Project[] = [
        {
          title: "Animaldle",
          description: "Game of guessing animals",
          tech: ["Angular", "TypeScript", "Adonis"],
          image: "/placeholder.svg",
          gitHubUrl: "https://github.com/johnnyFR26/animaldle",
          liveUrl: "https://animaldle-etec.vercel.app/",
        },
        {
          title: "Finanz",
          description: "Financial management app with AI assistant",
          tech: ["Angular", "TypeScript", "Fastify", "GraphQL", "Prisma", "n8n"],
          image: "/placeholder.svg",
          gitHubUrl: "https://github.com/johnnyFR26/finanz",
          liveUrl: "https://finanz-beta.vercel.app/",
        },
      ]
      setProjects(projectsData)
    }

    loadData()
  }, [params])

  if (!dict) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const skills = {
    [dict.skills.frontend]: [
      { name: "Angular", level: 100 },
      { name: "React/Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 88 },
    ],
    [dict.skills.backend]: [
      { name: "Node.js", level: 100 },
      { name: "Go", level: 80 },
      { name: "NoSQL", level: 78 },
      { name: "PostgreSQL", level: 82 },
    ],
    [dict.skills.toolsOthers]: [
      { name: "Git/GitHub", level: 92 },
      { name: "Docker", level: 75 },
      { name: "AWS", level: 70 },
      { name: "Pulumi & Terraform", level: 73 },
    ],
  }

  const totalStars = githubRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = githubRepos.reduce((sum, repo) => sum + repo.forks_count, 0)

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([lang, count]) => ({
      lang,
      percent: Math.round((count / githubRepos.length) * 100),
      color: getLanguageColor(lang),
    }))

  const stats = [
    { label: dict.about.stats.projectsCompleted, value: 50, suffix: "+" },
    { label: dict.about.stats.githubRepos, value: githubUser?.public_repos || 0, suffix: "" },
    { label: dict.about.stats.totalStars, value: totalStars, suffix: "" },
    { label: dict.about.stats.followers, value: githubUser?.followers || 0, suffix: "" },
  ]

  function getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      "C++": "bg-purple-500",
      HTML: "bg-orange-400",
      CSS: "bg-blue-400",
      PHP: "bg-indigo-500",
    }
    return colors[language] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {"<Dev />"}
          </div>
          <div className="flex items-center gap-6">
            <Link href="#about" className="hover:text-blue-400 transition-colors">
              {dict.nav.about}
            </Link>
            <Link href="#projects" className="hover:text-blue-400 transition-colors">
              {dict.nav.projects}
            </Link>
            <Link href="#contact" className="hover:text-blue-400 transition-colors">
              {dict.nav.contact}
            </Link>
            <LanguageSwitcher currentLocale={currentLocale} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center">
                  <Code className="w-12 h-12 text-blue-400" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {dict.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">{dict.hero.description}</p>
            <div className="flex gap-4 justify-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                {dict.hero.getInTouch}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <Github className="w-4 h-4 mr-2" />
                {dict.hero.viewGithub}
              </Button>
            </div>
            <div className="flex gap-6 justify-center">
              <Link href="https://github.com/johnnyFR26" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {dict.about.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* GitHub Stats */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Github className="w-5 h-5" />
                  {dict.about.github.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        {dict.about.github.totalRepositories}
                      </span>
                      <span className="text-blue-400 font-semibold">{githubUser?.public_repos || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        {dict.about.github.totalStars}
                      </span>
                      <span className="text-yellow-400 font-semibold">{totalStars}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 flex items-center gap-2">
                        <GitFork className="w-4 h-4" />
                        {dict.about.github.totalForks}
                      </span>
                      <span className="text-green-400 font-semibold">{totalForks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {dict.about.github.followers}
                      </span>
                      <span className="text-purple-400 font-semibold">{githubUser?.followers || 0}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Code className="w-5 h-5" />
                  {dict.about.languages.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex justify-between mb-1">
                          <div className="h-4 bg-gray-700 rounded w-20"></div>
                          <div className="h-4 bg-gray-700 rounded w-10"></div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topLanguages.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{item.lang}</span>
                          <span className="text-gray-400">{item.percent}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {dict.skills.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, skillList], categoryIndex) => (
              <Card key={category} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  {skillList.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill.name}
                      level={skill.level}
                      delay={categoryIndex * 200 + index * 100}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {dict.projects.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <CardDescription className="text-gray-300">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-gray-700 text-gray-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                    >
                      <Link href={project.gitHubUrl}>
                      <Github className="w-4 h-4 mr-2" />
                      {dict.projects.code}
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Link href={project.liveUrl}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {dict.projects.liveDemo}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {dict.contact.title}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{dict.contact.description}</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            {dict.contact.startConversation}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Your Name. {dict.footer.builtWith}
          </p>
        </div>
      </footer>
    </div>
  )
}
