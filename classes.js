'use strict'

let http = require('http');
let https = require('https');
let url = require('url');
let fs = require('fs');
let EventEmitter = require('events').EventEmitter;

class Request{
	constructor(){};
	setProtocol(obj){
		//method for setting protocol if it dosn't matched
		if (!obj.protocol) {
			obj.protocol = 'http';
		}
		let tmp = obj.protocol;
		obj.protocol = tmp.trim().toLowerCase().replace(/:$/, '');
		return obj;
	}
	request(obj, callback){
		//method for making a request
		obj = this.setProtocol(obj);
		if (obj.protocol === 'http') {
			delete obj.protocol;
			return http.request(obj, callback);
		}
		if (obj.protocol === 'https') {
			delete obj.protocol;
			return https.request(obj, callback);
		}
		throw 'Unknown protocol! Please choose http or https.';
	}
}

 
class Download extends Request{
	constructor(Url, outName, parsed){
		super();
		this.Url = Url;
		if(outName === ""){
			this.outName = parsed.setName(this.Url);
		}
		else{this.outName = outName;}
	}
	wget() {
		//downloading function using request from Request class
		let downld;
		let req;
		let res;
		let tmp = this.Url.protocol;
		let otnm = this.outName;
		downld = new EventEmitter();
		req = this.request({
			protocol: tmp.trim().toLowerCase().replace(/:$/, ''),
			host: this.Url.hostname,
			port: this.Url.port,
			path: this.Url.pathname,
			method: 'GET'
		}, function (res){
			let fileSize, writeStream, downloadedSize;
			if (res.statusCode === 200) {
				downloadedSize = 0;
				fileSize = res.headers['content-length'];
				writeStream = fs.createWriteStream(otnm);
				res.on('data', function (chunk) {
					downloadedSize += chunk.length;
					downld.emit('progress', downloadedSize / fileSize);
					console.log((downloadedSize / fileSize)*100);
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
		});
		
		req.end();
		req.on('error', function (err) {
			downld.emit('error', err);
		});
		
		return downld;
	}
}

class OutputFile {
	constructor(url, name){
		this.url = url;
		this.name = name;
		
	}
	getUrl(){
		return this.url;
	};
	getName(){
		return this.name;
	}
	
}

class Parse{
	constructor(str){
		this.str = str;
	}
	parseUrl() {
		let Url = url.parse(this.str);
		if(!Url.hostname){
			throw new URLError();
		}
		Url.protocol = this.cleanProtocol(Url.protocol);
		return Url;
	};
	cleanProtocol(str){
		return str.trim().toLowerCase().replace(/:$/, '');
	};
	setName(Url){  //setting name if user didn't enter the name of the file
		let str =Url.pathname;
		let s = str.lastIndexOf("/");
		this.name = str.substr(s+1, str.length);
		if(this.name === ''){
			this.name = 'file';
		}
		let cnt = 0;
		for(let i =0; i < this.name.length; i++){
			if(this.name[i] === '.'){cnt++};
		}
		if(cnt === 0){this.name += ".html"}
		return this.name;
	};
}

class URLError extends Error{
	message(){
		console.log("You entered wrong!");
	}
}


//////test of the program////////

let Url = 'hskjdhfkjsh';
let name = 'apple.html';  //you can set the name of the file here


const outFile = new OutputFile(Url, name);
const parse = new Parse(outFile.getUrl());
const request = new Request();
try{
	const D = new Download(parse.parseUrl(), outFile.getName(), parse);
	const D1 = new Download(parse.parseUrl(), name, parse);
	D.wget();
}
catch (URLError) {
	URLError.message();
}
//fs.unlink('apple.jpg', (e) => {if (e) console.log(e)});
