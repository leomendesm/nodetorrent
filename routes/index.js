"use strict";
var express = require('express');
var router = express.Router();
var WebTorrent = require('webtorrent')
var client = new WebTorrent()

var fs = require('fs');
var domain = require('domain').create();

function list (){
	fs.readdir('./public/files',function(error,files){
	   return files;
	});
	domain.on("error",function(erros){
	   console.log(erros);
	});
}

router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });

});

router.post('/torrent', (req, res, next) => {
	let magnetURI = req.body.torrent;
	console.log('here we go');
	client.add(magnetURI, { path: '/public/files' }, function (torrent) {
		console.log(torrent);
	  torrent.on('done', function () {
		console.log('torrent download finished')
	  })
	});
});


module.exports = router;
