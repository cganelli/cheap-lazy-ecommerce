#!/usr/bin/env bash

set -euo pipefail

FEATURE_BASE_NAME="feat/review-modal"

TAG_PREFIX="baseline-pre-review-modal"

BACKUP_PREFIX="backup/pre-review-modal"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a Git repo. Open your project folder in Cursor and try again."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "No origin remote. Add it first: git remote add origin <url>"
  exit 1
fi

BASE_MSG="chore: baseline before review modal work"

git add -A
git commit --allow-empty -m "$BASE_MSG"

DATE=$(date +"%Y-%m-%d")
STAMP=$(date +"%Y%m%d-%H%M%S")

TAG_NAME="${TAG_PREFIX}-${DATE}"
if git rev-parse -q --verify "refs/tags/${TAG_NAME}" >/dev/null; then
  TAG_NAME="${TAG_PREFIX}-${STAMP}"
fi

git tag -a "$TAG_NAME" -m "Baseline before review modal work"
git push origin "$TAG_NAME"

BACKUP_BRANCH="${BACKUP_PREFIX}-${DATE}"
if git show-ref --verify --quiet "refs/heads/${BACKUP_BRANCH}"; then
  BACKUP_BRANCH="${BACKUP_PREFIX}-${STAMP}"
fi

git branch "$BACKUP_BRANCH"
git push -u origin "$BACKUP_BRANCH"

FEATURE_BRANCH="${FEATURE_BASE_NAME}"
if git show-ref --verify --quiet "refs/heads/${FEATURE_BRANCH}"; then
  FEATURE_BRANCH="${FEATURE_BASE_NAME}-${STAMP}"
fi

git checkout -b "$FEATURE_BRANCH"
git push -u origin "$FEATURE_BRANCH"

echo
echo "All set."
echo "Tag:      $TAG_NAME"
echo "Backup:   $BACKUP_BRANCH"
echo "Feature:  $FEATURE_BRANCH"
echo
echo "Next steps"
echo "  Start editing on branch: $FEATURE_BRANCH"
echo
echo "To roll back later"
echo "  git fetch --all --tags"
echo "  git checkout -b fix/rollback-pre-review-modal $TAG_NAME"
echo "  git push -u origin fix/rollback-pre-review-modal"

