'use strict'

let http = require('http');
let https = require('https');
let url = require('url');
let fs = require('fs');
let EventEmitter = require('events').EventEmitter;
const readline = require('readline');

//const rl = readline.createInterface({
  /*  input: process.stdin,
    output: process.stdout
});
rl.question('What do you think of Node.js? ', (answer) => {
    console.log("Thank you for your valuable feedback:" + answer);
    rl.close();
});*/
/*
function download(src, output, options) {
    let downloader = new EventEmitter(),
        srcUrl,
        req;
    srcUrl = url.parse(src);
    srcUrl.protocol = cleanProtocol(srcUrl.protocol);

    req = request({
        protocol: srcUrl.protocol,
        host: srcUrl.hostname,
        port: srcUrl.port,
        path: srcUrl.pathname,
        method: 'GET'
    },
        function(res) {
        let fileSize, writeStream, downloadedSize;
        if (res.statusCode === 200) {
            downloadedSize = 0;
            fileSize = res.headers['content-length'];
            writeStream = fs.createWriteStream(output, {
                flags: 'a',
                encoding: 'binary'
            });

            res.on('error', function(err) {
                writeStream.end();
                downloader.emit('error', err);
            });
            res.on('data', function(chunk) {
                downloadedSize += chunk.length;
                downloader.emit('progress', downloadedSize/fileSize);
                writeStream.write(chunk);
            });
            res.on('end', function() {
                writeStream.end();
            });
            writeStream.on('close', function(){
                downloader.emit('end', output);
            });
        } else {
            downloader.emit('error', 'Server respond ' + res.statusCode);
        }
    });

    req.end();
    req.on('error', function(err) {
        downloader.emit('error', err);
    });

    return downloader;
}
*/
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
/*
function request(options, callback) {
    options = parseOptions('request', options);
    if (options.protocol === 'http') {
        delete options.protocol; // delete self-defined arg
        return http.request(options, callback);
    }
    if (options.protocol === 'https') {
        delete options.protocol; // delete self-defined arg
        return https.request(options, callback);
    }
    throw 'only allow http or https request!';
}
*/
/*function parseOptions(type, options) {
    if (type === 'download') {
        return options;
    }
    if (type === 'request') {
        if (!options.protocol) {
            options.protocol = 'http';
        }
        options.protocol = cleanProtocol(options.protocol);
        return options;
    }
}*/

/*function cleanProtocol(str) {
    return str.trim().toLowerCase().replace(/:$/, '');
}
*/
exports.download = download;
exports.request = request;