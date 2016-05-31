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
    	rootURL = config.rootURL;

		//get LED info
	    $.ajax({url: rootURL + "/getLEDArrDimensions"}).then(
	    function(arrDimsOut, err) { //TODO ERRORS
	    	//{width: 6, height: 4}
	    	arrDims = arrDimsOut;
	       var ledInfo = d3.range(arrDims.width * arrDims.height).map(function(d){
		      var xy = getXY(d);
		      xy.addr = d;
		      return xy;
		    });

	       var circleData = {r : 10, spacing: 10};

	       var svg = d3.select("#ledArray").append("svg");
	       var ledGrp = svg.append("g").attr("transform", "scale(1,-1) translate(0,-" + (((circleData.r*2)+circleData.spacing)*arrDims.height) + ")");

	       ledGrp.selectAll("circle").data(ledInfo).enter().append("circle")
	       .attr({
      			cx: function(d){return d.x * (((ledProps.r*2)+ledProps.spacing))+ledProps.spacing;},
      			cy: function(d){return d.y * (((ledProps.r*2)+ledProps.spacing))+ledProps.spacing;},
		       	r: circleData.r,
		       	"stroke-width": 1,
      			"stroke": "#000",
		       	"fill": "#fff",
		       	"id": function(d){return "led_" + d;}
	       }).on("click", function(e){
	       		//todo setLED and set led image on success
	       		$("#led_"+e).attr("fill", function(){return $('#cp7').colorpicker().data().color;});
	       });

	       refreshFromDevice();
	       //when done, fill in color
	    });
    });

    //todo set repeating call to get LED info and set picture
}

function getXY(addr){
      var yNum = Math.floor(addr/arrDims.width);
      var xNum;
      if (yNum%2 ==0){ //even row
        xNum = addr - (yNum * arrDims.width);
      }
      else { //odd row
        xNum = ((yNum+1)*arrDims.width)-(addr+1);
      }
      
      return {x: xNum, y: yNum };
    }

function refreshFromDevice(){
	$.ajax({ url: rootURL + "/getLEDPixels"}).then(
	function(particleLEDInfo, err) { //TODO ERRORS
    	for (var i = 0; i < ledInfo.length; i++) {
    		ledInfo[i].r = parseInt(particleLEDInfo[i].r, 16);
    		ledInfo[i].g = parseInt(particleLEDInfo[i].g, 16);
    		ledInfo[i].b = parseInt(particleLEDInfo[i].b, 16);
    	} 
    });
}
