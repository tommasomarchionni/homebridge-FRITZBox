'use strict';

var Homebridge, Accessory;
var request = require("request");

module.exports = function(homebridge) {
    Accessory = homebridge.hap.Accessory;
    Homebridge = homebridge;

    homebridge.registerPlatform("homebridge-fritzbox", "FRITZ!Box", FRITZBoxPlatform);
};

//////// PLATFORM /////////

function FRITZBoxPlatform(log, config){
    this.log    = log;
    this.host   = config["host"];
    this.user     = config["user"];
    this.password = config["password"];
}

FRITZBoxPlatform.prototype.accessories = function(callback) {
    var that = this;
    this.log("Platform - Fetching FRITZ!Box Charateristics.");
    this.log("Platform - There was a problem connecting to FRITZ!Box.");
};