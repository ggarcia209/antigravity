#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# Default repository URL (SSH)
DEFAULT_REPO_URL="git@github.com:ggarcia209/antigravity.git"
HTTPS_REPO_URL="https://github.com/ggarcia209/antigravity.git"

# Function to display usage information
usage() {
    echo "Usage: $0 [options] <target_repo_path>"
    echo
    echo "Options:"
    echo "  -h, --help      Show this help message and exit"
    echo "  -b, --branch    Branch/tag/commit to sync from (default: main)"
    echo "  -r, --repo      Remote repository URL (default: $DEFAULT_REPO_URL)"
    echo
    echo "Arguments:"
    echo "  <target_repo_path>  Path to the target local repository where rules should be copied."
    echo "                      If not specified, defaults to the current working directory."
    echo
    exit 1
}

# Parse options
BRANCH="main"
REPO_URL=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            usage
            ;;
        -b|--branch)
            if [ -z "${2:-}" ]; then
                echo "Error: --branch requires an argument" >&2
                exit 1
            fi
            BRANCH="$2"
            shift 2
            ;;
        -r|--repo)
            if [ -z "${2:-}" ]; then
                echo "Error: --repo requires an argument" >&2
                exit 1
            fi
            REPO_URL="$2"
            shift 2
            ;;
        -*)
            echo "Error: Unknown option $1" >&2
            usage
            ;;
        *)
            break
            ;;
    esac
done

# Resolve target directory
TARGET_DIR="${1:-.}"

# Check if git is installed
if ! command -v git &>/dev/null; then
    echo "Error: git is required but not installed." >&2
    exit 1
fi

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory '$TARGET_DIR' does not exist." >&2
    exit 1
fi

# Convert target directory to absolute path
TARGET_DIR=$(cd "$TARGET_DIR" && pwd)

echo "Target repository path: $TARGET_DIR"

# Check if the target is a git repository
if [ ! -d "$TARGET_DIR/.git" ]; then
    echo "Warning: Target directory '$TARGET_DIR' is not a git repository."
fi

# Define target .agent directory
TARGET_AGENT_DIR="${TARGET_DIR}/.agent"
echo "Target .agent path: $TARGET_AGENT_DIR"

# Create a temporary directory for sparse checkout
TEMP_DIR=$(mktemp -d)
cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

echo "Fetching rules and workflows from remote origin..."

# Determine repository URLs to try
if [ -n "$REPO_URL" ]; then
    URLS_TO_TRY=("$REPO_URL")
else
    # Try SSH first, then HTTPS
    URLS_TO_TRY=("$DEFAULT_REPO_URL" "$HTTPS_REPO_URL")
fi

CLONED=false
for url in "${URLS_TO_TRY[@]}"; do
    echo "Trying to clone from: $url"
    # We use sparse clone. --filter=blob:none downloads files only when checked out.
    if git clone --depth 1 --branch "$BRANCH" --filter=blob:none --sparse --quiet "$url" "$TEMP_DIR" 2>/dev/null; then
        CLONED=true
        break
    fi
done

if [ "$CLONED" = false ]; then
    echo "Error: Failed to clone the repository. Please check your network connection, repository URL, branch name, or SSH keys." >&2
    exit 1
fi

# Go to temp dir, set sparse checkout paths, and pull/checkout
(
    cd "$TEMP_DIR"
    git sparse-checkout set rules workflows >/dev/null
)

# Ensure target agent directory exists
mkdir -p "$TARGET_AGENT_DIR"

# Remove existing rules/workflows directories in the target to avoid merge conflicts or stale files
if [ -d "$TARGET_AGENT_DIR/rules" ]; then
    echo "Removing existing rules in target..."
    rm -rf "$TARGET_AGENT_DIR/rules"
fi
if [ -d "$TARGET_AGENT_DIR/workflows" ]; then
    echo "Removing existing workflows in target..."
    rm -rf "$TARGET_AGENT_DIR/workflows"
fi

# Copy the directories
echo "Copying rules and workflows..."
cp -R "$TEMP_DIR/rules" "$TARGET_AGENT_DIR/"
cp -R "$TEMP_DIR/workflows" "$TARGET_AGENT_DIR/"

echo "Successfully synchronized rules and workflows from ggarcia209/antigravity!"
echo "Contents of $TARGET_AGENT_DIR:"
ls -F "$TARGET_AGENT_DIR"
