SHELL := /bin/bash

# Instead of referencing the troublesome iCloud path directly,
# we will create/use a symlink in HOME for reliability.
# We'll name it "DraftsICloud", but feel free to rename to something else.
DRAFTS_SYMLINK_NAME := DraftsICloud

# We'll point that symlink to your actual iCloud path with spaces and tildes.
# This "true" path is used only for setting up the link, not in rsync.
REAL_ICLOUD_DRAFTS_PATH := "$(HOME)/Library/Mobile Documents/iCloud~com~agiletortoise~Drafts5/Documents/Library/Scripts"

# The Makefile will use the symlink path with no spaces or special characters.
DRAFTS_SCRIPTS_DIR := $(HOME)/$(DRAFTS_SYMLINK_NAME)

# If you want to exclude or customize other directories, adjust here
SYNC_DIRS := Common Actions MyDraftsLoader.js USAGE.md

# Exclusions:
#   .git, node_modules, etc.
#   Feel free to expand excludes as needed.
RSYNC_EXCLUDES := --exclude .git --exclude .DS_Store --exclude node_modules --exclude .gitignore

.PHONY: all install setup-symlink

all:
	@echo "No default target. Use 'make install' to sync files to Drafts iCloud Scripts."

# Create a symlink in your HOME folder, pointing to the iCloud Scripts path.
setup-symlink:
	@echo "Creating or refreshing symlink for Drafts Scripts..."
	# Remove existing symlink if it exists
	@if [ -L "$(DRAFTS_SCRIPTS_DIR)" ]; then rm "$(DRAFTS_SCRIPTS_DIR)"; fi
	# Create the new symlink
	ln -s $(REAL_ICLOUD_DRAFTS_PATH) "$(DRAFTS_SCRIPTS_DIR)"
	@echo "Symlink created at $(DRAFTS_SCRIPTS_DIR) -> $(REAL_ICLOUD_DRAFTS_PATH)"
	@echo "Now run 'make install' to rsync your scripts."

install:
	@echo "Installing local files from $(CURDIR) to $(DRAFTS_SCRIPTS_DIR)..."
	for item in $(SYNC_DIRS); do \
		echo "Syncing: $$item"; \
		rsync -av $(RSYNC_EXCLUDES) "$(CURDIR)/$$item" "$(DRAFTS_SCRIPTS_DIR)/"; \
	done
	@echo "Sync complete. Any new or changed files in these directories have been copied."
