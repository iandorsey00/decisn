#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-}"
REMOTE_USER="${REMOTE_USER:-}"
REMOTE_TARGET_DIR="${REMOTE_TARGET_DIR:-}"
REMOTE_TMP_DIR="${REMOTE_TMP_DIR:-/tmp/decisn-static}"
CADDY_CONFIG="${CADDY_CONFIG:-/etc/caddy/Caddyfile}"

if [[ -z "${REMOTE_HOST}" || -z "${REMOTE_USER}" || -z "${REMOTE_TARGET_DIR}" ]]; then
  echo "Set REMOTE_HOST, REMOTE_USER, and REMOTE_TARGET_DIR before running deploy-static.sh." >&2
  exit 1
fi

SSH_TARGET="${REMOTE_USER}@${REMOTE_HOST}"

node --check app.js

ssh "${SSH_TARGET}" "mkdir -p '${REMOTE_TMP_DIR}'"

rsync -av --delete \
  index.html \
  app.js \
  styles.css \
  manifest.webmanifest \
  LICENSE \
  assets/ \
  "${SSH_TARGET}:${REMOTE_TMP_DIR}/"

ssh -t "${SSH_TARGET}" \
  "sudo mkdir -p '${REMOTE_TARGET_DIR}' && \
   sudo rsync -av --delete '${REMOTE_TMP_DIR}/' '${REMOTE_TARGET_DIR}/' && \
   sudo caddy validate --config '${CADDY_CONFIG}' && \
   sudo systemctl reload caddy"

echo "Deployed Decisn to ${SSH_TARGET}:${REMOTE_TARGET_DIR}"
