'use strict'

const url = require('url');

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

exports.Parse = Parse;
