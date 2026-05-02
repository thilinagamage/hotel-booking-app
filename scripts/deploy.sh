#!/bin/bash

echo "Deploying Next.js app to AWS..."

git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart nextjs-app

echo "Deployment complete!"
