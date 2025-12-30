# Contributing to ask-cli

Thank you for your interest in contributing to ask-cli! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/onggiahuy97/ask-cli/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node.js version, etc.)
   - Error messages or logs

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue with:
   - Clear use case
   - Proposed solution
   - Alternative approaches considered
   - Willingness to implement

### Pull Requests

1. **Fork the repository** and create a branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Run the test suite**: `npm test`
5. **Run linting**: `npm run lint`
6. **Format your code**: `npm run format`
7. **Update documentation** if needed
8. **Commit with clear messages** describing what and why
9. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/ask-cli.git
cd ask-cli

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Add your API keys to .env

# Link for local testing
npm link

# Run tests
npm test

# Run linting
npm run lint
```

### Testing Your Changes

```bash
# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Test the CLI locally
ask -c "test question"
```

## Coding Standards

### JavaScript Style

We use **Airbnb JavaScript Style Guide** with ESLint:

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Add JSDoc comments for functions
- Keep functions small and focused
- Use descriptive variable names

### Code Formatting

- **Prettier** handles formatting automatically
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- 100 character line length

### File Organization

- One class/component per file
- Group related functions in modules
- Keep imports organized (built-in → external → internal)
- Export public API at module level

### Testing

- Write unit tests for all new functions
- Aim for >80% code coverage
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies (API calls, file system)

Example test structure:

```javascript
describe('functionName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionName(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Adding a New Provider

To add a new AI provider:

### 1. Create Provider Class

Create `src/providers/yourprovider.js`:

```javascript
import { BaseProvider } from './base.js';
import { buildPrompt } from '../utils/prompt-builder.js';
import { createSpinner } from '../utils/logger.js';
import { validateAPIKey } from '../utils/validator.js';

export class YourProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.validateConfig();
    // Initialize your API client
  }

  validateConfig() {
    validateAPIKey(this.config.apiKey, 'YOUR_API_KEY');
  }

  getName() {
    return 'YourProvider';
  }

  async ask(question) {
    const spinner = createSpinner('Asking YourProvider...');
    try {
      const prompt = buildPrompt(question);
      // Call your API
      const response = await this.client.ask(prompt);
      spinner.stop();
      return response.text;
    } catch (error) {
      spinner.fail();
      throw new Error(this.formatError(error));
    }
  }
}
```

### 2. Register Provider

Add to `src/providers/index.js`:

```javascript
import { YourProvider } from './yourprovider.js';

const providers = {
  claude: ClaudeProvider,
  gemini: GeminiProvider,
  yourprovider: YourProvider,  // Add here
};
```

### 3. Update Configuration

Add defaults to `src/config/defaults.js`:

```javascript
export default {
  yourprovider: {
    model: 'default-model',
    maxTokens: 1024,
  },
  // ...
};
```

### 4. Add Tests

Create `tests/unit/providers/yourprovider.test.js`

### 5. Update Documentation

- Add provider to README.md
- Document configuration options
- Add usage examples
- Update .env.example

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(providers): add OpenAI provider support

- Implement OpenAI provider class
- Add configuration options
- Update documentation

Closes #123
```

```
fix(validator): handle null API keys correctly

Previously validateAPIKey would crash on null input.
Now throws ValidationError with helpful message.
```

## Questions?

- Open a [GitHub Issue](https://github.com/onggiahuy97/ask-cli/issues)
- Start a [Discussion](https://github.com/onggiahuy97/ask-cli/discussions)

Thank you for contributing! 🎉
