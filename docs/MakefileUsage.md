# Makefile Usage

This Makefile helps synchronize your local repository content to Drafts’ iCloud Scripts directory.

## How It Works

- **Makefile** defines a couple of targets:
  - `make all`: Just shows a reminder message.
  - `make install`: Copies the specified files and directories to your iCloud Drafts Scripts directory.

- It uses `rsync` to selectively copy files from your local folders (`Common`, `Actions`, etc.) into the Drafts iCloud Scripts folder. Because `rsync` is used with the `-av` flags (archive, verbose), timestamps and file permissions remain consistent. It also only copies changed files, making updates quick.

## Configuration

- **DRAFTS_SCRIPTS_DIR**:
  - In the Makefile, confirm that `DRAFTS_SCRIPTS_DIR` is set to the correct path of your iCloud Drafts Scripts directory. This path can vary per operating system or user setup.

- **SYNC_DIRS**:
  - This variable defines which directories or files from your repo to sync. By default, it's set to `Common Actions MyDraftsLoader.js USAGE.md`. If you want to exclude or add more directories, update it in the Makefile.

## Running the Sync

1. Open a terminal in the root of your local repository (where the Makefile resides).
2. Type:

  ```bash
  make install
  ```

3. The Makefile will:
  - Announce it is installing to the configured iCloud Scripts folder.
  - Run `rsync` for each item in `SYNC_DIRS`.
  - Print a final message upon completion.

## Excludes

- The `RSYNC_EXCLUDES` variable in the Makefile omits `.git`, `.DS_Store`, `node_modules`, etc. Feel free to add or remove excludes as needed.

## Troubleshooting

- Missing Separator error: Make sure that the recipe lines in the Makefile (the commands under each target) are indented with an actual tab, not spaces. This is a Make requirement.
- If you see other path issues, double-check your environment or shell expansions.

## Why This Approach

- This method ensures you don’t inadvertently overwrite other files in the Drafts Scripts folder. You only sync the subfolders and files specified by `SYNC_DIRS`.
- You keep your code version-controlled in this local repo while easily deploying updates to Drafts using the Makefile.

## Additional Tips

- You can add more advanced targets (e.g., `make uninstall` to remove certain files in Drafts) or additional excludes if you have large directories you don’t want synced.
- For Windows or other non-macOS environments, you may need to adapt the path or use a different approach. The concept remains the same: keep your local scripts in version control, then push them to the iCloud Scripts area with an explicit copy mechanism.

## Handling Spaces or Tildes in the iCloud Path with a Symlink

If you encounter problems running `rsync` due to the iCloud path (like `~/Library/Mobile Documents/...`) containing spaces or special characters, consider creating a symbolic link. You can then point your Makefile’s `DRAFTS_SCRIPTS_DIR` to this symlink, avoiding complicated quoting or escaping. For example:

```makefile
# Instead of referencing the iCloud path directly:
REAL_ICLOUD_DRAFTS_PATH := "$(HOME)/Library/Mobile Documents/iCloud~com~agiletortoise~Drafts5/Documents/Library/Scripts"
DRAFTS_SYMLINK_NAME := DraftsICloud
DRAFTS_SCRIPTS_DIR := $(HOME)/$(DRAFTS_SYMLINK_NAME)

setup-symlink:
    @echo "Creating or refreshing symlink..."
    @if [ -L "$(DRAFTS_SCRIPTS_DIR)" ]; then rm "$(DRAFTS_SCRIPTS_DIR)"; fi
    ln -s $(REAL_ICLOUD_DRAFTS_PATH) "$(DRAFTS_SCRIPTS_DIR)"
    @echo "Symlink created at $(DRAFTS_SCRIPTS_DIR) -> $(REAL_ICLOUD_DRAFTS_PATH)"

Then run:

make setup-symlink
make install

Your files should now sync without path-related errors.