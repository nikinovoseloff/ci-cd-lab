#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

NET=ci-cd-lab-test
DB=ci-cd-lab-test-db

docker network inspect "$NET" >/dev/null 2>&1 || docker network create "$NET"
docker rm -f "$DB" >/dev/null 2>&1 || true
docker run -d --name "$DB" --network "$NET" \
  -e POSTGRES_USER=tasks -e POSTGRES_PASSWORD=test -e POSTGRES_DB=tasks_test \
  postgres:16-alpine >/dev/null
trap 'docker rm -f "$DB" >/dev/null 2>&1 || true' EXIT

for _ in $(seq 1 30); do
  docker exec "$DB" pg_isready -U tasks -d tasks_test >/dev/null 2>&1 && break
  sleep 1
done

docker run --rm --network "$NET" \
  -v "$PWD/backend:/app" -v ci-cd-lab-pip:/root/.cache/pip -w /app \
  -e DATABASE_URL=postgresql+psycopg://tasks:test@ci-cd-lab-test-db:5432/tasks_test \
  python:3.12-slim sh -c 'pip install -q -r requirements-dev.txt && pytest -q'

docker run --rm -v "$PWD/frontend:/app" -v ci-cd-lab-npm:/root/.npm -w /app \
  node:20-alpine sh -c 'npm ci && npm run build'
