/**
 * GenericExecutor.js
 * Integrated from the previous executor.js gist.
 */

function GenericExecutor_run() {
  // Initialize Todoist credentials
  const credential = Credential.create("Todoist", "Todoist API Token");
  credential.addPasswordField("apiToken", "API Token");
  credential.authorize();

  const TODOIST_API_TOKEN = credential.getValue("apiToken");
  let todoist = Todoist.create();

  // Get the ephemeral draft and extract actionType
  let tempDraft = draft;
  let actionType = tempDraft.getTemplateTag("actionType");

  console.log("Generic Executor started with actionType: " + actionType);

  try {
    // Example: Clean Up Task Titles
    if (actionType === "Clean Up Task Titles") {
      let cleanupAction = Action.find("Clean Up Task Titles");
      if (cleanupAction) {
        app.queueAction(cleanupAction, tempDraft);
        console.log("Queued Clean Up Task Titles action");
      } else {
        console.log("Clean Up Task Titles action not found.");
        context.fail("Cleanup action not found.");
      }
    } else if (actionType === "Clean Up Draft Titles") {
      // Another example for a different cleanup
      let cleanupAction = Action.find("Clean Up Draft Title");
      if (cleanupAction) {
        app.queueAction(cleanupAction, tempDraft);
        console.log("Queued Clean Up Draft Title action");
      } else {
        console.log("Clean Up Draft Title action not found.");
      }
    } else {
      // Generic approach for selected tasks/items
      let selectedTasksData = tempDraft.getTemplateTag("selectedTasks");
      if (!selectedTasksData) {
        console.log("No selectedTasks data found in temporary context.");
        context.fail("No tasks selected.");
      }

      let selectedTasks = JSON.parse(selectedTasksData);
      if (!Array.isArray(selectedTasks) || selectedTasks.length === 0) {
        console.log("Selected tasks array is empty.");
        context.fail("No tasks selected.");
      }

      let createdDrafts = 0;
      for (let task of selectedTasks) {
        try {
          let taskDraft = Draft.create();
          let metadata = task.metadata || {
            action: actionType,
          };
          taskDraft.content =
            "task_" + task.id + "\n" + JSON.stringify(metadata);
          taskDraft.addTag("task-processing");
          taskDraft.update();
          console.log("Created processing draft for item ID: " + task.id);
          createdDrafts++;
        } catch (error) {
          console.log(
            "Error creating draft for item " + task.id + ": " + error
          );
        }
      }

      // Keep commented out for now, don't remove though
      // if (createdDrafts > 0) {
      //   let processorAction = Action.find("Generic Processor");
      //   if (processorAction) {
      //     app.queueAction(processorAction);
      //     console.log("Queued Generic Processor action");
      //   } else {
      //     console.log("Generic Processor action not found.");
      //   }
      // }
    }

    // Clean up temporary draft
    tempDraft.isTrashed = true;
    tempDraft.update();
  } catch (error) {
    console.log("Error in generic executor script: " + error);
    context.fail("Error in generic executor script: " + error);
  }
}
