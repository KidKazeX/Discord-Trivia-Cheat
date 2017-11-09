"use strict";

var Discord = require("discord.js");
var fs      = require("fs");

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

var noop = () => {};

require.extensions['.json'] = function (module, filename) { module.exports = fs.readFileSync(filename, "utf8"); };
var jsondata = require('./config.json');
var raw      = JSON.parse(jsondata);

var token = raw.bot.token;

function messageHandle(msg){
    if ((msg.author.username).toLowerCase() == "impulse"){
        var q = (msg.content).toLowerCase();
        var a = raw.answers;

        for (var key in a){
            var exp = new RegExp(escapeRegEx(key), "gi");
            if (a.hasOwnProperty(key)) if (q.match(exp)) msg.reply(a[key]);
        }
    }
    else return;
}

function escapeRegEx(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }

var client = new class Client extends Discord.Client {
    constructor() {
        super({ fetchAllMembers: true });

        this.on("ready", () => { console.log(`Logged in as ${client.user.tag}!`) });
        this.on("message", message => { messageHandle(message); });

        this.login(token);
    }
}

process.on('unhandledRejection', err => console.error(`Uncaught Promise Rejection\n${err}`))