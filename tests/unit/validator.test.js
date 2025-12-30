import { describe, it, expect } from 'vitest';
import {
  validateQuestion,
  validateAPIKey,
  validateProvider,
  ValidationError,
} from '../../src/utils/validator.js';

describe('validateQuestion', () => {
  it('should return trimmed question for valid input', () => {
    const result = validateQuestion('  What is Node.js?  ');
    expect(result).toBe('What is Node.js?');
  });

  it('should throw ValidationError for empty string', () => {
    expect(() => validateQuestion('')).toThrow(ValidationError);
    expect(() => validateQuestion('')).toThrow('Question cannot be empty');
  });

  it('should throw ValidationError for whitespace-only string', () => {
    expect(() => validateQuestion('   ')).toThrow(ValidationError);
    expect(() => validateQuestion('   ')).toThrow('Question cannot be empty');
  });

  it('should throw ValidationError for null', () => {
    expect(() => validateQuestion(null)).toThrow(ValidationError);
    expect(() => validateQuestion(null)).toThrow('Please provide a question');
  });

  it('should throw ValidationError for undefined', () => {
    expect(() => validateQuestion(undefined)).toThrow(ValidationError);
    expect(() => validateQuestion(undefined)).toThrow('Please provide a question');
  });

  it('should throw ValidationError for non-string input', () => {
    expect(() => validateQuestion(123)).toThrow(ValidationError);
    expect(() => validateQuestion({})).toThrow(ValidationError);
    expect(() => validateQuestion([])).toThrow(ValidationError);
  });

  it('should have correct error code', () => {
    try {
      validateQuestion('');
    } catch (error) {
      expect(error.code).toBe('EMPTY_QUESTION');
    }
  });
});

describe('validateAPIKey', () => {
  it('should return trimmed API key for valid input', () => {
    const result = validateAPIKey('  sk-ant-api03-xyz  ', 'CLAUDE_API_KEY');
    expect(result).toBe('sk-ant-api03-xyz');
  });

  it('should throw ValidationError for empty string', () => {
    expect(() => validateAPIKey('', 'CLAUDE_API_KEY')).toThrow(ValidationError);
    expect(() => validateAPIKey('', 'CLAUDE_API_KEY')).toThrow('CLAUDE_API_KEY not found');
  });

  it('should throw ValidationError for whitespace-only string', () => {
    expect(() => validateAPIKey('   ', 'GOOGLE_API_KEY')).toThrow(ValidationError);
    expect(() => validateAPIKey('   ', 'GOOGLE_API_KEY')).toThrow('GOOGLE_API_KEY not found');
  });

  it('should throw ValidationError for null', () => {
    expect(() => validateAPIKey(null, 'CLAUDE_API_KEY')).toThrow(ValidationError);
  });

  it('should throw ValidationError for undefined', () => {
    expect(() => validateAPIKey(undefined, 'GOOGLE_API_KEY')).toThrow(ValidationError);
  });

  it('should include helpful message about .env file', () => {
    expect(() => validateAPIKey('', 'CLAUDE_API_KEY')).toThrow('.env.example');
  });

  it('should have correct error code', () => {
    try {
      validateAPIKey('', 'CLAUDE_API_KEY');
    } catch (error) {
      expect(error.code).toBe('MISSING_API_KEY');
    }
  });
});

describe('validateProvider', () => {
  const validProviders = ['claude', 'gemini', 'openai'];

  it('should return provider for valid input', () => {
    const result = validateProvider('claude', validProviders);
    expect(result).toBe('claude');
  });

  it('should throw ValidationError for invalid provider', () => {
    expect(() => validateProvider('invalid', validProviders)).toThrow(ValidationError);
  });

  it('should include list of valid providers in error message', () => {
    expect(() => validateProvider('invalid', validProviders)).toThrow('claude, gemini, openai');
  });

  it('should have correct error code', () => {
    try {
      validateProvider('invalid', validProviders);
    } catch (error) {
      expect(error.code).toBe('INVALID_PROVIDER');
    }
  });
});

describe('ValidationError', () => {
  it('should be an instance of Error', () => {
    const error = new ValidationError('Test message', 'TEST_CODE');
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct name', () => {
    const error = new ValidationError('Test message', 'TEST_CODE');
    expect(error.name).toBe('ValidationError');
  });

  it('should store error code', () => {
    const error = new ValidationError('Test message', 'TEST_CODE');
    expect(error.code).toBe('TEST_CODE');
  });

  it('should store error message', () => {
    const error = new ValidationError('Test message', 'TEST_CODE');
    expect(error.message).toBe('Test message');
  });
});
