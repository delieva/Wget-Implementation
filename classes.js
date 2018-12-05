'use strict'

let http = require('http');
let https = require('https');
let url = require('url');
let fs = require('fs');

class Request {
	options;
	constructor(){
	
	}
	setProtocol(){
		//method for setting protocol if it dosen't matched
	}
	request(){
		//method for making a request
		
	}
}




class Download extends Request{
	downld; //tmp
	req;
	download(){
		//downloading function using request from Request class
	}
}
