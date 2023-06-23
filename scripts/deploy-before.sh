#!/bin/bash
echo ------------------------------------
if [ -d /var/www/insightout ]; then
    sudo rm -rf /var/www/insightout
fi
sudo mkdir -vp /var/www/insightout