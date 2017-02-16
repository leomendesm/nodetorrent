"use strict";
 let express = require('express'),
 router = express.Router();


router.get('/', function(req, res, next) {
	var rand = (Math.random()+1).toString(36).substring(7);
  	res.render('index', { rand: rand });
});

module.exports = router;
