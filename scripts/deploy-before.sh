#!/bin/bash
#echo ------------------------------------
if [ -d /home/ec2-user/InsightOut-Server ]; then
    sudo rm -rf /home/ec2-user/InsightOut-Server
fi
sudo mkdir -vp /home/ec2-user/InsightOut-Server

# cd /var/www/insightout
echo "/home/ec2-user/InsightOut-Server"
cd /home/ec2-user/InsightOut-Server

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


# ec2-user 권한 부여
echo "권한 부여"
sudo chown ec2-user:ec2-user /home/ec2-user/InsightOut-Server
sudo chmod -R 777 /home/ec2-user/InsightOut-Server

# yarn 설치
#echo "yarn 설치"
#npm install -g yarn

# yarn install -> node_modules는 복사 안함
echo "yarn"
yarn

# prisma generate
yarn prisma generate
