/**
 * SchedulerEntryPoint.js
 *
 * This script determines which DraftsLib function to call
 * based on the current action's name from the global `action` object.
 */
/**
	•	SchedulerEntryPoint_run
	•	@param {string} actionName - The name of the action we want to route.
	•
	•	Call it from a Drafts action like:
	•
	•
	•	require(“MyDraftsLoader.js”);
	•	SchedulerEntryPoint_run(“Assign Duration”);
	•
*/
/**
 * SchedulerEntryPoint_run
 * Enhanced with additional logging for clearer routing steps.
 * @param {string} actionName - The name of the action we want to route.
 */
function SchedulerEntryPoint_run(actionName) {
  logCustomMessage("SchedulerEntryPoint_run() invoked with action name: " + actionName, "info");

  switch (actionName) {
    case "Manage Overdue Tasks":
      logCustomMessage("Routing to ManageOverdueTasks_run()", "info");
      ManageOverdueTasks_run();
      break;

    case "Assign Duration":
      logCustomMessage("Routing to placeholder for 'Assign Duration' logic.", "info");
      // Placeholder or actual logic for "Assign Duration"
      break;

    default:
      logCustomMessage("No specialized handling for action: " + actionName, "warn");
      break;
  }

  logCustomMessage("SchedulerEntryPoint_run() complete for action: " + actionName, "info");
}
