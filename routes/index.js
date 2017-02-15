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
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/torrent', (req, res, next) => {
	var magnetURI = req.body.torrent;
	client.add(magnetURI, { path: '/public/files' }, function (torrent) {
	 	torrent.on('done', function () {
  			res.render('download', { name: list() });
	  	})
	})
})
module.exports = router;
