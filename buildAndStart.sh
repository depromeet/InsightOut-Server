#!/bin/bash

pm2 delete all

yarn
yarn prisma generate
yarn build

pm2 start "yarn prod" --name api
