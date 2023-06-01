#!/bin/bash
echo ------------------------------------
source /home/ubuntu/.bash_profile
pm2 stop all
pm2 start all