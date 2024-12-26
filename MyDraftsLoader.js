/**
 * MyDraftsLoader.js
 *
 * Central loader that imports all the relevant script files in one place.
 * Drafts actions can just `require("MyDraftsLoader.js")`, then call the exposed functions.
 */

// 1) Load common utilities
require("Common/CommonHelpers.js");
require("Common/DateTimeUtils.js");
require("Common/LoggingUtils.js");

/* 2) Load config JSON if desired */
if (typeof globalThis.fm === "undefined") {
  globalThis.fm = FileManager.createCloud();
}
if (typeof globalThis.myConfig === "undefined") {
  globalThis.myConfig = globalThis.fm.readJSON(
    "/Library/Scripts/Common/MyConfig.json"
  );
  if (globalThis.myConfig) {
    console.log(
      "Loaded config: " +
        globalThis.myConfig.appName +
        " (v" +
        globalThis.myConfig.version +
        ")"
    );

    // Set log level from config by default, or default to "info"
    if (globalThis.myConfig.options && globalThis.myConfig.options.logLevel) {
      setLogLevel(globalThis.myConfig.options.logLevel);
    } else {
      setLogLevel("info");
    }
  } else {
    // In case config not found
    setLogLevel("info");
  }
}

// Optional override from template tag "logLevel"
(function () {
  let logLevelOverride = draft.getTemplateTag("logLevel");
  if (logLevelOverride && logLevelOverride.length > 0) {
    console.log("Overriding log level from template tag: " + logLevelOverride);
    setLogLevel(logLevelOverride);
  }
})();

// 3) Load action-specific scripts
// Task-related
require("Actions/TaskActions/ManageOverdueTasks.js");
require("Actions/TaskActions/ProjectMaintenance.js");

// Meeting-related
require("Actions/MeetingActions/AgendaBuilder.js");
require("Actions/MeetingActions/MeetingNotes.js");

// 5) Load new generic scripts
require("Actions/TaskActions/GenericExecutor.js");
require("Actions/TaskActions/GenericTaskProcessor.js");

// 4) Optionally define some “global test functions” or convenience wrappers

function loaderTestFunction() {
  console.log("loaderTestFunction() says hello!");
  // We can call any function from the files we loaded:
  someSharedHelperFunction();
  logCustomMessage("Called from loaderTestFunction()");
}

// Loaded config: My Hybrid Drafts System (v0.1)
// Log level set to: info
// Script step completed.
// loaderTestFunction() says hello!
// someSharedHelperFunction() has been called!
// [INFO] Called from loaderTestFunction()
// Script step completed.

function loaderCustomDateCheck() {
  const dateStr = getTodayDateString();
  console.log("Loader's custom date check: " + dateStr);
}

// Example custom class inside the loader
if (typeof LoaderUtilityClass === "undefined") {
  class LoaderUtilityClass {
    constructor() {
      this.loaderProp = "LoaderProp";
    }

    showInfo() {
      console.log("LoaderUtilityClass showInfo: " + this.loaderProp);
    }
  }
}
