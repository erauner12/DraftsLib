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
function SchedulerEntryPoint_run(actionName) {
    console.log("SchedulerEntryPoint_run() invoked with action name: " + actionName);

    switch (actionName) {
      case "Manage Overdue Tasks":
        ManageOverdueTasks_run();
        break;
      case "Assign Duration":
        // Placeholder or actual logic for "Assign Duration"
        console.log("Placeholder: handle 'Assign Duration' logic here.");
        break;
      default:
        console.log("No specialized handling for action: " + actionName);
        break;
    }
}
