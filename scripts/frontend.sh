#!/bin/bash
set -euo pipefail

# === Config ===
FRONTEND_IMAGE="hansrajaditya/frontend"
NETWORK_NAME="host"
CONTAINER_NAME="frontend"
HOST_PORT=80
CONTAINER_PORT=80

# === Docker Install ===
echo "Installing Docker if not already installed..."
sudo apt-get update -qq
sudo apt-get install -y -qq docker.io
sudo systemctl enable --now docker

# === Network Setup ===
docker network inspect $NETWORK_NAME >/dev/null 2>&1 || docker network create $NETWORK_NAME

# === Cleanup Existing Container ===
docker rm -f $CONTAINER_NAME >/dev/null 2>&1 || true

# === Pull Image ===
docker pull $FRONTEND_IMAGE

# === Create Docker Network if not exists ===
if ! docker network ls --format '{{.Name}}' | grep -qw "$NETWORK_NAME"; then
  if [ "$NETWORK_NAME" = "host" ]; then
    echo "Using Docker's built-in 'host' network."
  else
    docker network create "$NETWORK_NAME"
  fi
else
  echo "Docker network '$NETWORK_NAME' already exists."
fi

# === Start Frontend ===
docker run -d \
  --name $CONTAINER_NAME \
  --network $NETWORK_NAME \
  -p $HOST_PORT:$CONTAINER_PORT \
  $FRONTEND_IMAGE
