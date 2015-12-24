//Reference https://github.com/kai-c/fritzbox_api_php

"use strict";
var exports = module.exports = {};
var parseString = require('xml2js').parseString;
var request = require("request");
var Utility = require("./Utility.js");
var crypto = require("crypto");
var Iconv  = require('iconv').Iconv;
var querystring = require("querystring");

exports.FritzBoxAPI = function(FRITZBoxPlatform) {
    var self=this;
    this.sid = '0000000000000000';
    this.host   = FRITZBoxPlatform.config["host"];
    this.user     = FRITZBoxPlatform.config["user"];
    this.password = FRITZBoxPlatform.config["password"];
    this.loginType = "LUA";
    this.loginPage = "/login_sid.lua";
    this.log = FRITZBoxPlatform.log;
    this.sid = "0000000000000000";
    ////TODO effettuare il logout alla chiusura
};

exports.FritzBoxAPI.prototype.destroy = function(){
    //console.log("destroy FritzBoxAPI");
    //TODO
};

exports.FritzBoxAPI.prototype.getSid = function (callback){
    var that = this;
    this.doGetRequest({getpage:this.loginPage}, function(data){
        parseString(data,function(err,result){
            if(("SessionInfo" in result) && ("SID" in result.SessionInfo)) {
                if (result.SessionInfo.SID != '0000000000000000') {
                    that.sid = result.SessionInfo.SID[0];
                    callback(result.SessionInfo.SID);
                } else {
                    var challenge = result.SessionInfo.Challenge;
                    var formfields = {getpage: that.loginPage};
                    var iconv = new Iconv('UTF-8', 'UCS-2LE');
                    var response = challenge + '-' + crypto.createHash('md5').update(iconv.convert(challenge + '-' + that.password)).digest("hex");

                    formfields['username'] = that.user;
                    formfields['response'] = response;

                    that.doPostForm(formfields, function (data) {
                        parseString(data, function (err, result) {
                            if (("SessionInfo" in result) && ("SID" in result.SessionInfo)) {
                                if (result.SessionInfo.SID != '0000000000000000') {
                                    that.sid = result.SessionInfo.SID[0];
                                    callback(that.sid);
                                } else {
                                    that.log("Platform - Login to FRITZ!Box failed.");
                                    that.sid = '0000000000000000';
                                    callback(that.sid);
                                }
                            } else {
                                that.log("Platform - Invalid response during login.");
                                that.sid = '0000000000000000';
                                callback(that.sid);
                            }
                        });
                    });
                }
            } else {
                that.log("Platform - Invalid response during login.");
                that.sid = '0000000000000000';
                callback(that.sid);
            }
        });
    });
};

exports.FritzBoxAPI.prototype.doPostForm = function(formfields,callback)
{
    var that = this;
    var url="";

    if(("getpage" in formfields) && (formfields['getpage'].indexOf('.lua') > 0)){
        url = this.host +  formfields['getpage'] + "?sid=" + this.sid;
        delete(formfields['getpage']);
    } else {
        // add the sid, if it is already set
        if (this.sid !== '0000000000000000'){
            formfields['sid'] = this.sid;
        }
        url = this.host + "/cgi-bin/webcm";
    }

    request.post({
        url:'http://'+url,
        form: formfields
    }, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            callback(body);
        } else {
            that.log("Platform - There was a problem connecting to FRITZ!Box: "+err+" status code: "+response.statusCode);
        }
    });
};

exports.FritzBoxAPI.prototype.doGetRequest = function(params,callback){
    var that = this;
    var getpage = "";

    if (this.sid != '0000000000000000')
    {
        params['sid'] = this.sid;
    }

    if(("getpage" in params) && (params['getpage'].indexOf('.lua') > 0)){
        getpage = params['getpage']+'?';
        delete(params['getpage']);
    } else {
        getpage = '/cgi-bin/webcm?';
    }

    request.get({
        url: "http://"+this.host + getpage + querystring.stringify(params)
    }, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            callback(body);
        } else {
            that.log("Platform - There was a problem connecting to FRITZ!Box.");
        }
    });
};