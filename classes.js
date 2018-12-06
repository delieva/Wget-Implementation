'use strict'

let http = require('http');
let https = require('https');
let url = require('url');
let fs = require('fs');

class Request extends Out{
	options;
	constructor(){
		super();
	}
	setProtocol(){
		//method for setting protocol if it dosen't matched
		if (!options.protocol) {
			options.protocol = 'http';
		}
	}
	request(){
		//method for making a request
		if (options.protocol === 'http') {
			return http.request(options, callback);
		}
		if (options.protocol === 'https') {
			return https.request(options, callback);
		}
		throw 'only allow http or https request!';
	}
}


class Download extends Request{
	downld;
	req = request({
		protocol: srcUrl.protocol,
		host: srcUrl.hostname,
		port: srcUrl.port,
		path: srcUrl.pathname,
		method: 'GET'});
	download(){
		//downloading function using request from Request class
	}
}

class Out{
	constructor(){};
}
