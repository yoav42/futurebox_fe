#!/usr/bin/env bash
set -euo pipefail

# Simple frontend deploy script
# Usage:
#   ./deployFe.sh
# Optional: VITE_API_BASE must be HTTPS if provided.

REGION=${REGION:-eu-west-1}
CLOUDFRONT_DISTRIBUTION_ID=${CLOUDFRONT_DISTRIBUTION_ID:-E28X6VO5PKTZPS}

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI not found. Install and configure (aws configure)." >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Install Node.js/NPM." >&2
  exit 1
fi

# API base: not required. If provided, enforce HTTPS to avoid mixed content.
if [[ -n "${VITE_API_BASE:-}" ]]; then
  if [[ "$VITE_API_BASE" != https://* ]]; then
    echo "VITE_API_BASE must be HTTPS (got: $VITE_API_BASE)" >&2
    exit 1
  fi
  echo "Building with VITE_API_BASE=$VITE_API_BASE"
else
  echo "Building without VITE_API_BASE (runtime will default to /api on HTTPS)."
fi

# Install deps and build
npm install
npm run build

# Compute bucket and deploy
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
BUCKET="futurebox-fe-$ACCOUNT-$REGION"

aws s3 sync dist "s3://$BUCKET" --delete --cache-control max-age=31536000,public
aws s3 cp dist/index.html "s3://$BUCKET/index.html" --cache-control no-cache --metadata-directive REPLACE

echo "Deployed: http://$BUCKET.s3-website-$REGION.amazonaws.com"


# Optional: Invalidate CloudFront to serve the fresh index.html immediately
# Usage:
#   CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABCDEFG ./deployFe.sh
echo "Creating CloudFront invalidation for /* on distribution $CLOUDFRONT_DISTRIBUTION_ID"
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
echo "Invalidation requested. It may take a few minutes to complete."





