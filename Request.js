'use strict'

const http = require('http');
const https = require('https');

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

exports.Request = Request;
