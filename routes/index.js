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
console.log('vamo')
console.log(req.body);
let magnet = req.body.torrent;
console.log(magnet);
var torrent = client.addTorrent(magnet);

// when the torrent completes, move it's files to another area
torrent.on('complete', function() {
    console.log('complete!');
    torrent.files.forEach(function(file) {
        var newPath = '/public/files/' + file.path;
        fs.rename(file.path, newPath);
        // while still seeding need to make sure file.path points to the right place

        file.path = newPath;
        res.render('download', { name: file.path })

    });

});

})

module.exports = router;
