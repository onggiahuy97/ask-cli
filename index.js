#!/usr/bin/env node
import { program } from 'commander';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getProvider } from './src/providers/index.js';
import { validateQuestion } from './src/utils/validator.js';
import { logError } from './src/utils/logger.js';
import { loadConfig, getProviderConfig } from './src/utils/config-loader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

// Load configuration
const appConfig = loadConfig(__dirname);

program
  .name('ask')
  .version('1.0.0', '-v, --version', 'Output the current version')
  .description('AI-powered CLI assistant using Claude or Gemini')
  .option('-c, --claude', 'Use Claude AI')
  .option('-g, --gemini', 'Use Google Gemini')
  .addHelpText(
    'after',
    `
Examples:
  $ ask -c "What is Node.js?"
  $ ask -g "code to reverse a string in python"
  $ ask -c "cli to list all files recursively"
  $ ask -g "how to install npm packages"

For more information, visit: https://github.com/onggiahuy97/ask-cli
`,
  )
  .allowExcessArguments(true)
  .parse();

const options = program.opts();
const question = program.args.join(' ');

// Validate question
try {
  validateQuestion(question);
} catch (error) {
  logError(error);
}

// Determine which provider to use
let providerName = null;
if (options.claude) {
  providerName = 'claude';
} else if (options.gemini) {
  providerName = 'gemini';
} else {
  logError('Please specify a provider: -c (Claude) or -g (Gemini)');
}

// Build provider configuration from environment variables
const envConfig = {
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: process.env.CLAUDE_MODEL,
    maxTokens: process.env.CLAUDE_MAX_TOKENS
      ? parseInt(process.env.CLAUDE_MAX_TOKENS, 10)
      : undefined,
    temperature: process.env.CLAUDE_TEMPERATURE
      ? parseFloat(process.env.CLAUDE_TEMPERATURE)
      : undefined,
  },
  gemini: {
    apiKey: process.env.GOOGLE_API_KEY,
    model: process.env.GEMINI_MODEL,
  },
};

// Get merged provider configuration (defaults < config file < env)
const providerConfig = getProviderConfig(appConfig, providerName, envConfig[providerName]);

// Create provider and ask question
try {
  const provider = getProvider(providerName, providerConfig);
  provider
    .ask(question)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      logError(error);
    });
} catch (error) {
  logError(error);
}
