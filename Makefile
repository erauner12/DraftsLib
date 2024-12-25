SHELL := /bin/bash

# Update this to your actual iCloud Drafts Scripts directory path if different:
# Wrap in quotes and do not escape spaces with backslashes inside this variable;
# we will let the shell interpret it when we quote DRAFTS_SCRIPTS_DIR in the recipe.
DRAFTS_SCRIPTS_DIR := $(HOME)/Library/Mobile\ Documents/iCloud~com~agiletortoise~Drafts5/Documents/Library/Scripts

# If you want to exclude or customize other directories, adjust here
SYNC_DIRS := Common Actions MyDraftsLoader.js USAGE.md

# Exclusions:
#   .git, node_modules, etc.
#   Feel free to expand excludes as needed.
RSYNC_EXCLUDES := --exclude .git --exclude .DS_Store --exclude node_modules --exclude .gitignore

.PHONY: all install

all:
	@echo "No default target. Use 'make install' to sync files to Drafts iCloud Scripts."

install:
	@echo "Installing local files from $(CURDIR) to $(DRAFTS_SCRIPTS_DIR)..."
	for item in $(SYNC_DIRS); do \
		echo "Syncing: $$item"; \
		rsync -av $(RSYNC_EXCLUDES) "$(CURDIR)/$$item" "$(DRAFTS_SCRIPTS_DIR)/"; \
	done
	@echo "Sync complete. Any new or changed files in these directories have been copied."

# Additional convenience target example:
# You could add a 'make clean' or 'make uninstall' if needed,
# but generally you only need 'make install'.
# but generally you only need 'make install'.
