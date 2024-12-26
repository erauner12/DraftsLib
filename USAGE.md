# USAGE: Binding Drafts Actions to Your Library Scripts

This document outlines how to set up and use a single library of functions or “scripts” in Drafts, focusing on best practices for maintaining your code in one place (MyDraftsLoader.js) and then referencing the relevant functions from Drafts actions.

---

## 1. File Structure Overview

A typical file layout in your iCloud Drive’s Drafts Scripts folder might look like:

Drafts5 (iCloud Drive)
└── Library
└── Scripts
├── Common
│   ├── CommonHelpers.js
│   ├── DateTimeUtils.js
│   ├── LoggingUtils.js
│   └── MyConfig.json
├── Actions
│   ├── SchedulerEntryPoint.js
│   ├── TaskActions
│   │   ├── ManageOverdueTasks.js
│   │   └── ProjectMaintenance.js
│   ├── MeetingActions
│   │   ├── AgendaBuilder.js
│   │   ├── MeetingNotes.js
├── MyDraftsLoader.js
└── …

- **Common**: Shared utilities, helpers, configuration, etc.
- **Actions**: All your action-specific scripts (e.g., ManageOverdueTasks.js, SchedulerEntryPoint.js, etc.).
- **MyDraftsLoader.js**: The master loader that requires all necessary files and sets up the environment (e.g., logging, config load).

All scripts placed here can be `require()`-ed in your Drafts actions.

---

## 2. Creating a Drafts Action

When you create a new Drafts action (or edit an existing one), use this recommended pattern:

1. **Script Step** (required):
	```js
	require("MyDraftsLoader.js");
	// MyDraftsLoader.js includes every relevant script in your library

	// Now call a function from one of the loaded scripts:
	SchedulerEntryPoint_run();
	// or ManageOverdueTasks_run(), or any other function you have defined

	2.	Optionally, if you want to pass template tags (for example, for log levels or other overrides), you can set them in the Draft’s template tags or in an additional step, then read them in MyDraftsLoader.js if needed.

That’s it! Drafts will load your entire library, giving you access to all defined functions (e.g., ManageOverdueTasks_run(), AgendaBuilder_run(), etc.).

3. Adding a New Action to Your Library

3.1 Create a New File in Actions

Suppose you want a new action called “CleanUpTitles”. You can do the following:
	•	In DraftsLib/Actions, create a new script file: CleanUpTitles.js.
	•	Inside this file, define a function, for example:

function CleanUpTitles_run() {
	// ...
	console.log("CleanUpTitles_run() was called!");
	// Add your cleanup logic here
}


	•	That’s all you need for the script itself.

3.2 Require It in MyDraftsLoader.js

Open MyDraftsLoader.js and add a require statement:

require("Actions/CleanUpTitles.js");

(This ensures it’s loaded every time.)

3.3 Invoke from a Drafts Action

Create a new Drafts action or edit an existing one:
	1.	Add a Script step with:

require("MyDraftsLoader.js");
CleanUpTitles_run();


	2.	Done! Whenever you run this Drafts action, the CleanUpTitles_run() function is available to call.

4. Example: Managing Overdue Tasks

If you have a script named ManageOverdueTasks.js in Actions/TaskActions, and it exports a function ManageOverdueTasks_run(), simply do:

// Drafts Action (Script step)
require("MyDraftsLoader.js");
ManageOverdueTasks_run();

This loads the entire library environment and then executes the logic in ManageOverdueTasks_run().

5. Why This Approach?
	1.	Single-Point Maintenance:
You only need to edit MyDraftsLoader.js to load new scripts or adjust config. No need to replicate require statements in multiple actions.
	2.	Full Script Access:
Once the loader is done, every function from your library scripts is globally available, so you can call them from any Drafts action.
	3.	Easier Updates:
You can modify or create new scripts in the /Library/Scripts/Actions folder. The next time you run a Drafts action that includes MyDraftsLoader.js, your changes are automatically used.

6. Maintaining & Updating
	•	Add or Remove Scripts: If you create a new script or rename an existing one, update the relevant require("...") lines in MyDraftsLoader.js.
	•	Change or Rename Library Functions: If you rename MyAction_run() to MyAction_execute(), be sure to update the references in your actions.
	•	Credentials: If your scripts use external services (e.g., Todoist, OpenAI), confirm you handle credentials in the scripts that require them (like we do for ManageOverdueTasks.js with Credential.create("Todoist", ...)).

7. Example Layout

A final hypothetical layout:
	•	Common (folder)
	•	CommonHelpers.js
	•	DateTimeUtils.js
	•	LoggingUtils.js
	•	MyConfig.json
	•	Actions (folder)
	•	SchedulerEntryPoint.js (distributes logic based on action.name)
	•	TaskActions (folder)
	•	ManageOverdueTasks.js
	•	ProjectMaintenance.js
	•	MeetingActions (folder)
	•	AgendaBuilder.js
	•	MeetingNotes.js
	•	CleanUpTitles.js (example new script)
	•	MyDraftsLoader.js

Each .js file declares one or more functions (like CleanUpTitles_run(), AgendaBuilder_run(), etc.). The loader file MyDraftsLoader.js includes them all with require(...). You then create or modify a Drafts action that references MyDraftsLoader.js and calls whichever function you need.

That’s it! You now have a simple, flexible approach to centralize all your Drafts scripts in one library and call them easily from your actions.
