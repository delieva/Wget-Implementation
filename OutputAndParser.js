'use strict'

let http = require('http');
let https = require('https');
let url = require('url');
let fs = require('fs');
let EventEmitter = require('events').EventEmitter;
const readline = require('readline');
class OutputFile {
    constructor(){
        console.log("Input srs: ");
        //reading srs;
        this.url = srs;
        console.log("name: ");
        //reading name
        if (name!=0){
            this.name = name;
        }
        else f.findName();
        console.log("path: ");
        //reading path;
        if (path!=0){
            this.path = path;
        }
        else f.findPath();
    }
}

OutputFile.prototype.getUrl = function(){
    return this.url;
};

OutputFile.prototype.findName = function(){
    let str = parser.getPathName();
    let s = str.lastIndexOf("/");
    this.name = str.substr(s, str.length - 1);
    return this.name;
};

OutputFile.prototype.findPath = function () {
  this.path = "/temp/...";
  return this.path;
};

let f = new OutputFile();
let a = f.getUrl();
let parser = new Parse(a);

class Parse{
    constructor(str){
        this.str = str;
    }
}

Parse.prototype.parseUrl = function () {
    let srcUrl = url.parse(this.src);
    srcUrl.protocol = parser.cleanProtocol(srcUrl.protocol);
    return srcUrl;
};

Parse.prototype.cleanProtocol = function(str){
    return str.trim().toLowerCase().replace(/:$/, '');
}

Parse.prototype.parseOptions = function (type, options) {
    if (type === 'download') {
        return options;
    }
    if (type === 'request') {
        if (!options.protocol) {
            options.protocol = 'http';
        }
        options.protocol = parser.cleanProtocol(options.protocol);
        return options;
    }
};

Parse.prototype.getPathName = function (strUrl) {
    return strUrl.pathname;
};
