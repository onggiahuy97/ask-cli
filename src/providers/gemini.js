import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base.js';
import { buildPrompt } from '../utils/prompt-builder.js';
import { createSpinner } from '../utils/logger.js';
import { validateAPIKey } from '../utils/validator.js';

/**
 * Google Gemini provider implementation
 */
export class GeminiProvider extends BaseProvider {
  /**
   * Creates a Gemini provider instance
   * @param {object} config - Provider configuration
   */
  constructor(config) {
    super(config);
    this.validateConfig();
    const genAI = new GoogleGenerativeAI(this.config.apiKey);
    this.model = genAI.getGenerativeModel({
      model: this.config.model || 'gemini-1.5-flash',
    });
  }

  /**
   * Validates Gemini API configuration
   * @throws {Error} If configuration is invalid
   */
  validateConfig() {
    validateAPIKey(this.config.apiKey, 'GOOGLE_API_KEY');
  }

  /**
   * Gets the provider name
   * @returns {string} The provider name
   */
  getName() {
    return 'Gemini';
  }

  /**
   * Asks Gemini AI a question
   * @param {string} question - The question to ask
   * @returns {Promise<string>} The AI's response
   */
  async ask(question) {
    const spinner = createSpinner('Asking Gemini...');
    try {
      const prompt = buildPrompt(question);
      const result = await this.model.generateContent(prompt);
      spinner.stop();
      return result.response.text();
    } catch (error) {
      spinner.fail();
      throw new Error(this.formatError(error));
    }
  }
}
