#!/usr/bin/env bash

set -euo pipefail

TAG="${1:-}"

if [ -z "$TAG" ]; then
  echo "Usage: scripts/rollback.sh <tag>"
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a Git repo."
  exit 1
fi

git fetch --all --tags

SAFE_TAG="$TAG"
BRANCH="fix/rollback-${SAFE_TAG//\//-}"

git checkout -b "$BRANCH" "$SAFE_TAG"
git push -u origin "$BRANCH"

echo "Opened rollback branch at $SAFE_TAG"

