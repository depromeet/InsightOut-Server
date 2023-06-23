#!/bin/bash
echo ------------------------------------
if [ -d /var/www/insightout ]; then
    sudo rm -rf /var/www/insightout
fi
sudo mkdir -vp /var/www/insightout


//ec2-user 권한 부여
sudo chown ec2-user:ec2-user /var/www/
# yarn install -> node_modules는 복사 안함
yarn
# prisma generate
yarn prisma generate
