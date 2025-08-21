#!/bin/bash
set -euo pipefail

# === CONFIG ===
KEY_DIR="../keys"
PRIVATE_KEY_PATH="$KEY_DIR/deployer-key"
PUBLIC_KEY_PATH="$KEY_DIR/deployer-key.pub"

SSH_USER="ubuntu"
SSH_KEY="$PRIVATE_KEY_PATH"

# Docker images
BACKEND_IMAGE="hansrajaditya/backend"
FRONTEND_IMAGE="hansrajaditya/frontend"

# Backend env
BACKEND_SECRET_KEY="your_secret_key_here"
MONGO_USER="developer"
MONGO_PASS="developer"
MONGO_DB="webdiary"
MONGO_URI="mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017/${MONGO_DB}?authSource=admin"

# Colors
GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ${SSH_KEY}"

install_docker_cmd='
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found. Installing..."
  sudo apt-get update
  sudo apt-get install -y docker.io
  sudo systemctl enable --now docker
else
  echo "Docker already installed"
fi
'

# === 1. Terraform Infra Creation ===
terraform -chdir=../infrastructure init
terraform -chdir=../infrastructure fmt
terraform -chdir=../infrastructure validate
terraform -chdir=../infrastructure apply -auto-approve \
  -var="ssh_public_key=$(cat "$PUBLIC_KEY_PATH")"

# Get outputs
FRONTEND_PUBLIC_IP=$(terraform -chdir=../infrastructure output -raw frontend_instance_public_ip)
FRONTEND_PRIVATE_IP=$(terraform -chdir=../infrastructure output -raw frontend_instance_private_ip)
BACKEND_PRIVATE_IP=$(terraform -chdir=../infrastructure output -raw backend_instance_private_ip)
BASTION_PUBLIC_IP=$(terraform -chdir=../infrastructure output -raw bastion_instance_public_ip)

BACKEND_URL="http://${BACKEND_PRIVATE_IP}:5000"
FRONTEND_URL="http://${FRONTEND_PUBLIC_IP}"

echo -e "\n${GREEN}Infrastructure created successfully.${RESET}"
echo "Frontend Public IP: $FRONTEND_PUBLIC_IP"
echo "Backend Private IP: $BACKEND_PRIVATE_IP"
echo "Bastion Public IP: $BASTION_PUBLIC_IP"

# === 2. Push SSH key to all hosts ===
PUB_KEY_CONTENT=$(cat "$PUBLIC_KEY_PATH")

echo "Pushing public key to bastion..."
ssh ${SSH_OPTS} "$SSH_USER@$BASTION_PUBLIC_IP" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PUB_KEY_CONTENT' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

echo "Pushing public key to backend via bastion..."
ssh ${SSH_OPTS} "$SSH_USER@$BASTION_PUBLIC_IP" \
  "ssh -o StrictHostKeyChecking=no $SSH_USER@$BACKEND_PRIVATE_IP \
   'mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo \"$PUB_KEY_CONTENT\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'"

echo "Pushing public key to frontend..."
ssh ${SSH_OPTS} "$SSH_USER@$FRONTEND_PUBLIC_IP" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$PUB_KEY_CONTENT' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# === 3. Connectivity Tests ===
echo -e "\n=== TEST: frontend → backend ==="
ssh ${SSH_OPTS} "$SSH_USER@$FRONTEND_PUBLIC_IP" bash <<EOF
echo "[FRONTEND] Private IP:" \$(hostname -I)
echo "[FRONTEND] Pinging backend ($BACKEND_PRIVATE_IP)..."
if ping -c 3 "$BACKEND_PRIVATE_IP" >/dev/null 2>&1; then
  echo -e "${GREEN}[OK] frontend -> backend: ping succeeded${RESET}"
else
  echo -e "${RED}[ERROR] frontend -> backend: ping failed${RESET}"
fi
EOF

# echo -e "\n=== TEST: backend → frontend (via bastion) ==="
# ssh -J "$SSH_USER@$BASTION_PUBLIC_IP" ${SSH_OPTS} "$SSH_USER@$BACKEND_PRIVATE_IP" bash <<EOF
# echo "[BACKEND] Private IP:" \$(hostname -I)
# echo "[BACKEND] Pinging frontend ($FRONTEND_PRIVATE_IP)..."
# if ping -c 3 "$FRONTEND_PRIVATE_IP" >/dev/null 2>&1; then
#   echo -e "${GREEN}[OK] backend -> frontend: ping succeeded${RESET}"
# else
#   echo -e "${RED}[ERROR] backend -> frontend: ping failed${RESET}"
# fi
# EOF

# === 4. Rebuild Docker Images Locally ===
echo -e "\n${GREEN}Rebuilding Docker images locally...${RESET}"

# Export envs used in Docker build (adjust according to your Dockerfile expectations)
export VITE_BACKEND_URL="$BACKEND_URL"

# Rebuild frontend image
docker build \
  --build-arg VITE_BACKEND_URL=$VITE_BACKEND_URL \
  -t $FRONTEND_IMAGE ../web-diary/client

# Rebuild backend image
docker build \
  --build-arg MONGO_URI=$MONGO_URI \
  --build-arg SECRET_KEY=$BACKEND_SECRET_KEY \
  -t $BACKEND_IMAGE ../web-diary/server

echo -e "\n${GREEN}Pushing images to Docker Hub...${RESET}"
docker push $FRONTEND_IMAGE
docker push $BACKEND_IMAGE

