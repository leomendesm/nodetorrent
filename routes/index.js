"use strict";
var express = require('express');
var router = express.Router();
//var Client = require('node-torrent');
//var client = new Client({logLevel: 'DEBUG'});
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
	client.add(magnetURI, { path: '/public/files' }, function (torrent) {
	  torrent.on('done', function () {
		console.log('torrent download finished')
	  })
	})
	/*var torrent = client.addTorrent(magnet);
	console.log(torrent);
	res.send(200);
	next();
	torrent.on('complete', function() {
    torrent.files.forEach(function(file) {
        var newPath = '/public/files/' + file.path;
        fs.rename(file.path, newPath);
        file.path = newPath;
        res.json('download', { name: file.path });
    });
	*/

});

})

module.exports = router;
