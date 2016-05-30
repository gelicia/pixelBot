var ledInfo = [];
var rootURL;

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
	    function(ledDimensions, err) { //TODO ERRORS
	    	//{width: 6, height: 4}
	       ledInfo = d3.range(0, ledInfo.width * ledInfo.height).map(function(d){return {};});;

	       var circleData = {radius : 5, spacing: 3};

	       var svg = d3.select("#ledArray").append("svg");
	       var ledGrp = svg.append("g");

	       var circleData = {radius: 5, spacing: 5};

	       ledGrp.selectAll("circle").data(ledInfo).enter().append("circle")
	       .attr({
		       	cx: function(d, i){return (Math.floor(i%ledDimensions.height) * 10) + 5;},
		       	cy: function(d, i){return (i * 10) + 5;},
		       	r: circleData.radius,
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