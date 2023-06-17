#!/bin/bash

pm2 delete all

yarn
yarn prisma generate
yarn build

pm2 start "npx cross-env NODE_ENV=main nest start --entryFile ./apps/server/main --watch --watchAssets" --name api
