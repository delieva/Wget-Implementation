'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
let pers = 0;
let size;
let flName;

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
		flName = this.outName;
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
				size = Math.ceil((fileSize / 1024)*100)/100;
				writeStream = fs.createWriteStream(otnm);
				res.on('data', (chunk) => {
					downloadedSize += chunk.length;
					downld.emit('progress', downloadedSize / fileSize);
					pers = parseInt((downloadedSize / fileSize)*100);
					console.log(pers);
					writeStream.write(chunk);
					// setTimeout(function () {
					// 	res.pause();
					// 	console.log('There will be no additional data for 1 second.');
					// 	/*setTimeout(() => {
					// 		console.log('Now data will start flowing again.');
					// 		res.resume();
					// 	}, 4000);*/
					// }, 5000);
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



//////test of the program////////

let Url = 'http://pmit.kname.edu.ua/images/refpdf/A2009_2_Levchenko.pdf';
let name = 'bear4.pdf';  //you can set the name of the file here

app.post('/public', (req, res)=>{
	console.log('bitch');
	try {
		const outFile = new OutputFile(req.body.url, req.body.name);
		const parse = new Parse(outFile.getUrl());
		const D = new Download(parse.parseUrl(), outFile.getName(), parse);
		D.wget();
	}
	catch (e) {
		pers = -1;
		//console.log('error')
		res.json({error: "You entered wrong information!"})
	}
});

app.post('/stop1', (req, res)=>{
	console.log('bitchhhhhhh');
	if(pers !== -1){
		res.json({name: flName, size: size})
	}
	else{
		res.json({data: "error"})
	}
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});