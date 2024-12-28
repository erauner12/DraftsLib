"use strict";

/**
 * TaskMenu.js
 * Exposes a top-level function TaskMenu_run(), which shows a prompt for task management.
 *
 * Usage (from another script):
 * require("./TaskMenu.js");
 * TaskMenu_run();
 */

/**
 * TaskMenu_run
 * Displays a prompt with options for managing tasks, and handles button selections.
 */
function TaskMenu_run() {
  const prompt = Prompt.create();
  prompt.title = "Task Management Menu";
  prompt.message = "Select an option to manage your tasks:";

  prompt.addButton("Manage Overdue Tasks");
  prompt.addButton("Manage Deadlines");
  prompt.addButton("Schedule Tasks for Tomorrow");
  prompt.addButton("Cancel", "cancel", true);

  const didSelect = prompt.show();

  if (!didSelect || prompt.buttonPressed === "Cancel") {
    context.cancel();
    return;
  }

  switch (prompt.buttonPressed) {
    case "Manage Overdue Tasks":
      // Placeholder: manageOverdueTasks();
      alert(
        "You selected to manage overdue tasks. (Placeholder for ManageOverdueTasks action.)"
      );
      break;

    case "Manage Deadlines":
      // Placeholder: manageDeadlines();
      alert(
        "You selected to manage deadlines. (Placeholder for ManageDeadlines action.)"
      );
      break;

    case "Schedule Tasks for Tomorrow":
      // Placeholder: scheduleTasksForTomorrow();
      alert(
        "You selected to schedule tasks for tomorrow. (Placeholder for scheduling tasks.)"
      );
      break;

    default:
      context.cancel();
      break;
  }
}

/**
 * Optionally, define other top-level functions or variables for supporting your actions.
 * Example:
 * function manageOverdueTasks() {
 *   // ...
 * }
 */
