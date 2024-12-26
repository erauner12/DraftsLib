/**
 * ManageOverdueTasks.js
 *
 * Placeholder for an action-specific script.
 */

function ManageOverdueTasks_run() {
  someSharedHelperFunction();
  logCustomMessage("Manage Overdue Items script started.");

  // Initialize Todoist credentials
  const credential = Credential.create("Todoist", "Todoist API Token");
  credential.addPasswordField("apiToken", "API Token");
  credential.authorize();

  const TODOIST_API_TOKEN = credential.getValue("apiToken");
  let todoist = Todoist.create();
  todoist.token = TODOIST_API_TOKEN;

  (async () => {
    try {
      let tasks = await todoist.getTasks({ filter: "overdue" });
      logCustomMessage("Retrieved " + tasks.length + " overdue tasks");

      if (tasks.length === 0) {
        alert("No overdue tasks found.");
        logCustomMessage("No overdue tasks retrieved from Todoist.");
        return;
      }

      // Collect task contents
      let taskContents = tasks.map((task) => task.content);

      // Prompt user to select tasks
      let taskPrompt = new Prompt();
      taskPrompt.title = "Overdue Tasks";
      taskPrompt.message = "Select overdue tasks to reschedule or complete:";
      taskPrompt.addSelect("selectedTasks", "Tasks", taskContents, [], true);
      taskPrompt.addButton("OK");

      if (taskPrompt.show() && taskPrompt.buttonPressed === "OK") {
        let selectedTasks = tasks.filter((task) =>
          taskPrompt.fieldValues["selectedTasks"].includes(task.content)
        );
        logCustomMessage("User selected " + selectedTasks.length + " tasks");

        if (selectedTasks.length === 0) {
          logCustomMessage("No tasks selected by the user.");
          alert("No tasks selected.");
          return;
        }

        // Prompt for action
        let actionPrompt = new Prompt();
        actionPrompt.title = "Select Action";
        actionPrompt.message = "Choose an action for the selected tasks:";
        actionPrompt.addButton("Reschedule to Today");
        actionPrompt.addButton("Complete Tasks");

        if (actionPrompt.show()) {
          let userAction = actionPrompt.buttonPressed;
          logCustomMessage("User selected action: " + userAction);

          // Prepare the temporary draft
          let tempDraft = Draft.create();
          tempDraft.addTag("temp");
          tempDraft.setTemplateTag("actionType", userAction);
          tempDraft.setTemplateTag(
            "selectedTasks",
            JSON.stringify(selectedTasks)
          );
          tempDraft.update();

          // Queue the generic executor action with tempDraft
          // Call our new ExecutorLib function directly
          ExecutorLib_execute(tempDraft);
        } else {
          logCustomMessage("User cancelled the action prompt.");
        }
      }
    } catch (error) {
      logCustomMessage("Error in Manage Overdue Tasks script: " + error, true);
      alert("An error occurred: " + error);
    }
  })();
}

// Example extra placeholder function
function ManageOverdueTasks_aux() {
  console.log("ManageOverdueTasks_aux() called!");
}
