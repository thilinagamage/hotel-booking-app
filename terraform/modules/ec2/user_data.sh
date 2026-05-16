#!/bin/bash
set -ex

# === Tags from EC2 metadata ===
ENVIRONMENT="${environment}"
SSM_PATH="${ssm_path}"
APP_PORT="${app_port}"
GITHUB_REPO="${github_repo}"
LOG_GROUP="${log_group}"

# === Install system deps ===
dnf update -y
dnf install -y git nodejs20 npm awscli amazon-cloudwatch-agent

# === Create app user ===
useradd -m -s /bin/bash app || true

# === Clone / pull app ===
if [ -d /home/app/hotel-booking-app ]; then
  cd /home/app/hotel-booking-app && git pull
else
  git clone https://github.com/${GITHUB_REPO} /home/app/hotel-booking-app
fi
chown -R app:app /home/app/hotel-booking-app

# === Load secrets from SSM ===
cd /home/app/hotel-booking-app
aws ssm get-parameters-by-path \
  --path "${SSM_PATH}" \
  --with-decryption \
  --query "Parameters[*].{Name:Name,Value:Value}" \
  --output text | while IFS=$'\t' read -r name value; do
    key=$(echo "$name" | awk -F/ '{print $NF}')
    echo "$key=$value" >> .env
done
echo "NODE_ENV=production" >> .env

# === Install & build ===
sudo -u app npm ci --omit=dev
sudo -u app npx prisma generate
sudo -u app npx prisma migrate deploy
sudo -u app npm run build

# === Install PM2 globally ===
npm install -g pm2

# === Start app ===
sudo -u app pm2 start ecosystem.config.js || sudo -u app pm2 reload ecosystem.config.js
sudo -u app pm2 save
env PATH=\$PATH:/usr/bin pm2 startup systemd -u app --hp /home/app

# === Configure CloudWatch agent ===
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json <<'CWAGENT'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/app/hotel-booking-app/logs/pm2-out.log",
            "log_group_name": "${LOG_GROUP}",
            "log_stream_name": "{instance_id}-app",
            "timezone": "UTC"
          },
          {
            "file_path": "/home/app/hotel-booking-app/logs/pm2-error.log",
            "log_group_name": "${LOG_GROUP}",
            "log_stream_name": "{instance_id}-error",
            "timezone": "UTC"
          }
        ]
      }
    }
  }
}
CWAGENT

systemctl enable amazon-cloudwatch-agent
systemctl restart amazon-cloudwatch-agent

echo "User data script complete."
