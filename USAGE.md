# USAGE: Binding Drafts Actions to Your Library Scripts

This document provides an overview of how to set up and use a single library of functions or "scripts" in Drafts, binding those functions to new or existing Drafts actions.

## 1. File Structure

Ensure your folder layout is like:

Drafts5 (iCloud Drive)
└── Library
└── Scripts
├── Common
│   ├── CommonHelpers.js
│   ├── DateTimeUtils.js
│   ├── LoggingUtils.js
│   └── MyConfig.json
├── Actions
│   ├── TaskActions
│   │   ├── ManageOverdueTasks.js
│   │   └── ProjectMaintenance.js
│   ├── MeetingActions
│   │   ├── AgendaBuilder.js
│   │   ├── MeetingNotes.js
├── MyDraftsLoader.js

Everything is in /Library/Scripts, and you can `require()` them in your Drafts actions.

## 2. Create or Edit a Drafts Action that Calls the Loader

1. Open Drafts → Actions (right pane).
2. Create a new action or pick an existing one.
3. In the first **Script** step, do something like:

```js
require("MyDraftsLoader.js");

// Now call a function from ManageOverdueTasks:
ManageOverdueTasks_run();

	4.	That’s it! Drafts will load all your utility scripts plus ManageOverdueTasks.js. The function ManageOverdueTasks_run() is now available.

3. Example Usage

If you want to manage overdue tasks:

require("MyDraftsLoader.js");
ManageOverdueTasks_run();

If you want to build an agenda:

require("MyDraftsLoader.js");
AgendaBuilder_run();

If you want to run a loader test function:

require("MyDraftsLoader.js");
loaderTestFunction();

You can define all your utility code in the “Common” folder or the respective “Actions” subfolders. Because MyDraftsLoader.js includes them, you automatically have access to everything.

4. Maintaining Updates

Whenever you modify the scripts under /Common or in the /Actions subfolders, you don’t need to change your Drafts actions. The next time you run the action, the new code is loaded from disk.

5. Overriding/Extending Classes

If you want to override existing Drafts classes or add new classes, do so in your common files and load them inside MyDraftsLoader.js. For example, in CommonHelpers.js, you might define:

function customOverrideOrExtension() {
	// ...
}

Then anywhere after the loader is called, you can do:

customOverrideOrExtension();

6. Example “Manage Overdue Tasks” Action
	•	Step 1 (Script):

require("MyDraftsLoader.js");
ManageOverdueTasks_run();

No further duplication is necessary. All logic is maintained in ManageOverdueTasks.js.

7. The End

That’s the basics. Single loader, multiple scripts, minimal overhead, easy to maintain.
Enjoy coding!