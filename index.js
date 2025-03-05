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
const genAIModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

function makePrompt(question) {
	return `You are a CLI command expert. Format your response as numbered steps containing ONLY commands, with these rules:
One command per line
No explanations or text
Include flags/options if necessary
Use $ for user commands, # for root commands when required
For commands with variables, use <placeholder>
Use | for piping or multiple command options
Maximum 5 commands unless explicitly needed
Format:
command
command [option1 | option2]
$ command <variable>
Question: ${question}`;
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

if (options.claude) {
	askClaude(message).then(response => {
		console.log(response[0].text);
	});
} else if (options.gemini) {
	askGemini(message).then(response => {
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
