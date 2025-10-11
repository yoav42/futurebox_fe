#!/usr/bin/env bash
set -euo pipefail

# Simple frontend deploy script
# Usage:
#   ./deployFe.sh 34.245.209.163
#   ./deployFe.sh http://34.245.209.163:8000
#   VITE_API_BASE=http://34.245.209.163:8000 ./deployFe.sh

REGION=${REGION:-eu-west-1}

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI not found. Install and configure (aws configure)." >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install Node.js/NPM." >&2
  exit 1
fi

# Determine API base
ARG=${1:-}
if [[ -n "${VITE_API_BASE:-}" ]]; then
  API_BASE="$VITE_API_BASE"
elif [[ -n "$ARG" ]]; then
  if [[ "$ARG" == http*://* ]]; then
    API_BASE="$ARG"
  else
    API_BASE="http://$ARG:8000"
  fi
elif [[ -f .env.production ]]; then
  API_BASE=$(grep -E '^VITE_API_BASE=' .env.production | sed 's/^VITE_API_BASE=//')
else
  echo "No backend specified; defaulting to http://localhost:8000" >&2
  API_BASE="http://localhost:8000"
fi

echo "Building with VITE_API_BASE=$API_BASE"
export VITE_API_BASE="$API_BASE"

# Install deps and build
npm install
npm run build

# Compute bucket and deploy
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
BUCKET="futurebox-fe-$ACCOUNT-$REGION"

aws s3 sync dist "s3://$BUCKET" --delete --cache-control max-age=31536000,public
aws s3 cp dist/index.html "s3://$BUCKET/index.html" --cache-control no-cache --metadata-directive REPLACE

echo "Deployed: http://$BUCKET.s3-website-$REGION.amazonaws.com"





