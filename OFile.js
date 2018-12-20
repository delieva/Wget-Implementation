'use strict';

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

exports.OutputFile = OutputFile;
