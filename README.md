# homebridge-FRITZBox WORK IN PROGRESS
Homebridge plugin for FRITZ!Box

# Installation
Follow the instruction in [homebridge](https://www.npmjs.com/package/homebridge) for the homebridge server installation.
The plugin is published through [NPM](https://www.npmjs.com/package/homebridge-fritzbox) and should be installed "globally" by typing:
```
npm install -g homebridge-fritzbox
```
Update your config.json file. See config.json in this repository for a sample.

# Configuration

Configuration sample:
```
"platforms": [
    {
        "platform": "FRITZ!Box",
        "name": "FRITZ!Box",
        "host": "192.168.0.1",
        "user": "adminuser",
        "password": "password"
    }
]
```

Fields: 
* "platform" - Must be set to FRITZ!Box
* "name" - Name of FRITZ!Box, default FRITZ!Box
* "host" - IP address of the FRITZ!Box
* "user" - Admin user of the FRITZ!Box
* "password" - Password of the FRITZ!Box
