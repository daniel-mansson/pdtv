//make and update a pie-chart with calculated values from the packets
var Pie = function(){
    this.dvalue = 0;
    this.uvalue = 0;
    
	this.homeCountry = "__";
	
    //some starting values to draw the pie for the first time
    data = [{"label":"undefined", "value":1}, 
    		{"label":"displayed", "value":0}];
    		
    makePie(data);
	
	//update the pie in this interval
	this.interval = setInterval((function(self) {
		return function() {			
			//don't redraw pie if both values are 0
			if(self.dvalue != 0 || self.uvalue != 0){
				array = [];
				var map = {};
				map["label"] = "undefined";
				map["value"] = self.uvalue; 
				array.push(map);
				var map2 = {};
				map2["label"] = "displayed";
				map2["value"] = self.dvalue;
				array.push(map2);
				
				vis.data([array]);
				arcs.data(pie);
				arcs.select("path").attr("d", arc);
				arcs.select("path").transition().duration(400).attrTween("d", arcTween); // redraw the arcs		(fast 100 - 750 slower)
			}
		    self.dvalue = 0;
		    self.uvalue = 0;
		};
	})(this), 500);
};

/*__*/
/*create the pie*/
var makePie = function(data){
 	w = 165;                       
    h = 165;                          
    r = Math.min(w, h) / 2;                         
 
    color = d3.scale.ordinal().range(["#18689C", "#15438A"]);

    vis = d3.select("#pieDiv")
        .append("svg:svg")              //create the SVG element inside the <body>
        .attr("id","pie")
        .data([data])                   //associate our data with the document
            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")");    //move the center of the pie chart from 0, 0 to radius, radius
 
    arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);
 
    pie = d3.layout.pie().sort(null)           //this will create arc data for us given a list of values
        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array
 
    arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
        .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
        .attr("class", "slice");    //allow us to style things in the slices (like text)
 
    arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
        .attr("d", arc)
        .each(function(d) { this._current = d; });                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
 
};

Pie.prototype.onRealtimeUpdate = function(data) {
	
	var uvalue = 0;
	var dvalue = 0;
	
	//count the number of packets that are unknown and known
	data.data.forEach(function(packet){
		var from = packet.from.Country;
		var to = packet.to.Country;
		/* undefined values == '__' or 'Unknown'*/
		if(from != this.homeCountry && to != "__") {
			dvalue += packet.HitCount;		
		}
		
	/*	else if(packet.to.Country != "Unknown" || packet.from.Country != "Unknown"){
			dvalue += packet.HitCount;	
		}*/
		else {
			uvalue += packet.HitCount;
		}
	});
	
	//store the calculated values until updated in interval
	this.uvalue += uvalue;
	this.dvalue += dvalue;
};

//some "animation" from the old value to the new in the pie
function arcTween(a) {
	  var i = d3.interpolate(this._current, a);
	  this._current = i(0);
	  return function(t) {
	    return arc(i(t));
	  };
}
