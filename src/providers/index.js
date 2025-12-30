import { ClaudeProvider } from './claude.js';
import { GeminiProvider } from './gemini.js';

/**
 * Provider registry mapping provider names to their classes
 */
const providers = {
  claude: ClaudeProvider,
  gemini: GeminiProvider,
};

/**
 * Gets a provider instance by name
 * @param {string} name - The provider name ('claude' or 'gemini')
 * @param {object} config - Provider configuration
 * @returns {BaseProvider} The provider instance
 * @throws {Error} If provider is not found
 */
export function getProvider(name, config) {
  const ProviderClass = providers[name];
  if (!ProviderClass) {
    throw new Error(
      `Provider '${name}' not found. Available providers: ${Object.keys(providers).join(', ')}`,
    );
  }
  return new ProviderClass(config);
}

/**
 * Gets list of available provider names
 * @returns {string[]} Array of provider names
 */
export function getAvailableProviders() {
  return Object.keys(providers);
}

export { ClaudeProvider, GeminiProvider };
