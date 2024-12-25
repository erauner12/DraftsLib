/**
 * LoggingUtils.js
 *
 * Placeholder for logging or console helper functions.
 */

/**
 * Enhanced Logging System with Log Level support
 */

// Map of string log levels to numeric ranks
if (typeof globalThis.LOG_LEVELS === "undefined") {
  globalThis.LOG_LEVELS = {
    "error": 1,
    "warn": 2,
    "info": 3,
    "debug": 4
  };
}

// Default to "info" if not set
if (typeof globalThis.CURRENT_LOG_LEVEL === "undefined") {
  globalThis.CURRENT_LOG_LEVEL = globalThis.LOG_LEVELS["info"];
}

/**
 * setLogLevel
 * @param {string} level - "error", "warn", "info", or "debug"
 */
function setLogLevel(level) {
  if (!level || !globalThis.LOG_LEVELS[level]) {
    console.log("Invalid or missing log level: " + level + ". Defaulting to info.");
    globalThis.CURRENT_LOG_LEVEL = globalThis.LOG_LEVELS["info"];
    return;
  }
  globalThis.CURRENT_LOG_LEVEL = globalThis.LOG_LEVELS[level];
  console.log("Log level set to: " + level);
}

/**
 * logMessage
 * @param {string} msg
 * @param {string} level - "error", "warn", "info", or "debug"
 */
function logMessage(msg, level = "info") {
  let numericLevel = globalThis.LOG_LEVELS[level] || 3; // default to info
  if (numericLevel <= globalThis.CURRENT_LOG_LEVEL) {
    console.log("[" + level.toUpperCase() + "] " + msg);
  }
}

// Below are your existing sample utility log functions adapted to use logMessage:
function logCustomMessage(msg, level = "info") {
  logMessage(msg, level);
}

function debugModeAlert(msg) {
  alert("Debug Alert:\n" + msg);
}

// Example for logging with date/time
function logWithTimestamp(msg, level = "info") {
  let now = new Date();
  let prefix = "[" + now.toISOString() + "]";
  logMessage(prefix + " " + msg, level);
}
