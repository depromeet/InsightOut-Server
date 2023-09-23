#!/bin/bash

# cd /var/www/insightout
echo "🙏 /home/ec2-user/InsightOut-Server"
cd /home/ec2-user/InsightOut-Server


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

node node_modules/prisma/build/index.js generate
node node_modules/prisma/build/index.js db push