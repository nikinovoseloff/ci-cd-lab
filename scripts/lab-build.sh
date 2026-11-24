#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

docker build -t ci-cd-lab-api:dev backend
docker build -t ci-cd-lab-web:dev frontend
