"use strict";

/**
 * ActionRunner.js
 * Link this to a Drafts action step or run it directly to open the task menu.
 */

const { logScriptStepCompleted } = require("../../Common/LoggingUtils");

logScriptStepCompleted("ActionRunner script step");
require("./TaskMenu.js");

logScriptStepCompleted("ActionRunner script step");

// Call the function that shows the task menu
TaskMenu_run();
