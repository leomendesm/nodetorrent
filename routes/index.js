"use strict";
 let express = require('express'),
	 fs = require('fs'),
	 domain = require('domain').create(),
 	router = express.Router();


router.get('/', function(req, res, next) {
	var rand = (Math.random()+1).toString(36).substring(7);
  	res.render('index', { rand: rand });
});
router.get('/file/delete/:arquivo', function(req, res, next) {
	fs.unlink(__dirname + '/public/files/'+req.params.arquivo, ()=>{
		console.log('sucesso');
	});
});

module.exports = router;
