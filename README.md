# Scrape AVM security notifications
![AVM Bot](avm_bot.png)

[![License](https://img.shields.io/github/license/purejava/scrape-avm-security-notifications.svg)](https://github.com/purejava/scrape-avm-security-notifications/blob/master/LICENSE)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate?hosted_button_id=XVX9ZM7WE4ANL)

This is a bot. It parses a list of AVM security notifications and notices, when new notifications appear on the list.

# Platform
The bot is written in JavaScript that runs on top of Node.js and puppeteer.

# Configuration
Make sure to set headless to **true** in `avm.js` when deploying the bot to a server.
```JavaScript

  initialize: async () => {
    avm.browser = await puppeteer.launch({
      headless: false
    });
```

# Deployment
On an Ubuntu server 18.04 LTS you need to:
## Install required tools
```
apt-get install nodejs npm
cd /usr/local/sbin/scrape-avm-security-notifications
npm install puppeteer
```
## Install required dependencies for Chrome headless to run
The following packages are needed:
```
gconf-service
libasound2
libatk1.0-0
libatk-bridge2.0-0
libc6
libcairo2
libcups2
libdbus-1-3
libexpat1
libfontconfig1
libgcc1
libgconf-2-4
libgdk-pixbuf2.0-0
libglib2.0-0
libgtk-3-0
libnspr4
libpango-1.0-0
libpangocairo-1.0-0
libstdc++6
libx11-6
libx11-xcb1
libxcb1
libxcomposite1
libxcursor1
libxdamage1
libxext6
libxfixes3
libxi6
libxrandr2
libxrender1
libxss1
libxtst6
ca-certificates
fonts-liberation
libappindicator1
libnss3
lsb-release
xdg-utils
wget
```
## Additional configuration for Chrome headless
As Chrome is triggered by a cron job that runs as root, some additional configuration in `avm.js` is required
```JavaScript

  initialize: async () => {
    avm.browser = await puppeteer.launch({
      headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
```

# Donation
If you like this project, you can give me a cup of coffee :)

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate?hosted_button_id=XVX9ZM7WE4ANL)

# Copyright
Copyright (C) 2021-2022 Ralph Plawetzki

The scrape-avm-security-notifications logo is borrowed from [GNOME Builder](https://wiki.gnome.org/Apps/Builder), that is designed by Christian Hergert. The logo is published under the [GNU General Public License (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.html).
