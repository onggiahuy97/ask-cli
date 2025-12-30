import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import defaults from '../config/defaults.js';

/**
 * Loads and merges configuration from multiple sources
 * Priority: CLI flags > .askrc.json (local) > .askrc.json (home) > defaults
 * @param {string} projectRoot - The project root directory
 * @returns {object} Merged configuration object
 */
export function loadConfig(projectRoot) {
  let config = JSON.parse(JSON.stringify(defaults)); // Deep clone defaults

  // Try to load from home directory
  const homeConfigPath = join(homedir(), '.askrc.json');
  if (existsSync(homeConfigPath)) {
    try {
      const homeConfig = JSON.parse(readFileSync(homeConfigPath, 'utf-8'));
      config = mergeConfig(config, homeConfig);
    } catch (error) {
      // Silently ignore parse errors
    }
  }

  // Try to load from project directory
  const projectConfigPath = join(projectRoot, '.askrc.json');
  if (existsSync(projectConfigPath)) {
    try {
      const projectConfig = JSON.parse(readFileSync(projectConfigPath, 'utf-8'));
      config = mergeConfig(config, projectConfig);
    } catch (error) {
      // Silently ignore parse errors
    }
  }

  return config;
}

/**
 * Deep merges two configuration objects
 * @param {object} target - The target object
 * @param {object} source - The source object
 * @returns {object} Merged object
 */
function mergeConfig(target, source) {
  const result = { ...target };

  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeConfig(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  });

  return result;
}

/**
 * Gets provider-specific configuration
 * @param {object} config - Full configuration object
 * @param {string} providerName - Name of the provider
 * @param {object} envConfig - Configuration from environment variables
 * @returns {object} Provider configuration
 */
export function getProviderConfig(config, providerName, envConfig = {}) {
  const providerDefaults = config[providerName] || {};

  // Merge: defaults < config file < environment variables
  return {
    ...providerDefaults,
    ...envConfig,
  };
}
