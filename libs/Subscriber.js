"use strict";

var request = require("request");

var Subscriber = function(url,sid,interval,callback) {
    this.callback = callback;
    this.url = url;
    this.sid = sid;
    this.interval = interval;
    this.subscribe();
};

Subscriber.prototype.setSid = function (sid) {
    this.sid = sid;
};

Subscriber.prototype.subscribe = function () {
    var self = this;
    var longPoll = function() {
        request(self.url+"?sid="+self.sid, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                self.callback(body);
            }
        });
    };

    setInterval(longPoll, this.interval);
};

module.exports = Subscriber;