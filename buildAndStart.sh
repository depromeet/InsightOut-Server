#!/bin/bash

pm2 delete all

yarn prisma generate
yarn build

pm2 start "node dist/apps/server/main.js" --name api
