'use strict';
const fs = require('fs');


class OutJSON{
	constructor(jsonfile){
		this.jsonfile = jsonfile;
		this.obj = {};
	}
	check(name, data){
		for(let i = 0; i < data.table.length; i++){
			for (let key in data.table[i]){
				if(key === name){
					this.obj.table[i][key] += 1;
					let a = name.lastIndexOf(".");
					name = name.substr(0, a) + "(" + this.obj.table[i][key] + ")" + name.substr(a, name.length);
					fs.writeFile(this.jsonfile, JSON.stringify(this.obj), 'utf8');
					return name;
				}
				else{
					this.obj.table[this.obj.table.length] = {[name]: 1};
					fs.writeFile(this.jsonfile, JSON.stringify(this.obj), 'utf8');
					return name;
				}
			}
		}
		
	}
	showDownloaded(){
		let k = [];
		for (let i = 0; i < this.obj.table.length; i++){
			for (let key in this.obj.table[i]) {
				k.push(key);
			}
		}
		return k;
		
	}
	getData(){
		this.obj = JSON.parse(fs.readFileSync(this.jsonfile))
		return JSON.parse(fs.readFileSync(this.jsonfile));
	}
}

exports.OutJSON = OutJSON;
