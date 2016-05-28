var express = require('express');
var serveStatic = require('serve-static');
var rest = require('restler');

var particleInfo = require('./pixelBotParticle');

var app = express();

app.use(serveStatic('public', {'index': ['index.html', 'index.htm']}));

app.post('/setPixel', function (req, res) {
	var pixelX = req.query.pixX;
	var pixelY = req.query.pixY;
	var pixelR = req.query.pixR;
	var pixelG = req.query.pixG;
	var pixelB = req.query.pixB;

	rest.post('https://api.spark.io/v1/devices/' + particleInfo.deviceID + '/setPixel', {
			data: { 'access_token': particleInfo.accessToken,
			'args': pixelX + "," + pixelY + "," + pixelR + "," + pixelG + "," + pixelB}
	}).on('complete', function(data, response) {
		res.sendStatus(200);
	});
});

app.get('/getLEDArrDimensions', function (req, res) {
	rest.get('https://api.spark.io/v1/devices/' + particleInfo.deviceID + '/ledDimensions', {
			data: { 'access_token': particleInfo.accessToken }
	}).on('complete', function(data, response) {
		//todo response error?? send 500
		var output = data;
		res.send(output);
	});
});

app.get('/getLEDPixels', function (req, res) {
	rest.get('https://api.spark.io/v1/devices/' + particleInfo.deviceID + '/getLEDArr', {
			data: { 'access_token': particleInfo.accessToken }
	}).on('complete', function(data, response) {
		//todo response error?? send 500
		var output = data;
		res.send(output);
	});
});

var server = app.listen(1337, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Pixelbot Server at http://%s:%s', host, port);
});