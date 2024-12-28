"use strict";

/**
 * TaskMenu.js
 * Exposes a TaskMenu_run function to show a menu of task-related options.
 *
 * Extend or edit the prompt options inside `TaskMenu_run` to add new actions.
 */

(function () {
  // Local references to each action's script can be imported here if needed:
  // const ManageOverdueTasks = require("./ManageOverdueTasks.js");
  // const ProjectMaintenance = require("./ProjectMaintenance.js");
  // etc.

  // Show a prompt with multiple choices and handle them
  function TaskMenu_run() {
    const prompt = Prompt.create();
    prompt.title = "Task Management Menu";
    prompt.message = "Select an option to manage your tasks:";

    prompt.addButton("Manage Overdue Tasks");
    prompt.addButton("Manage Deadlines");
    prompt.addButton("Schedule Tasks for Tomorrow");
    prompt.addButton("Cancel", "cancel", true);

    const didSelect = prompt.show();

    // If user cancels or dismisses the prompt, stop
    if (!didSelect || prompt.buttonPressed === "Cancel") {
      context.cancel();
      return;
    }

    switch (prompt.buttonPressed) {
      case "Manage Overdue Tasks":
        // If you want to call your ManageOverdueTasks script:
        // ManageOverdueTasks.run();
        alert(
          "You selected to manage overdue tasks. (Placeholder for ManageOverdueTasks action.)"
        );
        break;

      case "Manage Deadlines":
        alert(
          "You selected to manage deadlines. (Placeholder for ManageDeadlines action.)"
        );
        break;

      case "Schedule Tasks for Tomorrow":
        alert(
          "You selected to schedule tasks for tomorrow. (Placeholder for scheduling tasks.)"
        );
        break;

      default:
        context.cancel();
        break;
    }
  }

  // Expose TaskMenu_run for scripts that require this file
  // Drafts recognizes these top-level assignments as module exports
  this.TaskMenu_run = TaskMenu_run;
})();
