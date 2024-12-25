# Troubleshooting

This file outlines common errors and how to fix them when using the Makefile to sync scripts to Drafts iCloud.

## 1. \`No such file or directory (2)\` or \`mkdir\` Failed

**Cause**: The path to your iCloud Scripts directory wasn't recognized by \`rsync\`.

**Solution**:
- Wrap the path in quotes within the Makefile. For example:
	```makefile
	DRAFTS_SCRIPTS_DIR := "$(HOME)/Library/Mobile Documents/iCloud~com~agiletortoise~Drafts5/Documents/Library/Scripts"

	•	In the recipe lines, also quote the path like this:

rsync -av $(RSYNC_EXCLUDES) "$(CURDIR)/$$item" "$(DRAFTS_SCRIPTS_DIR)/";



2. “missing separator” or “missing `endef`” in Makefile

Cause: Make requires actual TAB characters for recipe lines, not spaces.

Solution:
	•	Check that your text editor uses real tabs for each command line. For example, after the target, you should see something like:

install:
	@echo "Installing..."
	for item in ...

The indentation must be an actual tab character, not spaces.

3. Confirming the Path in macOS Terminal

If you are uncertain of your path, you can run:

cd ~
ls Library/Mobile\ Documents/iCloud\~com\~agiletortoise\~Drafts5/Documents/Library/Scripts

Or open Finder → iCloud Drive → Drafts → Library → Scripts.
If you see spaces, you might need to wrap them in quotes or escape them. The easiest approach is to wrap the entire path in quotes.

4. Still Not Working?
	•	Ensure you spelled “Documents”, “Library”, “Drafts5” exactly as they appear on your system.
	•	If iCloud is disabled or the folder doesn’t exist, you need to confirm the iCloud settings or create the folder.

5. Example

Below is an example snippet of what might work for many macOS setups:

DRAFTS_SCRIPTS_DIR := "$(HOME)/Library/Mobile Documents/iCloud~com~agiletortoise~Drafts5/Documents/Library/Scripts"
install:
	@echo "Syncing from $(CURDIR) to $(DRAFTS_SCRIPTS_DIR)"
	rsync -av --exclude .git $(CURDIR)/Common "$(DRAFTS_SCRIPTS_DIR)/"

Keep everything in quotes, and you should be good to go.