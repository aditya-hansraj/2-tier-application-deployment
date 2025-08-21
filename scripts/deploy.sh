#!/bin/bash
set -euo pipefail

KEY_DIR="../keys"
PRIVATE_KEY_PATH="$KEY_DIR/deployer-key"
PUBLIC_KEY_PATH="$KEY_DIR/deployer-key.pub"

# === Inputs from your environment / terraform outputs ===
FRONTEND_INSTANCE_ID=$(terraform -chdir=../infrastructure output -raw frontend_instance_id)
BACKEND_INSTANCE_ID=$(terraform -chdir=../infrastructure  output -raw backend_instance_id)
BASTION_INSTANCE_ID=$(terraform -chdir=../infrastructure  output -raw bastion_instance_id)

FRONTEND_PUBLIC_IP=$(terraform -chdir=../infrastructure output -raw frontend_instance_public_ip)
FRONTEND_PRIVATE_IP=$(terraform -chdir=../infrastructure output -raw frontend_instance_private_ip)
BACKEND_PRIVATE_IP=$(terraform -chdir=../infrastructure output -raw backend_instance_private_ip)
BASTION_PUBLIC_IP=$(terraform -chdir=../infrastructure output -raw bastion_instance_public_ip)

SSH_USER="ubuntu"
SSH_KEY="${PRIVATE_KEY_PATH:-~/.ssh/id_rsa}"  # fallback if not set

# Docker Hub images
BACKEND_IMAGE="hansrajaditya/web-diary-server:latest"
FRONTEND_IMAGE="hansrajaditya/web-diary-client:latest"

# Environment values (customize secrets here or pull from secret manager)
BACKEND_SECRET_KEY="your_secret_key_here"
# Example Mongo credentials; adjust if you use different auth
MONGO_USER="developer"
MONGO_PASS="developer"
MONGO_DB="webdiary"
MONGO_URI="mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:27017/${MONGO_DB}?authSource=admin"

# Derived URLs
BACKEND_URL="http://${BACKEND_PRIVATE_IP}:5000"
FRONTEND_URL="http://${FRONTEND_PUBLIC_IP}"  # assuming frontend serves on port 80

# SSH options
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ${SSH_KEY}"

# Helper: install Docker if missing
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

# --- Deploy backend ---
echo "Deploying backend on ${BACKEND_PRIVATE_IP}..."
ssh ${SSH_OPTS} -J ${SSH_USER}@${BASTION_PUBLIC_IP} ${SSH_USER}@${BACKEND_PRIVATE_IP} bash -s <<EOF

set -e
${install_docker_cmd}

# Pull backend image
docker pull ${BACKEND_IMAGE}

# Create .env file
cat > webdiary_backend.env <<EOL
SECRET_KEY=${BACKEND_SECRET_KEY}
MONGO_URI=${MONGO_URI}
FRONTEND_URL=${FRONTEND_URL}
PORT=5000
EOL

# Stop existing container if any
docker rm -f webdiary_backend 2>/dev/null || true

# Run backend (adjust restart policy as you like)
docker run -d \
  --name webdiary_backend \
  --env-file webdiary_backend.env \
  -p 5000:5000 \
  ${BACKEND_IMAGE}
EOF

# --- Deploy frontend ---
echo "Deploying frontend on ${FRONTEND_PUBLIC_IP}..."
ssh ${SSH_OPTS} ${SSH_USER}@${FRONTEND_PUBLIC_IP} bash -s <<EOF
set -e
${install_docker_cmd}

# Pull frontend image
docker pull ${FRONTEND_IMAGE}

# Create .env (frontend expects BACKEND_URL)
cat > webdiary_frontend.env <<EOL
BACKEND_URL=${BACKEND_URL}
EOL

# Stop existing container if any
docker rm -f webdiary_frontend 2>/dev/null || true

# Run frontend container (assuming it reads BACKEND_URL from env)
docker run -d \
  --name webdiary_frontend \
  --env-file webdiary_frontend.env \
  -p 80:80 \
  ${FRONTEND_IMAGE}
EOF

echo "Deployment complete."
echo "Frontend should be reachable at: ${FRONTEND_URL}"
echo "Backend internal address for frontend is set to: ${BACKEND_URL}"
