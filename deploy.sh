#!/bin/bash
cd /home/ec2-user/app
npm install
pm2 restart backend || pm2 start dist/server.js --name backend
