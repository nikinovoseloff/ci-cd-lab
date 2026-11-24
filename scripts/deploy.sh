#!/usr/bin/env bash
set -euo pipefail

SHA=${1:?usage: deploy.sh <sha>}
TAG="sha-${SHA:0:7}"
cd /opt/ci-cd-lab

SMOKE_URL=${SMOKE_URL:-http://127.0.0.1:8080/api/health}
SMOKE_RETRIES=${SMOKE_RETRIES:-30}
PREVIOUS=$(sed -n 's/^IMAGE_TAG=//p' .env)
PREVIOUS=${PREVIOUS:-l2}

rollback() {
  trap - ERR
  echo "deploy failed, rollback to $PREVIOUS" >&2
  sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$PREVIOUS/" .env
  docker compose up -d --remove-orphans || true
}

trap rollback ERR

echo "deploy $TAG (previous $PREVIOUS)"
sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$TAG/" .env
docker compose pull
docker compose up -d --remove-orphans

for _ in $(seq 1 "$SMOKE_RETRIES"); do
  if curl -fsS "$SMOKE_URL" >/dev/null 2>&1; then
    echo "healthy: $TAG"
    docker image prune -f >/dev/null || true
    trap - ERR
    exit 0
  fi
  sleep 2
done

echo "smoke check failed" >&2
false
