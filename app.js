let	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	index = require('./routes/index'),
	express = require('express'),
 	app = express(),
	WebTorrent = require('webtorrent'),
	torrent = new WebTorrent(),
 	server = require('http').Server(app),
 	io = require('socket.io')(server),
	fs = require('fs'),
	domain = require('domain').create();

// view engine setup
app.use('/downloads', express.static(__dirname  + 'public/files'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
 function getFiles(dir, files_, fileType){
	var regex = fileType ? new RegExp('\\' + fileType + '$') : '';
	return fs.readdirSync(dir).reduce(function(allFiles, file){
		var name = path.join(dir, file);
		if (fs.statSync(name).isDirectory()){
			getFiles(name, allFiles, fileType);
		} else if (file.match(regex)){
			allFiles.push(name);
		}
		return allFiles;
	}, files_ || []);
 }
app.get('/list',(req, res, next)=>{
	res.render('list', { files : getFiles(__dirname + '/public/files') } )
})
io.sockets.on('connection', function (client) {
   	client.on('toServer', function (data) {
	let magnetURI = data.magnet;
	client.emit(data.id, { status: 1});
	torrent.add(magnetURI, { path: __dirname + '/public/files' }, function (torrent) {
	  torrent.on('done', function () {
	 	client.emit(data.id, { status: 2, files: getFiles(__dirname + '/public/files')});
	})
   	});

 })
});
process.setMaxListeners(0);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(80, function(){
	console.log('running on *:80');
});

module.exports = app;
