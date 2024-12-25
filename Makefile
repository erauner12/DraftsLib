SHELL := /bin/bash

# Update this to your actual iCloud Drafts Scripts directory path if different:
DRAFTS_SCRIPTS_DIR := $(HOME)/Library/Mobile\\ Documents/iCloud\\~com\\~agiletortoise\\~Drafts5/Documents/Library/Scripts

# If you want to exclude or customize other directories, adjust here
SYNC_DIRS := Common Actions MyDraftsLoader.js USAGE.md

# Exclusions:
#   .git, node_modules, etc. 
#   Feel free to expand excludes as needed.
RSYNC_EXCLUDES := --exclude .git --exclude .DS_Store --exclude node_modules --exclude .gitignore

.PHONY: all install

all:
\t@echo "No default target. Use 'make install' to sync files to Drafts iCloud Scripts."

install:
\t@echo "Installing local files from $(CURDIR) to $(DRAFTS_SCRIPTS_DIR)..."
\t@for item in $(SYNC_DIRS); do \\
\t\techo "Syncing: $$item"; \\
\t\trsync -av $$RSYNC_EXCLUDES "$(CURDIR)/$$item" "$(DRAFTS_SCRIPTS_DIR)/"; \\
\tdone
\t@echo "Sync complete. Any new or changed files in these directories have been copied."

# Additional convenience target example:
# You could add a 'make clean' or 'make uninstall' if needed, 
# but generally you only need 'make install'.
