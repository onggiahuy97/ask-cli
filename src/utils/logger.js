import ora from 'ora';

/**
 * Creates and returns a spinner with the given text
 * @param {string} text - The text to display with the spinner
 * @returns {object} The ora spinner instance
 */
export function createSpinner(text = 'Loading...') {
  return ora(text).start();
}

/**
 * Logs an error message to console and exits the process
 * @param {string|Error} error - The error message or Error object
 * @param {number} exitCode - The exit code (default: 1)
 */
export function logError(error, exitCode = 1) {
  const message = error instanceof Error ? error.message : error;
  console.error(`Error: ${message}`);
  process.exit(exitCode);
}

/**
 * Logs a success message to console
 * @param {string} message - The success message to log
 */
export function logSuccess(message) {
  console.log(message);
}

/**
 * Logs an informational message to console
 * @param {string} message - The info message to log
 */
export function logInfo(message) {
  console.log(message);
}
