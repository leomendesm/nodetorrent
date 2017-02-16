var express = require('express');
var router = express.Router();
var Client = require('node-torrent');
var client = new Client({logLevel: 'DEBUG'});

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
	console.error(err.stack);
	let magnet = req.body.torrent;
	var torrent = client.addTorrent(magnet);
	// when the torrent completes, move it's files to another area
	torrent.on('complete', function() {
    torrent.files.forEach(function(file) {
        var newPath = '/public/files/' + file.path;
        fs.rename(file.path, newPath);
        file.path = newPath;
        res.json('download', { name: file.path });
    });
	next();
});

})

module.exports = router;
