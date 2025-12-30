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

const apiKey = process.env.CLAUDE_API_KEY;
if (!apiKey) {
	console.error('Error: CLAUDE_API_KEY not found in .env file');
	process.exit(1);
}

const anthropic = new Anthropic({
	apiKey: apiKey,
});

const googleAPI = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(googleAPI)
const genAIModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

function makePrompt(question) {
	const lowerQuestion = question.toLowerCase();

	// Case 1: CLI command request
	if (lowerQuestion.includes("cli to") ||
		(lowerQuestion.includes("command to") &&
			(lowerQuestion.includes("in terminal") ||
				lowerQuestion.includes("in shell") ||
				lowerQuestion.includes("in bash")))) {
		return `Return ONLY the commands without any explanation:
- One command per line
- Include essential flags/options
- Use $ for user commands, # for root commands
- For variables, use <placeholder>
- Maximum 3 commands unless absolutely necessary

Command for: ${question}`;
	}
	// Case 2: Code request with language specification
	else if (lowerQuestion.includes("code to")) {
		// Extract language if specified, otherwise default to Python
		let language = "python";
		const languageMatch = lowerQuestion.match(/in (\w+)$/);
		if (languageMatch && languageMatch[1]) {
			language = languageMatch[1];
		}

		return `Provide ONLY the function code in ${language}, with no explanations, examples, or use cases:
- Include necessary imports
- Return ONLY the raw code
- No introduction or conclusion text
- No explanations of what the code does
- No suggestions for how to use it

Code request: ${question}`;
	}
	// Case 3: How-to questions
	else if (lowerQuestion.startsWith("how to")) {
		return `Provide an extremely short, precise answer:
- No unnecessary details or context
- 1-5 sentences maximum
- Focus only on directly answering the question

Question: ${question}`;
	}
	// Case 4: Default case - answer based on context
	else {
		return `Answer this question based on the context and requirements and make sure it short and percise:
${question}`;
	}
}

async function askClaude(question) {
	try {
		const stream = await anthropic.messages.stream({
			model: "claude-3-haiku-20240307",
			max_tokens: 1024,
			messages: [{
				role: "user",
				content: makePrompt(question)
			}],
			temperature: 0.3
		});

		for await (const chunk of stream) {
			if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
				process.stdout.write(chunk.delta.text);
			}
		}
		console.log(); // New line at the end
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}

async function askGemini(question) {
	try {
		const result = await genAIModel.generateContentStream(question);
		for await (const chunk of result.stream) {
			const chunkText = chunk.text();
			process.stdout.write(chunkText);
		}
		console.log(); // New line at the end
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}


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

if (options.claude) {
	askClaude(prompt);
} else if (options.gemini) {
	askGemini(prompt);
} else if (options.other) {
	console.log(`Other mode: ${message}`);
} else {
	console.log('Please specify a mode: -c or -o or -g');
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
