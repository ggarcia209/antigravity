#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# Get absolute path of this test script directory
TEST_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "$TEST_DIR/.." && pwd)

echo "Starting tests for sync-agent.sh..."
echo "Repository root: $REPO_ROOT"

# Determine the current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Create a temporary sandbox directory for testing
SANDBOX_DIR=$(mktemp -d)
cleanup() {
    echo "Cleaning up sandbox directory: $SANDBOX_DIR"
    rm -rf "$SANDBOX_DIR"
}
trap cleanup EXIT

# 1. Create a mock target repo inside the sandbox
MOCK_REPO="$SANDBOX_DIR/mock-target-repo"
mkdir -p "$MOCK_REPO"
(
    cd "$MOCK_REPO"
    git init --quiet
    # Add a dummy commit so it's a valid repo
    echo "# Mock Target Repo" > README.md
    git add README.md
    git config user.name "Test User"
    git config user.email "test@example.com"
    git commit -m "Initial commit" --quiet
)

echo "Created mock target repository at $MOCK_REPO"

# 2. Run the sync script targeting the mock repo, using the local repository as the source URL and the current branch
echo "Running sync-agent.sh..."
"$REPO_ROOT/scripts/sync-agent.sh" --repo "$REPO_ROOT" --branch "$CURRENT_BRANCH" "$MOCK_REPO"

# 3. Assertions
echo "Verifying copied files..."

# Check if rules directory exists and contains files
if [ ! -d "$MOCK_REPO/.agent/rules" ]; then
    echo "FAIL: .agent/rules directory does not exist" >&2
    exit 1
fi

if [ -z "$(ls -A "$MOCK_REPO/.agent/rules")" ]; then
    echo "FAIL: .agent/rules directory is empty" >&2
    exit 1
fi

# Check if workflows directory exists and contains files
if [ ! -d "$MOCK_REPO/.agent/workflows" ]; then
    echo "FAIL: .agent/workflows directory does not exist" >&2
    exit 1
fi

if [ -z "$(ls -A "$MOCK_REPO/.agent/workflows")" ]; then
    echo "FAIL: .agent/workflows directory is empty" >&2
    exit 1
fi

# Verify specific files exist in target
echo "Verifying specific files..."
for rule_file in GEMINI.md development.md golang.md; do
    if [ ! -f "$MOCK_REPO/.agent/rules/$rule_file" ]; then
        echo "FAIL: rule file $rule_file was not copied" >&2
        exit 1
    fi
done

for workflow_file in developer.md QA-testing.md project-manager.md; do
    # Check case-insensitively or exactly. The actual files are QA-testing.md or qa-testing.md?
    # Let's check exactly: we had qa-testing.md in lower case in the list_dir output! Let's check:
    # "qa-testing.md", "developer.md", "project-manager.md"
    if [ ! -f "$MOCK_REPO/.agent/workflows/$(echo "$workflow_file" | tr '[:upper:]' '[:lower:]')" ]; then
        echo "FAIL: workflow file $workflow_file was not copied" >&2
        exit 1
    fi
done

echo "SUCCESS: All files copied and verified successfully!"
