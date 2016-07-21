"use strict";

var request = require("request");
var Subscriber = require('../libs/Subscriber.js');

var WifiGuestItem = function(platform,homebridge,fritzBoxApi) {
    var self=this;
    this.name ="WiFi Guest";
    this.manufacturer = "AVM Computersysteme Vertriebs GmbH";
    this.model="WiFi Guest";
    this.serialNumber ="123456789";
    this.fritzBoxApi = fritzBoxApi;
    this.endpoint = "/wlan/guest_access.lua";
    this.fritzBoxApi.getSid(function(sid){
        self.subscriber = new Subscriber(
            "http://"+platform.config["host"] + self.endpoint,
            sid,
            5000,
            self.updateCharacteristics.bind(self)
        );
        self.sid = sid;
    });

    WifiGuestItem.super_.call(this,platform,homebridge);
};

WifiGuestItem.prototype.getOtherServices = function() {
    var otherService = new this.homebridge.hap.Service.Switch();
    this.setInitialState = true;

    otherService.getCharacteristic(this.homebridge.hap.Characteristic.On)
        .on('set', this.setItemState.bind(this))
        .on('get', this.getItemState.bind(this))
        .setValue(this.state === 'ON');

    return otherService;
};

WifiGuestItem.prototype.updateCharacteristics = function(message) {

    this.setFromFritzBox = true;

    this.otherService
        .getCharacteristic(this.homebridge.hap.Characteristic.On)
        .setValue(this.checkItemState(message));
};

WifiGuestItem.prototype.checkItemState = function(response) {
    var re = /\["wlan:settings\/guest_ap_enabled"\] = "([0-1])+",/;
    var matches = response.match(re);
    if (null !== matches){
        return (1 == parseInt(matches[1]));
    } else {
        this.log('WifiGuestItem - Invalid response.');
        return false;
    }
};

WifiGuestItem.prototype.getItemState = function(callback) {
    var self=this;
    var formfields = {getpage: this.endpoint};

    this.fritzBoxApi.getSid(function(sid){
        if ('0000000000000000' !== sid){
            self.subscriber.setSid(sid);
            self.fritzBoxApi.doGetRequest(formfields,function(response){
                callback(undefined,self.checkItemState(response));
            });
        } else {
            self.log('WifiGuestItem - There was a problem connecting to FRITZ!Box.');
        }
    });
};

WifiGuestItem.prototype.setItemState = function(value, callback) {

    var self = this;

    if (this.setInitialState) {
        this.setInitialState = false;
        callback();
        return;
    }

    if (this.setFromFritzBox) {
        this.setFromFritzBox = false;
        callback();
        return;
    }

    this.log("iOS - send message to " + this.name + ": " + value);

    this.fritzBoxApi.getSid(function(sid){
        if ('0000000000000000' !== sid){
            self.subscriber.setSid(sid);

            var formfields = {getpage: self.endpoint};
            self.fritzBoxApi.doGetRequest(formfields,function(response){

                formfields["getpage"] = self.endpoint;

                //fetch guest_ssid
                var re = /\["wlan:settings\/guest_ssid"\] = "(.+)",/;
                var matches = response.match(re);
                if (null !== matches){
                    formfields["guest_ssid"] = matches[1];
                } else {
                    self.log('WifiGuestItem - Invalid response during fetch of guest_ssid.');
                    return;
                }

                //fetch wpa_key
                re = /\["wlan:settings\/guest_pskvalue"\] = "(.+)",/;
                matches = response.match(re);
                if (null !== matches){
                    formfields["wpa_key"] = matches[1];
                } else {
                    self.log('WifiGuestItem - Invalid response during fetch of wpa_key.');
                    return;
                }

                //fetch sec_mode
                re = /\["wlan:settings\/guest_encryption"\] = "([0-9])+",/;
                matches = response.match(re);
                if (null !== matches){
                    formfields["sec_mode"] = matches[1];
                } else {
                    self.log('WifiGuestItem - Invalid response during fetch of sec_mode.');
                    return;
                }

                if (value == true ) formfields['activate_guest_access'] = 'on';

                formfields["btnSave"] = "";

                self.fritzBoxApi.doPostForm(formfields,function(response){
                    callback();
                });

            });
        } else {
            self.log('WifiGuestItem - There was a problem connecting to FRITZ!Box.');
        }
    });
};

module.exports = WifiGuestItem;
