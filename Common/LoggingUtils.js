/**
 * LoggingUtils.js
 *
 * Placeholder for logging or console helper functions.
 */

function logCustomMessage(msg) {
    console.log("[CUSTOM LOG] " + msg);
}

function debugModeAlert(msg) {
    alert("Debug Alert:\n" + msg);
}

// Example for logging with date/time
function logWithTimestamp(msg) {
    let now = new Date();
    console.log(`[${now.toISOString()}] ${msg}`);
}