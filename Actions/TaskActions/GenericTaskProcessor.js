/**
 * GenericTaskProcessor.js
 * Integrated from the previous processor.js gist.
 */

function GenericTaskProcessor_run() {
  (() => {
    console.log("Generic Task Processor started.");

    const credential = Credential.create("Todoist", "Todoist API Token");
    credential.addPasswordField("apiToken", "API Token");
    credential.authorize();

    let todoist = Todoist.create();
    todoist.token = credential.getValue("apiToken");

    function getTaskProcessingDrafts() {
      let ws = app.currentWorkspace;
      let allDrafts = ws.query("all");
      return allDrafts.filter((d) => d.hasTag("task-processing"));
    }

    function loadDraftIntoEditor(d) {
      if (!d) return false;
      editor.load(d);
      return true;
    }

    function logTodoistCallResult(actionDescription, success) {
      if (success) {
        console.log(actionDescription + " succeeded.");
        console.log("Todoist lastResponse:", JSON.stringify(todoist.lastResponse));
      } else {
        console.log(actionDescription + " failed.");
        let errorMsg = todoist.lastError ? todoist.lastError : "No error message.";
        let responseMsg = JSON.stringify(todoist.lastResponse);
        console.log("Todoist lastError:", errorMsg);
        console.log("Todoist lastResponse:", responseMsg);
        alert(
          "Action \"" + actionDescription + "\" failed.\\n\\nError: " +
          errorMsg + "\\nResponse: " + responseMsg
        );
      }
      return success;
    }

    function processTaskAction(actionDescription, apiCallFunction) {
      console.log("Attempting to " + actionDescription + "...");
      const result = apiCallFunction();
      const success = !!result;

      if (success) {
        console.log(actionDescription + " succeeded.");
      } else {
        console.log(actionDescription + " failed.");
        const errorMsg = todoist.lastError || "No error message.";
        const responseMsg = JSON.stringify(todoist.lastResponse);
        console.log("Todoist lastError: " + errorMsg);
        console.log("Todoist lastResponse: " + responseMsg);
        alert(
          "Action \"" + actionDescription + "\" failed.\\n\\nError: " +
          errorMsg + "\\nResponse: " + responseMsg
        );
      }
      console.log("Todoist lastResponse: " + JSON.stringify(todoist.lastResponse));
      return success;
    }

    function getScopedTagValue(d, prefix) {
      for (let t of d.tags) {
        if (t.startsWith(prefix)) {
          return t.substring(prefix.length).trim();
        }
      }
      return null;
    }

    function canProcessAutomatically(jsonData) {
      if (!jsonData.action) {
        return false;
      }
      switch (jsonData.action) {
        case "Assign Duration":
          return jsonData.duration !== undefined && jsonData.duration !== null;
        case "Assign Time & Duration":
          return jsonData.dueTime && jsonData.duration;
        case "Reschedule to Today":
          return true;
        case "Complete Task":
        case "Complete Tasks":
          return true;
        case "Move Deadline":
          return jsonData.newDueDate !== undefined && jsonData.newDueDate !== null;
        default:
          return false;
      }
    }

    let processingDrafts = getTaskProcessingDrafts();
    if (processingDrafts.length === 0) {
      console.log("No task-processing drafts found.");
      return;
    }

    loadDraftIntoEditor(processingDrafts[0]);

    while (true) {
      let currentDraft = editor.draft;
      if (!currentDraft || !currentDraft.hasTag("task-processing")) {
        console.log("Current draft not valid or no longer task-processing. Finding next...");
        processingDrafts = getTaskProcessingDrafts();
        if (processingDrafts.length === 0) {
          console.log("No more task-processing drafts.");
          return;
        }
        loadDraftIntoEditor(processingDrafts[0]);
        currentDraft = editor.draft;
      }

      let draftContentLines = currentDraft.content.split("\\n");
      let taskIdLine = draftContentLines[0].trim();
      let jsonDataLine = (draftContentLines.length >= 2) ? draftContentLines[1].trim() : null;

      let taskId = taskIdLine.replace("task_", "");
      console.log("Extracted taskId: " + taskId);

      let jsonData = null;
      if (jsonDataLine) {
        try {
          jsonData = JSON.parse(jsonDataLine);
          console.log("Parsed JSON metadata:", JSON.stringify(jsonData));
        } catch (error) {
          console.log("Error parsing JSON metadata: ", error);
          jsonData = {};
        }
      } else {
        console.log("No JSON metadata found in draft content.");
        jsonData = {};
      }

      let tags = currentDraft.tags;
      console.log("Current draft tags:", JSON.stringify(tags));

      let taskData = todoist.getTask(taskId);
      if (!taskData) {
        console.log("Failed to fetch Todoist data for task " + taskId + ". Trashing draft.");
        let errorMsg = todoist.lastError || "No error message.";
        let responseMsg = JSON.stringify(todoist.lastResponse);
        console.log("Todoist lastError:", errorMsg);
        console.log("Todoist lastResponse:", responseMsg);
        alert(
          "Failed to fetch task data.\\n\\nError: " + errorMsg +
          "\\nResponse: " + responseMsg
        );
        currentDraft.isTrashed = true;
        currentDraft.update();
        let remaining = getTaskProcessingDrafts();
        if (remaining.length === 0) {
          console.log("No more task-processing drafts.");
          return;
        }
        loadDraftIntoEditor(remaining[0]);
        continue;
      } else {
        console.log("Successfully fetched data for task " + taskId + ".");
        console.log("Todoist lastResponse:", JSON.stringify(todoist.lastResponse));
      }

      let commentsArray = todoist.getComments({ task_id: taskId });
      let formattedComments = "";
      if (commentsArray && commentsArray.length > 0) {
        for (let commentObj of commentsArray) {
          let postedAt = new Date(commentObj.posted_at).toLocaleString();
          formattedComments += postedAt + "\\n" + commentObj.content + "\\n\\n";
        }
      } else {
        formattedComments = "No comments available.";
      }

      let scenario = {
        isOverdue: tags.includes("action-manage-overdue-tasks"),
        isDeadline: tags.includes("action-manage-deadline-tasks"),
        isAssignDuration: tags.includes("action-assign-duration"),
        isAssignTimeDuration: tags.includes("action-assign-time-duration"),
        rescheduleToday: tags.includes("reschedule-today"),
        completeTasks: tags.includes("complete-tasks"),
        moveDeadline: tags.includes("move-deadline"),
        metadata: jsonData
      };

      if (canProcessAutomatically(jsonData)) {
        console.log("Processing task automatically based on JSON metadata.");
        let success = false;

        switch (jsonData.action) {
          case "Assign Duration":
            let updatedContent = taskData.content + " (🕒 " + jsonData.duration + " min)";
            success = processTaskAction("Assigning duration", () => {
              return todoist.updateTask(taskId, {
                content: updatedContent
              });
            });
            break;

          case "Assign Time & Duration":
            let todayDate = new Date().toISOString().split("T")[0];
            let dueDateTime = todayDate + "T" + jsonData.dueTime + ":00";
            let updatedContentTime = taskData.content + " (🕒 " + jsonData.duration + " min)";
            success = processTaskAction("Assigning time & duration", () => {
              return todoist.updateTask(taskId, {
                content: updatedContentTime,
                due_datetime: dueDateTime
              });
            });
            break;

          case "Reschedule to Today":
            success = processTaskAction("Rescheduling to today", () => {
              return todoist.updateTask(taskId, {
                content: taskData.content,
                due_string: "today"
              });
            });
            break;

          case "Complete Tasks":
          case "Complete Task":
            success = processTaskAction("Completing task", () => {
              return todoist.closeTask(taskId);
            });
            break;

          case "Move Deadline":
            success = processTaskAction("Moving deadline", () => {
              return todoist.updateTask(taskId, {
                due_string: jsonData.newDueDate
              });
            });
            break;

          default:
            console.log("Action \"" + jsonData.action + "\" is not recognized for automatic processing.");
            break;
        }

        if (success) {
          currentDraft.isTrashed = true;
          currentDraft.update();
        } else {
          console.log("Task processing failed. Keeping the draft for retry.");
          continue;
        }

        let remaining = getTaskProcessingDrafts();
        if (remaining.length === 0) {
          console.log("No more task-processing drafts.");
          return;
        }
        loadDraftIntoEditor(remaining[0]);
        continue;
      } else {
        console.log("Required data not fully present, prompting user.");

        let result = showMainPrompt(taskData, formattedComments, scenario);
        let action = result.action;
        let fields = result.fields;
        if (!action) {
          return;
        }
        if (action === "Cancel") {
          console.log("User cancelled entire process at main prompt.");
          return;
        }
        if (action === "Skip") {
          console.log("User skipped this task.");
        } else if (action === "Add Comment") {
          let cPrompt = new Prompt();
          cPrompt.title = "Add Comment";
          cPrompt.addTextView("comment", "Comment", "");
          cPrompt.addButton("OK");
          cPrompt.addButton("Cancel");
          console.log("Showing Add Comment prompt...");
          if (cPrompt.show() && cPrompt.buttonPressed === "OK") {
            let commentText = cPrompt.fieldValues["comment"];
            console.log("Attempting to add comment: \"" + commentText + "\" to task " + taskId + "...");
            let res = todoist.createComment({
              task_id: taskId,
              content: commentText
            });
            logTodoistCallResult("Adding comment", !!res);
          } else {
            console.log("Comment prompt cancelled by user.");
          }
        } else if (action === "Modify Task") {
          let modifiedValues = showModifyPrompt(fields.title, fields.due, fields.comments);
          if (modifiedValues) {
            fields = modifiedValues;
            continue;
          } else {
            continue;
          }
        } else if (action === "Open Task Link") {
          let taskUrl = "https://todoist.com/showTask?id=" + taskId;
          app.openURL(taskUrl);
          console.log("Opened task link: " + taskUrl);
        } else if (action === "Reschedule") {
          let dueString = showReschedulePrompt();
          if (dueString) {
            success = processTaskAction("Rescheduling task", () => {
              return todoist.updateTask(taskId, {
                content: taskData.content,
                due_string: dueString
              });
            });
          }
        } else if (action === "Complete Task") {
          success = processTaskAction("Completing task", () => {
            return todoist.closeTask(taskId);
          });
        } else if (action === "Move Deadline") {
          if (jsonData && jsonData.newDueDate) {
            success = processTaskAction("Moving deadline", () => {
              return todoist.updateTask(taskId, {
                content: taskData.content,
                due_string: jsonData.newDueDate
              });
            });
          } else {
            let existingDueDate = getScopedTagValue(currentDraft, "due-date::");
            let newDueDate = existingDueDate;
            if (!newDueDate) {
              let dPrompt = new Prompt();
              dPrompt.title = "New Deadline";
              dPrompt.addTextField("newDueDate", "Due Date", "");
              dPrompt.addButton("OK");
              console.log("Showing Move Deadline prompt...");
              if (!dPrompt.show() || dPrompt.buttonPressed !== "OK") {
                console.log("Deadline prompt cancelled by user.");
              } else {
                newDueDate = dPrompt.fieldValues["newDueDate"];
              }
            }
            if (newDueDate) {
              console.log("Attempting to update deadline for task " + taskId + " to \"" + newDueDate + "\"...");
              let r = todoist.updateTask(taskId, {
                content: taskData.content,
                due_string: newDueDate
              });
              logTodoistCallResult("Updating deadline", !!r);
            }
          }
        } else if (action === "Assign Duration") {
          if (jsonData && jsonData.duration) {
            let updatedContent = taskData.content + " (🕒 " + jsonData.duration + " min)";
            console.log("Using duration from metadata: " + jsonData.duration + " min");
            let result = todoist.updateTask(taskId, {
              content: updatedContent
            });
            logTodoistCallResult("Assigning duration", !!result);
          } else {
            let existingDuration = getScopedTagValue(currentDraft, "duration::");
            let duration = existingDuration;
            if (!duration) {
              let durPrompt = new Prompt();
              durPrompt.title = "Duration";
              durPrompt.addTextField("duration", "Minutes", "");
              durPrompt.addButton("OK");
              console.log("Showing Assign Duration prompt...");
              if (!durPrompt.show() || durPrompt.buttonPressed !== "OK") {
                console.log("Duration prompt cancelled by user.");
              } else {
                duration = durPrompt.fieldValues["duration"];
              }
            }
            if (duration) {
              let updatedContent = taskData.content + " (🕒 " + duration + " min)";
              console.log("Attempting to assign duration to task " + taskId + ": \"" + updatedContent + "\"");
              let result = todoist.updateTask(taskId, {
                content: updatedContent
              });
              logTodoistCallResult("Assigning duration", !!result);
            }
          }
        } else if (action === "Assign Time & Duration") {
          let dueTime = jsonData && jsonData.dueTime;
          let duration = jsonData && jsonData.duration;

          if (!dueTime || !duration) {
            if (!dueTime) {
              let timePrompt = new Prompt();
              timePrompt.title = "Due Time (HH:MM)";
              timePrompt.addTextField("dueTime", "Due Time", "");
              timePrompt.addButton("OK");
              console.log("Showing Due Time prompt...");
              if (!timePrompt.show() || timePrompt.buttonPressed !== "OK") {
                console.log("User cancelled due time prompt.");
              } else {
                dueTime = timePrompt.fieldValues["dueTime"];
              }
            }
            if (!duration) {
              let durPrompt2 = new Prompt();
              durPrompt2.title = "Duration";
              durPrompt2.addTextField("duration", "Minutes", "");
              durPrompt2.addButton("OK");
              console.log("Showing Duration prompt after due time...");
              if (!durPrompt2.show() || durPrompt2.buttonPressed !== "OK") {
                console.log("Cancelled duration prompt.");
              } else {
                duration = durPrompt2.fieldValues["duration"];
              }
            }
          }

          if (dueTime && duration) {
            let todayDate = new Date().toISOString().split("T")[0];
            let dueDateTime = todayDate + "T" + dueTime + ":00";
            let updatedContent = taskData.content + " (🕒 " + duration + " min)";
            console.log("Attempting to assign time & duration to task " + taskId + ": due at " + dueDateTime + ", \"" + updatedContent + "\"");
            let result = todoist.updateTask(taskId, {
              content: updatedContent,
              due_datetime: dueDateTime
            });
            logTodoistCallResult("Assigning time & duration", !!result);
          }
        }

        console.log("Showing post-processing prompt (Archive/Trash/Keep/Re-Run)...");
        let finalPrompt = new Prompt();
        finalPrompt.title = "Post-Processing";
        finalPrompt.message = "What do you want to do with this draft?";
        finalPrompt.addButton("Archive");
        finalPrompt.addButton("Trash");
        finalPrompt.addButton("Keep");
        finalPrompt.addButton("Re-Run on This Draft");
        if (!finalPrompt.show()) {
          console.log("User cancelled post-processing prompt.");
          return;
        }

        let postChoice = finalPrompt.buttonPressed;
        console.log("User chose post-processing option: " + postChoice);

        if (postChoice === "Archive") {
          currentDraft.isArchived = true;
          currentDraft.update();
          console.log("Draft archived.");
        } else if (postChoice === "Trash") {
          currentDraft.isTrashed = true;
          currentDraft.update();
          console.log("Draft trashed.");
        } else if (postChoice === "Keep") {
          console.log("Draft kept in inbox.");
        } else if (postChoice === "Re-Run on This Draft") {
          console.log("Re-running on the same draft...");
          continue;
        }

        let remaining = getTaskProcessingDrafts();
        if (remaining.length === 0) {
          console.log("No more task-processing drafts left.");
          return;
        }

        if (postChoice !== "Re-Run on This Draft") {
          if (remaining[0].uuid !== currentDraft.uuid) {
            loadDraftIntoEditor(remaining[0]);
          } else {
            console.log("No new draft to process, ending.");
            return;
          }
        }
      }

      // Nested function definitions from original gist for user prompting:
      function showMainPrompt(taskData, commentsText, scenario) {
        let p = new Prompt();
        p.title = "Task Review & Action";
        p.message = "Review the task details below and select an action.";

        let dueInfo = "None";
        if (taskData.due && taskData.due.string) {
          dueInfo = taskData.due.string;
          if (taskData.due.datetime) {
            dueInfo += " (" + taskData.due.datetime + ")";
          } else if (taskData.due.date) {
            dueInfo += " (" + taskData.due.date + ")";
          }
        }

        p.addTextField("title", "Title", taskData.content);
        p.fieldValues["title"] = taskData.content;
        p.addTextField("due", "Due Info", dueInfo);
        p.fieldValues["due"] = dueInfo;
        p.addTextView("comments", "Comments", commentsText);
        p.fieldValues["comments"] = commentsText;

        p.addButton("Modify Task");
        p.addButton("Add Comment");
        p.addButton("Open Task Link");
        p.addButton("Skip");
        p.addButton("Cancel");

        if (scenario.isOverdue) {
          p.addButton("Reschedule");
          if (scenario.completeTasks) p.addButton("Complete Task");
        } else if (scenario.isDeadline) {
          if (scenario.moveDeadline) p.addButton("Move Deadline");
        } else if (scenario.isAssignDuration) {
          p.addButton("Assign Duration");
        } else if (scenario.isAssignTimeDuration) {
          p.addButton("Assign Time & Duration");
        } else {
          p.addButton("Complete Task");
        }

        console.log("Showing main prompt...");
        if (!p.show()) {
          console.log("User cancelled at main prompt.");
          return { action: null };
        }

        let choice = p.buttonPressed;
        console.log("User selected: " + choice);

        return {
          action: choice,
          fields: {
            title: p.fieldValues["title"],
            due: p.fieldValues["due"],
            comments: p.fieldValues["comments"]
          }
        };
      }

      function showModifyPrompt(title, dueInfo, commentsText) {
        let modifyPrompt = new Prompt();
        modifyPrompt.title = "Modify Task";
        modifyPrompt.message = "Update the fields below as needed and press 'Save Changes'.";
        modifyPrompt.addTextField("title", "Title", title);
        modifyPrompt.addTextField("due", "Due Info", dueInfo);
        modifyPrompt.addTextView("comments", "Comments", commentsText);

        modifyPrompt.addButton("Save Changes");
        modifyPrompt.addButton("Cancel");

        console.log("Showing modify task prompt...");
        if (!modifyPrompt.show()) {
          console.log("User cancelled modify prompt.");
          return null;
        }

        if (modifyPrompt.buttonPressed === "Cancel") {
          console.log("User cancelled at modify prompt.");
          return null;
        }

        return {
          title: modifyPrompt.fieldValues["title"],
          due: modifyPrompt.fieldValues["due"],
          comments: modifyPrompt.fieldValues["comments"]
        };
      }

      function showReschedulePrompt() {
        let rp = new Prompt();
        rp.title = "Reschedule Task";
        rp.message = "Pick a common option or choose 'Custom' to enter a custom due string:";
        rp.addButton("Today");
        rp.addButton("Tomorrow");
        rp.addButton("Next Week");
        rp.addButton("Custom");
        rp.addButton("Cancel");

        if (!rp.show()) {
          console.log("User cancelled reschedule prompt.");
          return null;
        }

        let choice = rp.buttonPressed;
        console.log("Reschedule choice: " + choice);

        if (choice === "Cancel") return null;
        if (choice === "Today") return "today";
        if (choice === "Tomorrow") return "tomorrow";
        if (choice === "Next Week") return "next week";

        if (choice === "Custom") {
          let cp = new Prompt();
          cp.title = "Custom Due";
          cp.message = "Enter a natural language due string (e.g. 'in 2 days', 'Friday 5pm'):";
          cp.addTextField("dueCustom", "Due String", "");
          cp.addButton("OK");
          cp.addButton("Cancel");
          if (!cp.show() || cp.buttonPressed === "Cancel") {
            console.log("User cancelled custom due prompt.");
            return null;
          }
          return cp.fieldValues["dueCustom"];
        }

        return null;
      }

    })();
}

