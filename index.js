#!/usr/bin/env node
import { program } from 'commander';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Anthropic } from '@anthropic-ai/sdk';

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

async function askClaude(question) {
	try {
		const message = await anthropic.messages.create({
			model: "claude-3-haiku-20240307",
			max_tokens: 1024,
			messages: [{
				role: "user",
				content: `You are a CLI assistant. Give extremely concise answers for CLI/coding questions. No explanations, just commands or quick solutions. Question: ${question}`
			}],
			temperature: 0.3
		});
		return message.content;
	} catch (error) {
		return `Error: ${error.message}`;
	}
}

program
	.option('-c, --claude', 'Use Claude mode')
	.option('-o, --other', 'Use other mode')
	.allowExcessArguments(true)
	.parse();

const options = program.opts();
const message = program.args.join(' ');

if (options.claude) {
	askClaude(message).then(response => {
		if (Array.isArray(response)) {
			console.log(response[0].text);
		} else {
			console.log(response);
		}
	});
} else if (options.other) {
	console.log(`Other mode: ${message}`);
} else {
	console.log('Please specify a mode: -c or -o');
}
