/**
 * Abstract base class for AI providers
 */
export class BaseProvider {
  /**
   * Creates a provider instance
   * @param {object} config - Provider configuration
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Asks the AI provider a question
   * Must be implemented by subclasses
   * @param {string} _question - The question to ask
   * @returns {Promise<string>} The AI's response
   */
  async ask(_question) {
    throw new Error('ask() must be implemented by provider');
  }

  /**
   * Validates provider configuration
   * Must be implemented by subclasses
   * @throws {Error} If configuration is invalid
   */
  validateConfig() {
    throw new Error('validateConfig() must be implemented by provider');
  }

  /**
   * Gets the provider name
   * Must be implemented by subclasses
   * @returns {string} The provider name
   */
  getName() {
    throw new Error('getName() must be implemented by provider');
  }

  /**
   * Formats an error message with provider context
   * @param {Error} error - The error to format
   * @returns {string} Formatted error message
   */
  formatError(error) {
    return `${this.getName()} Error: ${error.message}`;
  }
}
