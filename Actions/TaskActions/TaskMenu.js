function TaskMenu_run() {
  const prompt = Prompt.create();
  prompt.title = "Task Management Menu";
  prompt.message = "Select an option to manage your tasks.";

  // Add different task management options
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

// Export the function so it can be used externally
module.exports = {
  TaskMenu_run,
};
