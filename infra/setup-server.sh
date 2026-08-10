#!/usr/bin/env bash
# One-time bootstrap for a fresh Ubuntu/Debian server: installs Docker + the
# compose plugin, git, and clones this repo. Run once via SSH as root:
#
#   curl -fsSL https://raw.githubusercontent.com/<you>/artus/main/infra/setup-server.sh | bash -s -- <git-repo-url> [deploy-path]
#
# or after cloning manually: bash infra/setup-server.sh <git-repo-url> [deploy-path]
set -euo pipefail

REPO_URL="${1:?usage: setup-server.sh <git-repo-url> [deploy-path]}"
DEPLOY_PATH="${2:-/opt/artus}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root (or with sudo)." >&2
  exit 1
fi

echo "==> Installing prerequisites"
apt-get update -y
apt-get install -y ca-certificates curl git ufw

echo "==> Installing Docker Engine + compose plugin"
if ! command -v docker >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/${ID} ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
systemctl enable --now docker

echo "==> Opening firewall for SSH/HTTP/HTTPS"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> Cloning repo to ${DEPLOY_PATH}"
if [ ! -d "${DEPLOY_PATH}/.git" ]; then
  git clone "${REPO_URL}" "${DEPLOY_PATH}"
else
  echo "    ${DEPLOY_PATH} already a git checkout, skipping clone"
fi

if [ ! -f "${DEPLOY_PATH}/infra/.env" ]; then
  cp "${DEPLOY_PATH}/infra/.env.example" "${DEPLOY_PATH}/infra/.env"
  echo "==> Created ${DEPLOY_PATH}/infra/.env from the example — edit it now with real secrets and your domain:"
  echo "    \$EDITOR ${DEPLOY_PATH}/infra/.env"
fi

cat <<EOF

==> Done. Next steps:
1. Edit ${DEPLOY_PATH}/infra/.env — set real POSTGRES/MINIO/JWT/MOYSKLAD secrets,
   DOMAIN=your-domain.tld, CORS_ALLOWED_ORIGINS=https://your-domain.tld and
   VITE_API_BASE_URL=https://your-domain.tld/api/v1
2. Point the domain's DNS A record at this server's IP.
3. First deploy manually to verify it works:
     cd ${DEPLOY_PATH}/infra && docker compose -f docker-compose.prod.yml up -d --build
4. Add these GitHub Actions secrets in the repo (Settings -> Secrets and variables -> Actions):
     DEPLOY_HOST = this server's IP or hostname
     DEPLOY_USER = the SSH user used to connect (e.g. root)
     DEPLOY_SSH_KEY = private key whose matching public key is in
                      /root/.ssh/authorized_keys (or that user's) on this server
     DEPLOY_PORT  = SSH port (optional, defaults to 22)
     DEPLOY_PATH  = ${DEPLOY_PATH}
   After that, every push to main will SSH in, git pull, and redeploy automatically.
EOF
