# ask-cli

AI-powered CLI assistant that uses Claude AI or Google Gemini to answer questions, generate code, and provide terminal commands directly from your command line.

## Features

- **Multiple AI Providers**: Choose between Claude AI (Anthropic) or Google Gemini
- **Smart Prompt Generation**: Automatically formats prompts based on question type
- **Code Generation**: Request code snippets in any programming language
- **CLI Commands**: Get terminal commands without explanation
- **Configurable**: Customize models, temperature, and other settings
- **Fast & Lightweight**: Built on Node.js with minimal dependencies

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Install from Source

```bash
git clone https://github.com/onggiahuy97/ask-cli.git
cd ask-cli
npm install
npm link
```

## Setup

### 1. Get API Keys

- **Claude API Key**: Get yours at [https://console.anthropic.com/](https://console.anthropic.com/)
- **Google Gemini API Key**: Get yours at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 2. Configure Environment

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
CLAUDE_API_KEY=your-claude-api-key-here
GOOGLE_API_KEY=your-google-api-key-here
```

## Usage

### Basic Commands

```bash
# Using Claude
ask -c "What is the capital of France?"

# Using Gemini
ask -g "Explain quantum computing in simple terms"
```

### Request CLI Commands

```bash
ask -c "cli to list all files recursively"
# Returns:
# $ ls -R
# or
# $ find . -type f

ask -g "command to check disk space in bash"
# Returns bash command
```

### Request Code

```bash
ask -c "code to reverse a string in python"
# Returns Python code only

ask -g "code to parse JSON in rust"
# Returns Rust code only
```

### How-to Questions

```bash
ask -c "how to install node.js"
# Returns concise 1-5 sentence answer
```

### General Questions

```bash
ask -c "explain the difference between async and sync"
# Returns short, precise answer
```

## Configuration

### Environment Variables

You can override default settings using environment variables in your `.env` file:

```env
# Claude Configuration
CLAUDE_API_KEY=your-key-here
CLAUDE_MODEL=claude-3-haiku-20240307
CLAUDE_MAX_TOKENS=1024
CLAUDE_TEMPERATURE=0.3

# Gemini Configuration
GOOGLE_API_KEY=your-key-here
GEMINI_MODEL=gemini-1.5-flash
```

### Configuration File

Create a `.askrc.json` file in your home directory or project root for persistent settings:

**~/.askrc.json** or **project/.askrc.json**:

```json
{
  "claude": {
    "model": "claude-3-haiku-20240307",
    "maxTokens": 2048,
    "temperature": 0.5
  },
  "gemini": {
    "model": "gemini-1.5-pro"
  }
}
```

Configuration precedence (highest to lowest):
1. Environment variables (`.env`)
2. Project config file (`./askrc.json`)
3. Home config file (`~/.askrc.json`)
4. Default values

## Prompt Types

The CLI automatically detects your question type and formats the prompt accordingly:

### 1. CLI Commands
**Triggers**: "cli to", "command to ... in terminal/shell/bash"

**Example**:
```bash
ask -c "cli to find all .js files"
```

**Output**: Only commands, no explanation

### 2. Code Requests
**Triggers**: "code to"

**Example**:
```bash
ask -c "code to sort array in javascript"
```

**Output**: Raw code only, with necessary imports

### 3. How-to Questions
**Triggers**: "how to"

**Example**:
```bash
ask -c "how to debug Node.js applications"
```

**Output**: Short, precise 1-5 sentence answer

### 4. General Questions
**Triggers**: Everything else

**Example**:
```bash
ask -c "What is machine learning?"
```

**Output**: Concise, context-aware answer

## Development

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Project Structure

```
ask-cli/
├── src/
│   ├── providers/          # AI provider implementations
│   │   ├── base.js        # Abstract provider interface
│   │   ├── claude.js      # Claude provider
│   │   ├── gemini.js      # Gemini provider
│   │   └── index.js       # Provider registry
│   ├── utils/             # Utility functions
│   │   ├── prompt-builder.js  # Prompt generation logic
│   │   ├── validator.js       # Input validation
│   │   ├── logger.js          # Console output utilities
│   │   └── config-loader.js   # Configuration management
│   └── config/
│       └── defaults.js    # Default configuration values
├── tests/
│   └── unit/             # Unit tests
├── index.js              # CLI entry point
├── package.json
└── README.md
```

## Troubleshooting

### "CLAUDE_API_KEY not found"

Make sure you've created a `.env` file and added your API key. See [Setup](#setup) section.

### "Please provide a question"

You need to provide a question as an argument:

```bash
# Wrong
ask -c

# Correct
ask -c "your question here"
```

### "Please specify a provider"

You must use either `-c` (Claude) or `-g` (Gemini):

```bash
# Wrong
ask "your question"

# Correct
ask -c "your question"
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding a New Provider

1. Create a new provider class extending `BaseProvider` in `src/providers/`
2. Implement required methods: `ask()`, `validateConfig()`, `getName()`
3. Register provider in `src/providers/index.js`
4. Add tests for the new provider
5. Update documentation

## License

ISC

## Acknowledgments

- Powered by [Claude AI (Anthropic)](https://www.anthropic.com/)
- Powered by [Google Gemini](https://ai.google.dev/)
- Built with [Commander.js](https://github.com/tj/commander.js)

## Support

- **Issues**: [GitHub Issues](https://github.com/onggiahuy97/ask-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/onggiahuy97/ask-cli/discussions)
