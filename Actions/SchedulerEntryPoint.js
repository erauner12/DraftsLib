/**
 * SchedulerEntryPoint.js
 *
 * This script determines which DraftsLib function to call
 * based on the current action's name from the global `action` object.
 */

function SchedulerEntryPoint_run() {
  console.log(
    "SchedulerEntryPoint_run() invoked with action name: " + action.name
  );

  // Branch your logic on the name of the current action:
  if (action.name === "Manage Overdue Tasks") {
    ManageOverdueTasks_run();
  } else if (action.name === "Assign Duration") {
    console.log("Placeholder: handle 'Assign Duration' logic here.");
  } else {
    console.log("No specialized handling for action: " + action.name);
  }
}
