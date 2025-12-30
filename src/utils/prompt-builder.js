/**
 * Builds an appropriate prompt based on the question type
 * @param {string} question - The user's question
 * @returns {string} The formatted prompt for the AI
 */
export function buildPrompt(question) {
  const lowerQuestion = question.toLowerCase();

  if (isCLIRequest(lowerQuestion)) {
    return buildCLIPrompt(question);
  }

  if (isCodeRequest(lowerQuestion)) {
    return buildCodePrompt(question, lowerQuestion);
  }

  if (isHowToQuestion(lowerQuestion)) {
    return buildHowToPrompt(question);
  }

  return buildDefaultPrompt(question);
}

/**
 * Checks if the question is requesting a CLI command
 * @param {string} lowerQuestion - Lowercase version of the question
 * @returns {boolean} True if this is a CLI request
 */
function isCLIRequest(lowerQuestion) {
  return (
    lowerQuestion.includes('cli to')
    || (lowerQuestion.includes('command to')
      && (lowerQuestion.includes('in terminal')
        || lowerQuestion.includes('in shell')
        || lowerQuestion.includes('in bash')))
  );
}

/**
 * Checks if the question is requesting code
 * @param {string} lowerQuestion - Lowercase version of the question
 * @returns {boolean} True if this is a code request
 */
function isCodeRequest(lowerQuestion) {
  return lowerQuestion.includes('code to');
}

/**
 * Checks if the question starts with "how to"
 * @param {string} lowerQuestion - Lowercase version of the question
 * @returns {boolean} True if this is a how-to question
 */
function isHowToQuestion(lowerQuestion) {
  return lowerQuestion.startsWith('how to');
}

/**
 * Builds a prompt for CLI command requests
 * @param {string} question - The original question
 * @returns {string} Formatted CLI prompt
 */
function buildCLIPrompt(question) {
  return `Return ONLY the commands without any explanation:
- One command per line
- Include essential flags/options
- Use $ for user commands, # for root commands
- For variables, use <placeholder>
- Maximum 3 commands unless absolutely necessary

Command for: ${question}`;
}

/**
 * Builds a prompt for code requests
 * @param {string} question - The original question
 * @param {string} lowerQuestion - Lowercase version for parsing
 * @returns {string} Formatted code prompt
 */
function buildCodePrompt(question, lowerQuestion) {
  let language = 'python';
  const languageMatch = lowerQuestion.match(/in (\w+)$/);
  if (languageMatch && languageMatch[1]) {
    language = languageMatch[1];
  }

  return `Provide ONLY the function code in ${language}, with no explanations, examples, or use cases:
- Include necessary imports
- Return ONLY the raw code
- No introduction or conclusion text
- No explanations of what the code does
- No suggestions for how to use it

Code request: ${question}`;
}

/**
 * Builds a prompt for how-to questions
 * @param {string} question - The original question
 * @returns {string} Formatted how-to prompt
 */
function buildHowToPrompt(question) {
  return `Provide an extremely short, precise answer:
- No unnecessary details or context
- 1-5 sentences maximum
- Focus only on directly answering the question

Question: ${question}`;
}

/**
 * Builds a default prompt for general questions
 * @param {string} question - The original question
 * @returns {string} Formatted default prompt
 */
function buildDefaultPrompt(question) {
  return `Answer this question based on the context and requirements and make sure it short and percise:
${question}`;
}
