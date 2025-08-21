#!/bin/bash

# === CONFIG ===
DOCKER_IMAGE="hansrajaditya/frontend"
BACKEND_URL="http://10.0.2.141:5000"  # 🔁 Change this as needed

echo "🚀 Cleaning up old Docker images..."

# Remove all images for frontend
docker images "$DOCKER_IMAGE" --format "{{.ID}}" | xargs -r docker rmi -f

echo "📦 Building new image for $DOCKER_IMAGE with backend URL: $BACKEND_URL"

docker build --no-cache \
  --build-arg VITE_BACKEND_URL="$BACKEND_URL" \
  -t "$DOCKER_IMAGE" /home/aditya/scripts/aws/project/web-diary/client

echo "📤 Pushing image to Docker Hub..."
docker push "$DOCKER_IMAGE"

echo "✅ Done. New image pushed with VITE_BACKEND_URL=$BACKEND_URL"
