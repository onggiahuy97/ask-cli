/**
 * Custom error class for validation failures
 */
export class ValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}

/**
 * Validates that a question is provided and non-empty
 * @param {string} question - The question to validate
 * @returns {string} The trimmed question
 * @throws {ValidationError} If question is invalid
 */
export function validateQuestion(question) {
  if (typeof question !== 'string') {
    throw new ValidationError('Please provide a question', 'EMPTY_QUESTION');
  }

  const trimmed = question.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('Question cannot be empty', 'EMPTY_QUESTION');
  }

  return trimmed;
}

/**
 * Validates that an API key exists and is properly formatted
 * @param {string} apiKey - The API key to validate
 * @param {string} keyName - Name of the API key for error messages
 * @returns {string} The trimmed API key
 * @throws {ValidationError} If API key is invalid
 */
export function validateAPIKey(apiKey, keyName) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new ValidationError(
      `${keyName} not found. Please add it to your .env file.\nSee .env.example for reference.`,
      'MISSING_API_KEY',
    );
  }

  return apiKey.trim();
}

/**
 * Validates provider name against list of valid providers
 * @param {string} provider - Provider name to validate
 * @param {string[]} validProviders - List of valid provider names
 * @returns {string} The provider name
 * @throws {ValidationError} If provider is invalid
 */
export function validateProvider(provider, validProviders) {
  if (!validProviders.includes(provider)) {
    throw new ValidationError(
      `Invalid provider: ${provider}. Valid providers: ${validProviders.join(', ')}`,
      'INVALID_PROVIDER',
    );
  }

  return provider;
}
