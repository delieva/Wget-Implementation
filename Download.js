'use strict'

const Reqst = require('./Request');

const fs = require('fs');
const EventEmitter = require('events').EventEmitter;



class Download extends Reqst.Request{
	constructor(Url, outName, parsed, heap, outJson){
		super();
		this.Url = Url;
		this.heap = heap;
		if(outName === ""){
			this.outName = parsed.setName(this.Url);
		}
		else{this.outName = outName;}
		let n = this.outName;
		this.outName = outJson.check(n, this.heap);
		
	}
	wget(callback) {
		//downloading function using request from Request class
		let downld;
		let req;
		let res;
		let tmp = this.Url.protocol;
		let otnm = this.outName;
		let size;
		downld = new EventEmitter();
		req = this.request({
			protocol: tmp.trim().toLowerCase().replace(/:$/, ''),
			host: this.Url.hostname,
			port: this.Url.port,
			path: this.Url.pathname,
			method: 'GET'
		}, (res) => {
			let fileSize, writeStream, downloadedSize;
			if (res.statusCode === 200) {
				downloadedSize = 0;
				fileSize = res.headers['content-length'];
				//outJson.appendData({[flName] : 1});
				size = Math.ceil((fileSize / 1024)*100)/100;
				writeStream = fs.createWriteStream(otnm);
				res.on('data', (chunk) => {
					downloadedSize += chunk.length;
					downld.emit('progress', downloadedSize / fileSize);
					console.log(parseInt((downloadedSize / fileSize)*100));
					writeStream.write(chunk);
				});
				res.on('end', function () {
					writeStream.end();
				});
				writeStream.on('close', function () {
					downld.emit('end', otnm);
				});
			} else {
				downld.emit('error', 'Server respond ' + res.statusCode);
			}
			callback(this.outName, size);
		});
		
		req.end();
		req.on('error', function (err) {
			downld.emit('error', err);
		});
		
		return downld;
	}
}
exports.Download = Download;
