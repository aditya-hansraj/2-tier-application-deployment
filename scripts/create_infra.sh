#!/bin/bash

set -euo pipefail

KEY_DIR="../keys"
PRIVATE_KEY_PATH="$KEY_DIR/deployer-key"
PUBLIC_KEY_PATH="$KEY_DIR/deployer-key.pub"

# mkdir -p "$KEY_DIR"
# chmod 700 "$KEY_DIR"

# ssh-keygen -t rsa -b 4096 -f "$PRIVATE_KEY_PATH" -N "" -q

# # Secure permissions
# chmod 400 "$PRIVATE_KEY_PATH"
# chmod 644 "$PUBLIC_KEY_PATH"

# MY_IP=$(curl -sf https://checkip.amazonaws.com | tr -d '[:space:]')
# if [[ -z "$MY_IP" ]]; then
#   echo "Failed to detect public IP. Exiting."
#   exit 1
# fi
# SSH_CIDR="${MY_IP}/32"
# echo "Detected public IP for SSH whitelist: $SSH_CIDR"

terraform -chdir=../infrastructure  init
terraform -chdir=../infrastructure  fmt
terraform -chdir=../infrastructure  validate
terraform -chdir=../infrastructure  plan \
                                        -var="ssh_public_key=$(cat "$PUBLIC_KEY_PATH")" \
                                        # -var="ssh_allowed_cidr=${SSH_CIDR}"
terraform -chdir=../infrastructure  apply -auto-approve \
                                        -var="ssh_public_key=$(cat "$PUBLIC_KEY_PATH")" \
                                        # -var="ssh_allowed_cidr=${SSH_CIDR}"

echo "Infrastructure created successfully."

FRONTEND_INSTANCE_ID=$(terraform -chdir=../infrastructure output -raw frontend_instance_id)
BACKEND_INSTANCE_ID=$(terraform -chdir=../infrastructure  output -raw backend_instance_id)
BASTION_INSTANCE_ID=$(terraform -chdir=../infrastructure  output -raw bastion_instance_id)

FRONTEND_PUBLIC_IP=$(terraform -chdir=../infrastructure output -raw frontend_instance_public_ip)
FRONTEND_PRIVATE_IP=$(terraform -chdir=../infrastructure output -raw frontend_instance_private_ip)
BACKEND_PRIVATE_IP=$(terraform -chdir=../infrastructure output -raw backend_instance_private_ip)
BASTION_PUBLIC_IP=$(terraform -chdir=../infrastructure output -raw bastion_instance_public_ip)

SSH_USER="ubuntu" 
SSH_KEY="$PRIVATE_KEY_PATH"

# color codes
GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"


echo "=== TEST: frontend → backend ==="
ssh -A -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$SSH_USER@$FRONTEND_PUBLIC_IP" bash <<EOF
echo "[FRONTEND] Private IP:" \$(hostname -I)
echo "[FRONTEND] Pinging backend ($BACKEND_PRIVATE_IP)..."
if ping -c 3 "$BACKEND_PRIVATE_IP" >/dev/null 2>&1; then
  echo -e "${GREEN}[OK] frontend -> backend: ping succeeded (0% packet loss)${RESET}"
else
  echo -e "${RED}[ERROR] frontend -> backend: ping failed (check security groups / routing)${RESET}"
fi
EOF



echo -e "\n=== TEST: backend → frontend (via bastion) ==="

# Ensure SSH agent forwarding
eval "$(ssh-agent -s)" >/dev/null
ssh-add "$SSH_KEY"

# 1️⃣ Push public key to backend via bastion
PUB_KEY_CONTENT=$(cat "$SSH_KEY.pub")

ssh -A -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$BASTION_PUBLIC_IP" \
  "ssh -o StrictHostKeyChecking=no $SSH_USER@$BACKEND_PRIVATE_IP \
  'mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo \"$PUB_KEY_CONTENT\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'"

# 2️⃣ Now run the backend → frontend connectivity test
ssh -A -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ProxyJump="$SSH_USER@$BASTION_PUBLIC_IP" "$SSH_USER@$BACKEND_PRIVATE_IP" bash <<EOF
echo "[BACKEND] Private IP:" \$(hostname -I)
echo "[BACKEND] Pinging frontend ($FRONTEND_PRIVATE_IP)..."
if ping -c 3 "$FRONTEND_PRIVATE_IP" >/dev/null 2>&1; then
  echo -e "${GREEN}[OK] backend -> frontend: ping succeeded (0% packet loss)${RESET}"
else
  echo -e "${RED}[ERROR] backend -> frontend: ping failed (check security groups / routing)${RESET}"
fi
EOF


