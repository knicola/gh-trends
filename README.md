# GitHub Trends

Fetch trending GitHub repositories.

## CLI

### Installation

```sh
npm install -g @knicola/gh-trends
```

### Usage

```sh
$ gh-trends --help

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
```

## API

### Installation

```sh
npm install @knicola/gh-trends
```

### Usage

```js
import { fetchGitHubTrends } from '@knicola/gh-trends'

const repos = await fetchGitHubTrends({
  language: 'javascript',
  period: 'weekly',
  spokenLanguageCode: 'en'
})

repos.forEach(repo => {
  console.log(`${repo.author}/${repo.name}`)
  console.log(`Stars: ${repo.stars} (+${repo.newStars} this week)`)
  console.log(`Language: ${repo.language}`)
  console.log(`URL: ${repo.url}`)
})
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and ensure tests pass.
4. Run `npm run lint:fix` and `npm run format:fix` to format code.
5. Commit your changes: `git commit -m "Add your feature"`.
6. Push to your branch: `git push origin feature/your-feature`.
7. Open a pull request.

Please ensure your code adheres to the project's style guidelines and includes appropriate documentation.

## Disclaimer

This tool scrapes public data from GitHub. Ensure compliance with GitHub's terms of service and rate limits. Use responsibly.

## License

This project is open-sourced software licensed under the [MIT license](./LICENSE).
