#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { fetchGitHubTrends } from './scraper'

// ANSI color codes
const reset = '\x1b[0m'
const bold = '\x1b[1m'
const yellow = '\x1b[33m'
const green = '\x1b[32m'
const magenta = '\x1b[35m'
const blue = '\x1b[34m'

const { values } = parseArgs({
    options: {
        language: {
            type: 'string',
            short: 'l',
        },
        period: {
            type: 'string',
            short: 'p',
        },
        spokenLanguage: {
            type: 'string',
            short: 's',
        },
        json: {
            type: 'boolean',
        },
        help: {
            type: 'boolean',
            short: 'h',
        },
    },
})

if (values.help) {
    console.log(`
GitHub Trends CLI

Usage: gh-trends [options]

Options:
    -l, --language <lang>         Programming language (default: all languages)
    -p, --period <period>         Time period: daily, weekly, or monthly (default: daily)
    -s, --spokenLanguage <code>   Spoken language code (default: all languages)
    --json                        Output in JSON format
    -h, --help                    Show this help

Examples:
    gh-trends                            # All languages, default period
    gh-trends --language javascript      # JavaScript only, default period
    gh-trends --period weekly            # All languages, weekly
    gh-trends -l python -p monthly -s en # Python, monthly, English
    gh-trends --json                     # Output in JSON format
`)
    process.exit(0)
}

const { language, period, spokenLanguage, json } = values

if (period && !['daily', 'weekly', 'monthly'].includes(period)) {
    console.error('Error: --period must be one of: daily, weekly, monthly')
    process.exit(1)
}

fetchGitHubTrends({
    language,
    period,
    spokenLanguageCode: spokenLanguage,
})
    .then((repos) => {
        if (json) {
            console.log(JSON.stringify(repos, null, 2))
            return
        }

        if (repos.length === 0) {
            console.log('No repositories found or error occurred.')
            return
        }

        repos.forEach((repo) => {
            console.log(`${bold}${blue}${repo.author}/${repo.name}${reset}`)
            console.log(`${repo.description || 'No description'}`)
            console.log(
                `${yellow}${repo.stars}${reset} stars ᛫ ${green}${repo.forks}${reset} forks ᛫ ${magenta}${repo.language || 'N/A'}${reset}`,
            )
            console.log(`${repo.url}`)
            console.log('')
        })
    })
    .catch((error) => {
        console.error('Error:', error.message)
        process.exit(1)
    })
