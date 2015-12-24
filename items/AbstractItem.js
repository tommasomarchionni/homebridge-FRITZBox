"use strict";

var AbstractItem = function(platform,homebridge) {
    this.setFromFritzBox = false;
    this.setInitialState = false;
    this.platform = platform;
    this.homebridge = homebridge;
    this.informationService = undefined;
    this.otherService = undefined;
    this.platform.log("Platform - Accessory Found: " + this.name);
    this.log = this.platform.log;
    AbstractItem.super_.call(this, this.name, homebridge.hap.uuid.generate(String(this.name)));
};

AbstractItem.prototype.getServices = function() {
    this.informationService = this.getInformationServices();
    this.otherService = this.getOtherServices();
    return [this.informationService, this.otherService];
};

AbstractItem.prototype.getOtherServices = function() {
    return null;
};

AbstractItem.prototype.getInformationServices = function() {
    var informationService = new this.homebridge.hap.Service.AccessoryInformation();

    informationService
        .setCharacteristic(this.homebridge.hap.Characteristic.Manufacturer, this.manufacturer)
        .setCharacteristic(this.homebridge.hap.Characteristic.Model, this.model)
        .setCharacteristic(this.homebridge.hap.Characteristic.SerialNumber, this.serialNumber)
        .setCharacteristic(this.homebridge.hap.Characteristic.Name, this.name);
    return informationService;
};

module.exports = AbstractItem;