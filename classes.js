'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let OutJ = require('./OutJSON');

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

let keys;
let size;
let flName;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

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
	constructor(Url, outName, parsed, heap){
		super();
		this.Url = Url;
		this.heap = heap;
		if(outName === ""){
			this.outName = parsed.setName(this.Url);
		}
		else{this.outName = outName;}
		let n = this.outName;
		this.outName = outJson.check(n, this.heap);
		console.log('im first')
		
	}
	wget(callback) {
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
			keys = outJson.showDownloaded();
			callback();
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

class OutJSON{
	constructor(jsonfile){
		this.jsonfile = jsonfile;
		this.obj = {
			table: [{fuck: "shit"}]
		};
	}
	check(name, data){
		console.log("hello" +data);
		for(let i = 0; i < data.table.length; i++){
			console.log('mamaMia')
			for (let key in data.table[i]){
				if(key === name){
					console.log('ohhh')
					this.obj.table[i][key] += 1;
					let a = name.lastIndexOf(".");
					name = name.substr(0, a) + "(" + this.obj.table[i][key] + ")" + name.substr(a, name.length);
					console.log(name);
					fs.writeFile('docs.json', JSON.stringify(this.obj), 'utf8');
					return name;
				}
			}
		}
		
	}
	showDownloaded(){
		console.log("hello");
		let k = [];
		for (let i = 0; i < this.obj.table.length; i++){
			for (let key in this.obj.table[i]) {
				console.log(this.obj.table[i][key]);
				console.log(key);
				k.push(key);
			}
		}
		console.log(k);
		return k;
		
	}
	getData(){
		// fs.readFile('docs.json', 'utf8', (err, data)=>{
		// 	if (err){
		// 		console.log(err);
		// 	} else {
		// 		this.obj = JSON.parse(data); //now it an object
		// 		console.log(JSON.parse(data))
		// 		this.obj = this.obj
		// 		}
		// 	})
		this.obj = JSON.parse(fs.readFileSync("docs.json"))
		return JSON.parse(fs.readFileSync("docs.json"));
	}
}


//////test of the program////////

let outJson = new OutJSON('docs.json', {});
let heap = outJson.getData();
console.log(heap);



app.post('/public', (req1, res1)=>{
	console.log('bitch');
	try {
		let outJson = new OutJSON('docs.json', {});
		let heap = outJson.getData();
			const outFile = new OutputFile(req1.body.url, req1.body.name);
			const parse = new Parse(outFile.getUrl());
			const D = new Download(parse.parseUrl(), outFile.getName(), parse, heap);
			D.wget(() => {res1.json({name: flName, size: size, keys: keys})});
		
	}
	catch (e) {
		res1.json({error: "You entered wrong information!"})
	}
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});