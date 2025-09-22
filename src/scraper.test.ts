import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { fetchGitHubTrends } from './scraper'

const mockFetch = vi.fn() as Mock
vi.stubGlobal('fetch', mockFetch)

describe('fetchGitHubTrends', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should fetch and parse trending repos correctly', async () => {
        const sampleHtml = `
        <div class="Box-row">
            <h2><a href="/user/repo">user/repo</a></h2>
            <p>Description of the repo</p>
            <a href="/user/repo/stargazers">1,234</a>
            <a href="/user/repo/forks">56</a>
            <span class="d-inline-block float-sm-right">789 stars this week</span>
            <span itemprop="programmingLanguage">TypeScript</span>
        </div>
        `

        mockFetch.mockResolvedValueOnce({
            text: () => Promise.resolve(sampleHtml),
        })

        const repos = await fetchGitHubTrends()

        expect(repos).toHaveLength(1)
        expect(repos[0]).toEqual({
            author: 'user',
            name: 'repo',
            url: 'https://github.com/user/repo',
            description: 'Description of the repo',
            stars: 1234,
            forks: 56,
            newStars: 789,
            language: 'TypeScript',
        })
    }) // test

    it('should build URL with parameters', async () => {
        mockFetch.mockResolvedValueOnce({
            text: () => Promise.resolve(''),
        })

        await fetchGitHubTrends({
            language: 'javascript',
            period: 'weekly',
            spokenLanguageCode: 'en',
        })

        expect(mockFetch).toHaveBeenCalledWith(
            'https://github.com/trending/javascript?since=weekly&spoken_language_code=en',
        )
    }) // test

    it('should handle empty response', async () => {
        mockFetch.mockResolvedValueOnce({
            text: () => Promise.resolve(''),
        })

        const repos = await fetchGitHubTrends()

        expect(repos).toEqual([])
    }) // test
}) // group
