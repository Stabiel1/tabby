#!/usr/bin/env bash
set -euo pipefail

DOCKER_PREFIX=""
if docker info >/dev/null 2>&1; then
  DOCKER_PREFIX=""
elif sudo docker info >/dev/null 2>&1; then
  DOCKER_PREFIX="sudo"
else
  echo "Docker daemon is not reachable. Start Docker first, then rerun npm run swarm:dev."
  exit 1
fi

if ${DOCKER_PREFIX:+$DOCKER_PREFIX }docker compose version >/dev/null 2>&1; then
  COMPOSE_BIN="${DOCKER_PREFIX:+$DOCKER_PREFIX }docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_BIN="${DOCKER_PREFIX:+$DOCKER_PREFIX }docker-compose"
else
  echo "docker-compose or docker compose is required."
  exit 1
fi

echo "Starting swarm stack with: $COMPOSE_BIN up -d"
$COMPOSE_BIN up -d

echo "Swarm container status:"
$COMPOSE_BIN ps

echo "Following swarm logs (Ctrl+C to stop log view, container keeps running)..."
$COMPOSE_BIN logs -f swarm-core
