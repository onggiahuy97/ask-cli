# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ask-cli is an AI-powered CLI assistant that uses Claude AI or Google Gemini to answer questions, generate code, and provide terminal commands directly from the command line. It's an ES Module-based Node.js application that provides intelligent prompt formatting based on question type.

## Development Commands

### Testing
```bash
npm test                 # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Code Quality
```bash
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Installation
```bash
npm install              # Install dependencies
npm link                 # Link the CLI globally for testing
```

## Architecture

### Provider Pattern
The application uses a provider pattern for AI integrations:

- **BaseProvider** (`src/providers/base.js`): Abstract base class that all providers extend. Defines the interface: `ask()`, `validateConfig()`, `getName()`, and `formatError()`.
- **ClaudeProvider** (`src/providers/claude.js`): Implements Claude AI using `@anthropic-ai/sdk`.
- **GeminiProvider** (`src/providers/gemini.js`): Implements Google Gemini using `@google/generative-ai`.
- **Provider Registry** (`src/providers/index.js`): Factory pattern using a simple object mapping provider names to classes. Use `getProvider(name, config)` to instantiate providers.

### Prompt Building System
The prompt builder (`src/utils/prompt-builder.js`) automatically detects question type and formats prompts accordingly:

1. **CLI Commands**: Triggered by "cli to" or "command to ... in terminal/shell/bash"
2. **Code Requests**: Triggered by "code to" - extracts language from "in <language>" suffix
3. **How-to Questions**: Triggered by "how to" prefix - optimized for concise answers
4. **General Questions**: Default handler for all other queries

Each type has a specific prompt template optimizing AI responses for that use case.

### Configuration System
Configuration follows a layered merge strategy (lowest to highest priority):
1. Defaults (`src/config/defaults.js`)
2. Home directory config (`~/.askrc.json`)
3. Project directory config (`./.askrc.json`)
4. Environment variables (`.env`)

The `config-loader.js` utility handles this merging using `loadConfig()` and `getProviderConfig()`.

### Entry Point Flow
`index.js` orchestrates the application:
1. Load `.env` file using dotenv
2. Parse CLI arguments with Commander.js
3. Validate the question
4. Determine provider (-c for Claude, -g for Gemini)
5. Merge configurations (defaults + config files + env vars)
6. Instantiate provider and call `ask()`
7. Display response or error

## Adding New Providers

To add a new AI provider:

1. Create `src/providers/<provider-name>.js` extending `BaseProvider`
2. Implement required methods: `ask()`, `validateConfig()`, `getName()`
3. Add to the `providers` registry in `src/providers/index.js`
4. Add default configuration in `src/config/defaults.js`
5. Update environment variable handling in `index.js`
6. Add tests for the new provider

## Configuration Files

### .askrc.json Format
```json
{
  "claude": {
    "model": "claude-3-haiku-20240307",
    "maxTokens": 2048,
    "temperature": 0.5
  },
  "gemini": {
    "model": "gemini-2.5-flash"
  }
}
```

### Environment Variables
- `CLAUDE_API_KEY`: Required for Claude provider
- `GOOGLE_API_KEY`: Required for Gemini provider
- `CLAUDE_MODEL`, `CLAUDE_MAX_TOKENS`, `CLAUDE_TEMPERATURE`: Override Claude defaults
- `GEMINI_MODEL`: Override Gemini default

## Code Style

- ES Modules (`import`/`export`, not `require`)
- Airbnb ESLint configuration
- JSDoc comments for all exported functions
- Error handling with descriptive messages via `logError()`
- Spinner/loading states using `ora` via `createSpinner()`
