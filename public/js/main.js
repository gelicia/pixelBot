var ledInfo = [];
var rootURL;
var arrDims = {};

function init(){
    var colorpicker = $('#cp7').colorpicker({
    	format: "hex",
        color: '#ff0000',
        container: true,
        inline: true
    });

    d3.json('config.js', function(err, config){
		if (err ||  !config.rootURL ){ //TODO test removing config.js and fing with the contents
    		console.log(err, config);
    	}
    	rootURL = config.rootURL;

		//get LED info
	    $.ajax({url: rootURL + "/getLEDArrDimensions"}).fail(function(errorInfo) { 
 			changeStatus('alert', errorInfo.status, errorInfo.statusText);
 		}).then( function(arrDimsOut) { 
			changeStatus();
			arrDims = arrDimsOut;
			var ledInfo = d3.range(arrDims.width * arrDims.height).map(function(d){
				var xy = getXY(d);
				xy.addr = d;
				return xy;
		    });

			var circleData = {r : 10, spacing: 5};

			var svg = d3.select("#ledArray").append("svg");
			var ledGrp = svg.append("g").attr("transform", "scale(1,-1) translate(" + circleData.r + ",-" + (((circleData.r*2)+circleData.spacing)*arrDims.height) + ")");

			ledGrp.selectAll("circle").data(ledInfo).enter().append("circle")
			.attr({
				cx: function(d){return d.x * (((circleData.r*2)+circleData.spacing))+circleData.spacing;},
      			cy: function(d){return d.y * (((circleData.r*2)+circleData.spacing))+circleData.spacing;},
		       	r: circleData.r,
		       	"stroke-width": 1,
      			"stroke": "#000",
		       	"fill": "#000000",
		       	"id": function(d){return "led_" + d.addr;}
			}).on("click", function(clkLED){
				//todo setLED and set led image on success
				var led = d3.select("#led_"+clkLED.addr);
				var color = {};

				if (led.attr("fill") == "#000000"){
					color.hex = $('#cp7').colorpicker().data().color;
	       		}
	       		else {
					color.hex = "#000000";
	       		}	

	       		color.r = parseInt(color.hex.substring(1,3), 16);
	       		color.g = parseInt(color.hex.substring(3,5), 16);
	       		color.b = parseInt(color.hex.substring(5,7), 16);

				$.ajax({
					method: 'POST',
					url: rootURL + "/setPixel",
					data: {
						pixX:clkLED.x,
						pixY:clkLED.y,
						pixR:color.r,
						pixG:color.g,
						pixB:color.b
					}
				}).fail(function(errorInfo) { 
		 			changeStatus('alert', errorInfo.status, errorInfo.statusText);
		 		}).then(function(d,err){ 
		 			changeStatus();
					led.attr("fill", color.hex);
				});
	       });

	       refreshFromDevice();

	       setInterval(function(){
	       	refreshFromDevice();
	       }, 1000);
	    });
    });
}

function getXY(addr){
	var yNum = Math.floor(addr/arrDims.width);
	var xNum;
	if (yNum%2 ==0){ //even row
		xNum = addr - (yNum * arrDims.width);
	}
	else { //odd row
		xNum = ((yNum+1)*arrDims.width)-(addr+1); //can this be simplified?
	}

	return {x: xNum, y: yNum };
}

function refreshFromDevice(){
	$.ajax({ url: rootURL + "/getLEDPixels"}).fail(function(errorInfo) { 
		changeStatus('alert', errorInfo.status, errorInfo.statusText);
	}).then(function(particleLEDInfo, err) { 
		changeStatus();
    	for (var i = 0; i < particleLEDInfo.leds.length; i++) {
    		var led = d3.select("#led_"+ i);
			var fillR = particleLEDInfo.leds[i].r.toString(16);
    		var fillG = particleLEDInfo.leds[i].g.toString(16);
    		var fillB = particleLEDInfo.leds[i].b.toString(16);

    		fillR = fillR.length == 1 ? "0" + fillR : fillR;
    		fillG = fillG.length == 1 ? "0" + fillG : fillG;
    		fillB = fillB.length == 1 ? "0" + fillB : fillB;

    		led.attr("fill", "#" + fillR + fillG + fillB);
    	} 
    });
}

function changeStatus(kind, statusCode, statusMessage){
	var container = $('.status-container');
	if (kind === undefined){
		container.empty();
	}
	else{
		var alertText = statusCode + ": " + statusMessage;
		container.append("<div class=\"alert alert-danger\" role=\"alert\">" + alertText + "</div>");	
	}

	
}