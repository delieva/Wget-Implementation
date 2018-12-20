'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//let json = require('jsonfile');

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
let keys;

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
		// let n = this.outName;
		// this.outName = outJson.check(n, names);
		// console.log('im first')

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
				outJson.appendData({[flName] : 0});
				size = Math.ceil((fileSize / 1024)*100)/100;
				writeStream = fs.createWriteStream(otnm);
				res.on('data', (chunk) => {
					downloadedSize += chunk.length;
					downld.emit('progress', downloadedSize / fileSize);
					pers = parseInt((downloadedSize / fileSize)*100);
					console.log(parseInt((downloadedSize / fileSize)*100));
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
			keys = outJson.showDownloaded(obg );
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

class OutJSON{
	constructor(jsonfile){
		this.jsonfile = jsonfile;
		this.obj = {
			table: []
		};
	}
	appendData(names){
		fs.readFile(this.jsonfile, 'utf8', (err, data)=>{
			if (err){
				console.log(err);
			} else {
				this.obj = JSON.parse(data); //now it an object
				this.obj.table.push(names); //add some data
			}
			fs.writeFile(this.jsonfile, JSON.stringify(this.obj), 'utf8');
		})
	}
	check(name, data){
		console.log('slfkdj111111')
		// fs.readFile('docs.json', 'utf8', (err, data)=>{
		// 	console.log('slfkdj')
		// 	if (err){
		// 		console.log(err);
		// 	} else {
		// 		console.log('lsllalalalla')
		// 		this.obj = JSON.parse(data); //now it an object
		// 		if(this.obj.table.name){
		// 			this.obj.table.name += 1;
		// 			fs.writeFile('docs.json', JSON.stringify(this.obj), 'utf8');
		// 			let a = name.lastIndexOf(".");
		// 			//name = name.substr(0, a) + "(" + this.obj.table.name + ")" + name.substr(a+1, name.length);
		// 			console.log(name);
		// 			return name;
		// 		}
		// 		else{
		// 			return name;
		// 		}
		// 	}
		// })
		if(data.table.name){
			data.table.name += 1;
			let a = name.lastIndexOf(".");
			name = name.substr(0, a) + "(" + this.obj.table.name + ")" + name.substr(a+1, name.length);
			console.log(name);
			//fs.writeFile('docs.json', JSON.stringify(this.obj), 'utf8');
			return name;
		}
	}
	getData(){
		fs.readFile('docs.json', 'utf8', (err, data)=>{
			console.log('11111')
			if (err){
				console.log(err);
			} else {
				this.obj = JSON.parse(data); //now it an object
				console.log(this.obj)
				let a = this.obj;
				return a;
			}
		})
	}
	showDownloaded(data){
		console.log("hello");
		let k = [];
		let result = "";
		let length = data.table.length;
		for (let i = 0; i < data.table.length; i++){
			for (let key in data.table[i]) {
				console.log(data.table[i][key]);
				console.log(key);
				k.push(key);
			}
		}
		console.log(k);
	return k;

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

let outJson = new OutJSON('docs.json');
let names = outJson.getData();
console.log(names);
let obg = {"table":[{"ppp.jpg":0},{"JSON.html":0},{"JSON.html":0},{"JSON.html":0},{"file.html":0}]};

app.post('/public', (req1, res1)=>{
	console.log('bitch');
	//try {
	console.log(names);
	const outFile = new OutputFile(req1.body.url, req1.body.name);
	const parse = new Parse(outFile.getUrl());
	const D = new Download(parse.parseUrl(), outFile.getName(), parse);
	D.wget(() => {res1.json({name: flName, size: size, key:keys})});

	//}
	// catch (e) {
	// 	pers = -1;
	// 	res1.json({error: "You entered wrong information!"})
	// }
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
