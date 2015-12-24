'use strict';

var Homebridge, Accessory;
var ItemFactory = require('./libs/ItemFactory.js');
var Utility = require('./libs/Utility.js');

module.exports = function(homebridge) {
    Accessory = homebridge.hap.Accessory;
    Homebridge = homebridge;

    Utility.addSupportTo(ItemFactory.AbstractItem, Accessory);
    Utility.addSupportTo(ItemFactory.WifiGuestItem, ItemFactory.AbstractItem);
    homebridge.registerPlatform("homebridge-fritzbox", "FRITZ!Box", FRITZBoxPlatform);
};

//////// PLATFORM /////////

function FRITZBoxPlatform(log, config){
    this.log    = log;
    this.config = config;
}

FRITZBoxPlatform.prototype.accessories = function(callback) {
    this.log("Platform - Fetching FRITZ!Box items..");
    var itemFactory = new ItemFactory.Factory(this,Homebridge);
    callback(itemFactory.CreateAccessories());
};