'use strict';
const fs = require('fs');


class OutJSON{
	constructor(jsonfile){
		this.jsonfile = jsonfile;
		this.obj = {
			table: [{fuck: "shit"}]
		};
	}
	appendData(files){
		fs.readFile(this.jsonfile, 'utf8', (err, data)=>{
			if (err){
				console.log(err);
			} else {
				this.obj = JSON.parse(data); //now it an object
				this.obj.table.push(files); //add some data
			}
			fs.writeFile(this.jsonfile, JSON.stringify(this.obj), 'utf8');
		})
	}
	check(name, data){
		console.log("hello" +data);
		for(let i = 0; i < data.table.length; i++){
			console.log('mamaMia')
			for (let key in data.table[i]){
				if(key === name){
					console.log('ohhh')
					names.table[i][key] += 1;
					let a = name.lastIndexOf(".");
					name = name.substr(0, a) + "(" + names.table[i][key] + ")" + name.substr(a, name.length);
					console.log(name);
					fs.writeFile('docs.json', JSON.stringify(names), 'utf8');
					return name;
				}
			}
		}
		
	}
	showDownloaded(){
		console.log("hello");
		let k = [];
		for (let i = 0; i < names.table.length; i++){
			for (let key in names.table[i]) {
				console.log(names.table[i][key]);
				console.log(key);
				k.push(key);
			}
		}
		console.log(k);
		return k;
		
	}
	getData(){
		fs.readFile('docs.json', 'utf8', (err, data)=>{
			if (err){
				console.log(err);
			} else {
				this.obj = JSON.parse(data); //now it an object
				console.log(this.obj)
				return this.obj
			}
		})
	}
}

exports.OutJSON = OutJSON;