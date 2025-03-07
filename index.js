#!/usr/bin/env node
import { program } from 'commander';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
		lowerQuestion.includes("command to") &&
		(lowerQuestion.includes("in terminal") ||
			lowerQuestion.includes("in shell") ||
			lowerQuestion.includes("in bash"))) {
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
	// Case 3: How-to or other questions
	else {
		return `Provide an extremely short, precise answer:
- No unnecessary details or context
- 1-5 sentences maximum
- Focus only on directly answering the question

Question: ${question}`;
	}
}

async function askClaude(question) {
	try {
		const message = await anthropic.messages.create({
			model: "claude-3-haiku-20240307",
			max_tokens: 1024,
			messages: [{
				role: "user",
				content: makePrompt(question)
			}],
			temperature: 0.3
		});
		return message.content;
	} catch (error) {
		return `Error: ${error.message}`;
	}
}

async function askGemini(question) {
	try {
		const result = await genAIModel.generateContent(question)
		return result.response.text()
	} catch (error) {
		return error;
	}
}


program
	.option('-c, --claude', 'Use Claude mode')
	.option('-o, --other', 'Use other mode')
	.option('-g, --gemini', 'Use Google Gemini mode')
	.allowExcessArguments(true)
	.parse();

const options = program.opts();
const message = program.args.join(' ');
const prompt = makePrompt(message)

if (options.claude) {
	askClaude(prompt).then(response => {
		console.log(response[0].text);
	});
} else if (options.gemini) {
	askGemini(prompt).then(response => {
		console.log(response);
	});
} else if (options.other) {
	console.log(`Other mode: ${message}`);
} else {
	console.log('Please specify a mode: -c or -o');
}

//if (options.claude) {
//	askClaude(message).then(response => {
//		if (Array.isArray(response)) {
//			console.log(response[0].text);
//		} else {
//			console.log(response);
//		}
//	});
//} else if (options.other) {
//	console.log(`Other mode: ${message}`);
//} else {
//	console.log('Please specify a mode: -c or -o');
//}
//
