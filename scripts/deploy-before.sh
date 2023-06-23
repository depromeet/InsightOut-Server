#!/bin/bash
#echo ------------------------------------
#if [ -d /var/www/insightout ]; then
#    sudo rm -rf /var/www/insightout
#fi
#sudo mkdir -vp /var/www/insightout

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


# ec2-user 권한 부여
#echo "권한 부여"
#sudo chown ec2-user:ec2-user /var/www/insightout
#sudo chmod -R 777 /var/www/insightout

# cd /var/www/insightout
#echo "/var/www/insightout"
#cd /var/www/insightout

# yarn 설치
#echo "yarn 설치"
#npm install -g yarn

# yarn install -> node_modules는 복사 안함
echo "yarn"
yarn

# prisma generate
yarn prisma generate
