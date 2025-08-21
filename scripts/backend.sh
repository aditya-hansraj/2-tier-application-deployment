#!/bin/bash
set -euo pipefail

# === Config ===
BACKEND_IMAGE="hansrajaditya/backend"
MONGO_USER="developer"
MONGO_PASS="developer"
MONGO_DB="webdiary"
SECRET_KEY="your_secret_key_here"
FRONTEND_URL="http://frontend:5173"
NETWORK_NAME="host"

# === Docker Install ===
echo "Installing Docker if not already installed..."
sudo apt-get update -qq
sudo apt-get install -y -qq docker.io
sudo systemctl enable --now docker

# === Network Setup ===
docker network inspect $NETWORK_NAME >/dev/null 2>&1 || docker network create $NETWORK_NAME

# === Cleanup Existing Containers ===
docker rm -f backend mongodb >/dev/null 2>&1 || true

# === Pull Image ===
docker pull $BACKEND_IMAGE

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

# === Start MongoDB ===
docker run -d \
  --name mongodb \
  --network $NETWORK_NAME \
  -e MONGO_INITDB_ROOT_USERNAME=$MONGO_USER \
  -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASS \
  -p 27017:27017 \
  mongo

# === Start Backend ===
docker run -d \
  --name backend \
  --network $NETWORK_NAME \
  -e MONGO_URI="mongodb://$MONGO_USER:$MONGO_PASS@mongodb:27017/$MONGO_DB?authSource=admin" \
  -e SECRET_KEY="$SECRET_KEY" \
  -e FRONTEND_URL="$FRONTEND_URL" \
  -p 5000:5000 \
  $BACKEND_IMAGE
