import * as cheerio from 'cheerio'

export interface TrendingRepository {
    author: string
    name: string
    url: string
    description: string
    stars: number
    forks: number
    newStars: number
    language: string
}

export interface GithubTrendsOptions {
    language?: string
    period?: string
    spokenLanguageCode?: string
}

export async function fetchGitHubTrends(
    options?: GithubTrendsOptions,
): Promise<TrendingRepository[]> {
    const baseUrl = 'https://github.com/trending'
    const urlObj = new URL(baseUrl)
    if (options?.language) urlObj.pathname += `/${options.language}`
    if (options?.period) urlObj.searchParams.set('since', options.period)
    if (options?.spokenLanguageCode)
        urlObj.searchParams.set(
            'spoken_language_code',
            options.spokenLanguageCode,
        )
    const ghUrl = urlObj.toString()

    const response = await fetch(ghUrl)
    const html = await response.text()
    const $ = cheerio.load(html)

    const repos: TrendingRepository[] = []

    $('.Box-row').each((_, element) => {
        const $element = $(element)

        const nameLink = $element.find('h2 a')
        const href = nameLink.attr('href') || ''
        const fullName = href.replace(/^\/|\/$/g, '') // Remove leading/trailing slashes
        const [author, name] = fullName.split('/')
        const repoUrl = `https://github.com${href}`

        const description = $element.find('p').text().trim()

        const starsText = $element
            .find('a[href$="/stargazers"]')
            .text()
            .trim()
        const stars = parseInt(starsText.replace(/,/g, ''), 10) || 0

        const forksText = $element.find('a[href$="/forks"]').text().trim()
        const forks = parseInt(forksText.replace(/,/g, ''), 10) || 0

        const newStarsText = $element
            .find('.d-inline-block.float-sm-right')
            .text()
            .trim()
        const newStarsMatch = newStarsText.match(/(\d+)/)
        const newStars = newStarsMatch ? parseInt(newStarsMatch[1], 10) : 0

        const repoLanguage = $element
            .find('[itemprop="programmingLanguage"]')
            .text()
            .trim()

        repos.push({
            author,
            name,
            url: repoUrl,
            description,
            stars,
            forks,
            newStars,
            language: repoLanguage,
        })
    })

    return repos
}
