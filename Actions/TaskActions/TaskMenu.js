"use strict";

/**
 * TaskMenu.js
 * Presents a top-level function TaskMenu_run(), which shows a prompt for managing various tasks.
 * Incorporates LoggingUtils for unified logging and includes placeholders
 * for launching non-Todoist-related actions as well.
 */

// Require the LoggingUtils module from Common
require("../../Common/LoggingUtils.js");

// Optional: If LoggingUtils is globally defined, you can directly use LoggingUtils.info(...).
// Otherwise, assign it to a local variable for convenience.
let logger = typeof LoggingUtils !== "undefined" ? LoggingUtils : null;

/**
 * TaskMenu_run
 * Displays a prompt with options for task management, logs user selection, and calls the appropriate code.
 */
function TaskMenu_run() {
  if (logger) {
    logger.info("TaskMenu: Starting menu prompt.");
  }

  const prompt = Prompt.create();
  prompt.title = "Task Management Menu";
  prompt.message = "Select an option to manage your tasks:";

  // Add generic actions here—non-Todoist or any other expansions
  prompt.addButton("Manage Overdue Tasks");
  prompt.addButton("Manage Deadlines");
  prompt.addButton("Schedule Tasks for Tomorrow");
  prompt.addButton("Some Other Custom Action");
  prompt.addButton("Cancel", "cancel", true);

  const didSelect = prompt.show();

  if (!didSelect || prompt.buttonPressed === "Cancel") {
    if (logger) {
      logger.info("TaskMenu: User canceled or dismissed the prompt.");
    }
    context.cancel();
    return;
  }

  if (logger) {
    logger.info('TaskMenu: User selected "' + prompt.buttonPressed + '".');
  }

  switch (prompt.buttonPressed) {
    case "Manage Overdue Tasks":
      // Placeholder for ManageOverdueTasks logic
      alert(
        "You selected to manage overdue tasks. (Placeholder for ManageOverdueTasks action.)"
      );
      break;

    case "Manage Deadlines":
      // Placeholder for handling deadlines
      alert(
        "You selected to manage deadlines. (Placeholder for ManageDeadlines action.)"
      );
      break;

    case "Schedule Tasks for Tomorrow":
      // Placeholder for scheduling tasks
      alert(
        "You selected to schedule tasks for tomorrow. (Placeholder for scheduling tasks.)"
      );
      break;

    case "Some Other Custom Action":
      // Placeholder for a custom, non-Todoist action
      alert(
        "You selected another custom action. (Placeholder for non-Todoist or other expansions.)"
      );
      break;

    default:
      // Fallback case, if needed
      if (logger) {
        logger.warn("TaskMenu: Unexpected button pressed.");
      }
      context.cancel();
      break;
  }
}

// This top-level function can be called from any script that does:
// require("./TaskMenu.js");
// TaskMenu_run();
