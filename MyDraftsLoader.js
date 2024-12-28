"use strict";

/**
 * MyDraftsLoader.js
const { logScriptStepCompleted } = require("./Common/LoggingUtils");

logScriptStepCompleted("MyDraftsLoader script step");
 */

// Ensure LoggingUtils is loaded and available globally
try {
  require("./Common/LoggingUtils.js");
  // If LoggingUtils isn't already global, you can set it here
  if (typeof LoggingUtils !== "undefined") {
    global.Logger = LoggingUtils;
  }
} catch (e) {
  // Fallback or error handling if LoggingUtils can't be loaded
  // This is optional, depending on how you want to handle errors
  alert("Warning: Unable to load LoggingUtils.js:\n" + e.message);
}

// Other requires or initializations can go here
// require("./Actions/TaskActions/ManageOverdueTasks.js");
// require("./Actions/TaskActions/ProjectMaintenance.js");
// ...

// Example: require other common modules here
// require("./Common/LoggingUtils.js");
// require("./Common/CommonHelpers.js");
// require("./Common/DateTimeUtils.js");
// require("./Actions/TaskActions/ManageOverdueTasks.js");

require("./Actions/TaskActions/TaskMenu.js");

// After this, global.TaskMenu_run should be defined.
// Additional setups or global definitions can be placed below if needed.

import { logScriptStepCompleted } from "./Common/LoggingUtils";

logScriptStepCompleted("MyDraftsLoader script step");
