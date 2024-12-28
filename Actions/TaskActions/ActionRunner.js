"use strict";

/**
 * ActionRunner.js
 * This script loads TaskMenu.js and invokes TaskMenu_run().
 * Link this to a Drafts action step or run it directly to open the task menu.
 */

// Load TaskMenu.js, which defines TaskMenu_run
require("./TaskMenu.js");

// Call the function that shows the task menu
TaskMenu_run();
