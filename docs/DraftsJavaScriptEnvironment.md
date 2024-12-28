# Drafts JavaScript Environment

Drafts uses a JavaScript runtime based on JavaScriptCore (ES6). While it supports many standard JavaScript features for data types such as strings, numbers, dates, arrays, and objects, some ES6 module syntax like `import` and `export` are not supported in Drafts.

## Module System

In the Drafts environment, modules should use the CommonJS syntax. For instance, instead of:

```javascript
import { logScriptStepCompleted } from "LoggingUtils";

you should write:

const { logScriptStepCompleted } = require("LoggingUtils");

Similarly, instead of export function foo() { ... }, you would do:

function foo() { ... }

module.exports = {
	foo
};

This ensures compatibility with Drafts’ scripting environment.

Date Parsing

Drafts also includes the Date.js library, which enhances the standard JavaScript Date object with additional parsing capabilities and helpful methods.

Additional Resources
	•	Drafts User Guide offers more details on how to leverage scripting capabilities in Drafts.
	•	Drafts Date.js Docs provide insight into advanced date usage.

Using CommonJS syntax and the provided enhancements will ensure your scripts run smoothly within Drafts.
