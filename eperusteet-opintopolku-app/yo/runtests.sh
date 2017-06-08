#!/bin/sh
clear
./node_modules/webdriver-manager/bin/webdriver-manager shutdown
./node_modules/webdriver-manager/bin/webdriver-manager clean
./node_modules/webdriver-manager/bin/webdriver-manager update --standalone --chrome
(xvfb-run --server-args="-screen 0, 1920x1080x24" ./node_modules/webdriver-manager/bin/webdriver-manager start --detach > /dev/null)&
# (./node_modules/webdriver-manager/bin/webdriver-manager start --detach > /dev/null)&
webdps=$!

echo "Waiting for webdriver"
sleep 5
clear
node ./node_modules/nightwatch/bin/runner.js --env chrome
./node_modules/webdriver-manager/bin/webdriver-manager shutdown
./node_modules/webdriver-manager/bin/webdriver-manager clean

# TODO: Better cleanup
sleep 2
pkill Xvfb
ps aux|grep webdriver-manager|awk '{print $2}'|xargs kill -9
sleep 1
