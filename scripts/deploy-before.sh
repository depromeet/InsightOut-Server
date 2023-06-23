#!/bin/bash
echo ------------------------------------
if [ -d /var/www/insightout ]; then
    sudo rm -rf /var/www/insightout
fi
sudo mkdir -vp /var/www/insightout

# yarn install -> node_modules는 복사 안함
yarn
# prisma generate
yarn prisma generate
