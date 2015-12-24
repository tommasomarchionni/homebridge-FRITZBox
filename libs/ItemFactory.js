"use strict";
var exports = module.exports = {};
exports.AbstractItem = require('../items/AbstractItem.js');
exports.WifiGuestItem = require('../items/WifiGuestItem.js');
var FritzBoxAPI = require('./FritzBoxApi.js').FritzBoxAPI;

exports.Factory = function(FRITZBoxPlatform,homebridge) {
    this.platform = FRITZBoxPlatform;
    this.log = this.platform.log;
    this.homebridge = homebridge;
    this.fritzBoxApi = new FritzBoxAPI(FRITZBoxPlatform);
};

exports.Factory.prototype.CreateAccessories = function () {
    var accessoryList = [];
    accessoryList.push(new exports.WifiGuestItem(this.platform,this.homebridge,this.fritzBoxApi));
    return accessoryList;
};