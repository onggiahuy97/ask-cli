/**
 * Default configuration values for ask-cli
 */
export default {
  // Claude AI configuration
  claude: {
    model: 'claude-3-haiku-20240307',
    maxTokens: 1024,
    temperature: 0.3,
  },
  // Google Gemini configuration
  gemini: {
    model: 'gemini-1.5-flash',
  },
  // Default provider if none specified
  defaultProvider: 'claude',
  // Spinner messages
  spinnerText: {
    claude: 'Asking Claude...',
    gemini: 'Asking Gemini...',
  },
};
