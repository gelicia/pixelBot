var express = require('express');
var serveStatic = require('serve-static');
var rest = require('restler');
var bodyParser = require('body-parser')

var particleInfo = require('./pixelBotParticle');

var app = express();

app.use(serveStatic('public', {'index': ['index.html', 'index.htm']}));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/setPixel', urlencodedParser, function (req, res) {
	var pixelX = req.body.pixX;
	var pixelY = req.body.pixY;
	var pixelR = req.body.pixR;
	var pixelG = req.body.pixG;
	var pixelB = req.body.pixB;

	var argString =  pixelX + "," + pixelY + "," + pixelR + "," + pixelG + "," + pixelB;

	rest.post('https://api.particle.io/v1/devices/' + particleInfo.deviceID + '/setPixel', {
			data: { 'access_token': particleInfo.accessToken,
			'args': argString}
	}).on('complete', function(data, response) {
		res.send(data);
	});
});

app.get('/getLEDArrDimensions', function (req, res) {
	rest.get('https://api.particle.io/v1/devices/' + particleInfo.deviceID + '/ledDim?access_token=' + particleInfo.accessToken)
	.on('complete', function(data, response) {
		if (data.result){
			var commaIdx = data.result.indexOf(",");
			var output = {};
			output.height = data.result.substring(0, commaIdx);
			output.width = data.result.substring(commaIdx+1);
			res.send(output);
		}
		else{
			res.send(data);
		}
		
		//todo other particle errors?? 
		
	})
	.on('fail', function(data, response){
		res.send(data);
	});
});

app.get('/getLEDPixels', function (req, res) {
	rest.get('https://api.particle.io/v1/devices/' + particleInfo.deviceID + '/ledArr?access_token=' + particleInfo.accessToken)
	.on('complete', function(data, response) {
		var arrResult = JSON.parse(data.result);
		var output = {};
		output.leds = [];
		for (var i = 0; i < arrResult.length; i++) {
			output.leds[i] = {};
			output.leds[i].r = arrResult[i][0];
			output.leds[i].g = arrResult[i][1];
			output.leds[i].b = arrResult[i][2];
		}
		res.send(output);
	});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Pixelbot Server at http://%s:%s', host, port);
});