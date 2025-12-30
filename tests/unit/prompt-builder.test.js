import { describe, it, expect } from 'vitest';
import { buildPrompt } from '../../src/utils/prompt-builder.js';

describe('buildPrompt', () => {
  describe('CLI requests', () => {
    it('should recognize "cli to" pattern', () => {
      const result = buildPrompt('cli to list all files');
      expect(result).toContain('Return ONLY the commands');
      expect(result).toContain('cli to list all files');
    });

    it('should recognize "command to in terminal" pattern', () => {
      const result = buildPrompt('command to install npm package in terminal');
      expect(result).toContain('Return ONLY the commands');
      expect(result).toContain('command to install npm package in terminal');
    });

    it('should recognize "command to in bash" pattern', () => {
      const result = buildPrompt('command to check disk space in bash');
      expect(result).toContain('Return ONLY the commands');
    });

    it('should recognize "command to in shell" pattern', () => {
      const result = buildPrompt('command to list processes in shell');
      expect(result).toContain('Return ONLY the commands');
    });
  });

  describe('Code requests', () => {
    it('should extract language from question', () => {
      const result = buildPrompt('code to reverse a string in javascript');
      expect(result).toContain('javascript');
      expect(result).toContain('Provide ONLY the function code');
    });

    it('should default to python when language not specified', () => {
      const result = buildPrompt('code to sort an array');
      expect(result).toContain('python');
      expect(result).toContain('Provide ONLY the function code');
    });

    it('should handle various languages', () => {
      const languages = ['rust', 'go', 'java', 'typescript'];
      languages.forEach((lang) => {
        const result = buildPrompt(`code to parse json in ${lang}`);
        expect(result).toContain(lang);
        expect(result).toContain('Provide ONLY the function code');
      });
    });
  });

  describe('How-to questions', () => {
    it('should recognize "how to" prefix', () => {
      const result = buildPrompt('how to install node.js');
      expect(result).toContain('extremely short, precise answer');
      expect(result).toContain('how to install node.js');
    });

    it('should be case insensitive', () => {
      const result = buildPrompt('How To Install Node.js');
      expect(result).toContain('extremely short, precise answer');
    });

    it('should preserve original question', () => {
      const result = buildPrompt('how to debug javascript');
      expect(result).toContain('how to debug javascript');
    });
  });

  describe('Default questions', () => {
    it('should handle general questions', () => {
      const result = buildPrompt('What is the capital of France?');
      expect(result).toContain('short and percise');
      expect(result).toContain('What is the capital of France?');
    });

    it('should handle questions without special patterns', () => {
      const result = buildPrompt('explain quantum computing');
      expect(result).toContain('short and percise');
      expect(result).toContain('explain quantum computing');
    });
  });

  describe('Edge cases', () => {
    it('should handle mixed case in CLI requests', () => {
      const result = buildPrompt('CLI TO list files');
      expect(result).toContain('Return ONLY the commands');
    });

    it('should preserve original question in all prompts', () => {
      const original = 'How To Install Node.js v20';
      const result = buildPrompt(original);
      expect(result).toContain(original);
    });

    it('should handle questions with special characters', () => {
      const result = buildPrompt('code to handle $variable in bash');
      expect(result).toContain('Provide ONLY the function code');
      expect(result).toContain('bash');
    });
  });
});
