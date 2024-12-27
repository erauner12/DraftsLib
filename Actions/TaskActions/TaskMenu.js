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
      // For now, this would call your ManageOverdueTasks action or code
      // manageOverdueTasks.run();
      alert(
        "You selected to manage overdue tasks. (Placeholder for ManageOverdueTasks action.)"
      );
      break;

    case "Manage Deadlines":
      // Placeholder for future functionality
      alert(
        "You selected to manage deadlines. (Placeholder for ManageDeadlines action.)"
      );
      break;

    case "Schedule Tasks for Tomorrow":
      // Placeholder for future functionality
      alert(
        "You selected to schedule tasks for tomorrow. (Placeholder for scheduling tasks.)"
      );
      break;

    default:
      // If no valid option is chosen or the user cancels
      context.cancel();
      break;
  }
}
