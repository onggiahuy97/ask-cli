import { Anthropic } from '@anthropic-ai/sdk';
import { BaseProvider } from './base.js';
import { buildPrompt } from '../utils/prompt-builder.js';
import { createSpinner } from '../utils/logger.js';
import { validateAPIKey } from '../utils/validator.js';

/**
 * Claude AI provider implementation
 */
export class ClaudeProvider extends BaseProvider {
  /**
   * Creates a Claude provider instance
   * @param {object} config - Provider configuration
   */
  constructor(config) {
    super(config);
    this.validateConfig();
    this.client = new Anthropic({
      apiKey: this.config.apiKey,
    });
  }

  /**
   * Validates Claude API configuration
   * @throws {Error} If configuration is invalid
   */
  validateConfig() {
    validateAPIKey(this.config.apiKey, 'CLAUDE_API_KEY');
  }

  /**
   * Gets the provider name
   * @returns {string} The provider name
   */
  getName() {
    return 'Claude';
  }

  /**
   * Asks Claude AI a question
   * @param {string} question - The question to ask
   * @returns {Promise<string>} The AI's response
   */
  async ask(question) {
    const spinner = createSpinner('Asking Claude...');
    try {
      const prompt = buildPrompt(question);
      const message = await this.client.messages.create({
        model: this.config.model || 'claude-3-haiku-20240307',
        max_tokens: this.config.maxTokens || 1024,
        temperature: this.config.temperature !== undefined ? this.config.temperature : 0.3,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
      spinner.stop();
      return message.content[0].text;
    } catch (error) {
      spinner.fail();
      throw new Error(this.formatError(error));
    }
  }
}
