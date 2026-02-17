#!/bin/bash
cd /home/ec2-user/auth-backend

npm install
npm run build

pm2 restart auth-backend || pm2 start dist/server.js --name auth-backend
