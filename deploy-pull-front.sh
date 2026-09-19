#!/bin/bash
set -e

PROJECT_DIR="$HOME/front"
LOG_FILE="$HOME/logs/deploy-pull-front.log"

mkdir -p "$HOME/logs"
cd "$PROJECT_DIR"

LOCAL_HASH=$(git rev-parse HEAD)
REMOTE_HASH=$(git ls-remote origin deploy | cut -f1)

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
    exit 0
fi

echo "==========================================" >> "$LOG_FILE"
echo "$(date) - Nouvelle version front détectée..." >> "$LOG_FILE"

git fetch origin deploy >> "$LOG_FILE" 2>&1
git reset --hard origin/deploy >> "$LOG_FILE" 2>&1

touch tmp/restart.txt

echo "$(date) - ✅ Front déployé (commit $(git rev-parse --short HEAD))" >> "$LOG_FILE"
echo "==========================================" >> "$LOG_FILE"