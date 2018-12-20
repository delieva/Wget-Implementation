'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const OutJ = require('./OutJSON');
const Downld = require('./Download');
const Outf = require('./OFile')
const Prs = require('./Parse')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.post('/public', (req1, res1)=>{
	try {
		let outJson = new OutJ.OutJSON('docs.json', {});
		let heap = outJson.getData();
		const outFile = new Outf.OutputFile(req1.body.url, req1.body.name);
		const parse = new Prs.Parse(outFile.getUrl());
		const D = new Downld.Download(parse.parseUrl(), outFile.getName(), parse, heap, outJson);
		D.wget((flName, size) => {res1.json({name: flName, size: size, keys: outJson.showDownloaded()})});
	}
	catch (e) {
		res1.json({error: "You entered wrong information!"})
	}
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
