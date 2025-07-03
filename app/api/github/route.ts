import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username") || "octocat"

  try {
    // Fetch user data and repositories in parallel
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Add your GitHub token here for higher rate limits
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
      }),
    ])

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error("Failed to fetch GitHub data")
    }

    const [userData, reposData] = await Promise.all([userResponse.json(), reposResponse.json()])

    // Calculate language statistics
    const languageStats: { [key: string]: number } = {}
    reposData.forEach((repo: any) => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1
      }
    })

    // Calculate totals
    const totalStars = reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0)
    const totalForks = reposData.reduce((sum: number, repo: any) => sum + repo.forks_count, 0)

    return NextResponse.json({
      user: userData,
      repos: reposData,
      stats: {
        totalStars,
        totalForks,
        languageStats,
      },
    })
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 })
  }
}
