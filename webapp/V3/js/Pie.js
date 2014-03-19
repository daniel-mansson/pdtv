var Pie = function(){
            
    data = [{"label":"undefined", "value":1}, 
    		{"label":"displayed", "value":0}];
    		
    makePie(data);
    
	$('#pieButton').click(function(){
		if ($(this).val() == "hidden"){
			$(this).text("Hide Piechart!");
			$(this).val("shown");
			$('#pieDiv').show();
		}
		else{
			$(this).text("Show Piechart");
			$(this).val("hidden");
			$('#pieDiv').hide();
		}
	});
};
/*__*/
var makePie = function(data){
 	w = 165;                       
    h = 165;                          
    r = Math.min(w, h) / 2;                         
    //color = d3.scale.category20c();     //builtin range of colors   
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
 
    pie = d3.layout.pie()           //this will create arc data for us given a list of values
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
	
	var array = [];
	var uvalue = 0;
	var dvalue = 0;
	
	data.data.forEach(function(packet){
	/*packet.from.country __ och to.country __*/
		if(packet.from.Country != "__" && packet.to.Country != "__") {
			dvalue += packet.HitCount;		
		}
		else if(packet.from.Country != "Unknown" || packets.to.Country != "Unknown"){
			dvalue += packet.HitCount;	
		}
		else {
			uvalue += packet.HitCount;
		}
	});
	var map = {};
	map["label"] = "undefined";
	map["value"] = uvalue; 
	array.push(map);
	var map2 = {};
	map2["label"] = "displayed";
	map2["value"] = dvalue;
	array.push(map2);

	vis.data([array]);
	arcs.data(pie);
	arcs.select("path").attr("d", arc);
	arcs.select("path").transition().duration(500).attrTween("d", arcTween); // redraw the arcs		(fast 100 - 750 slower)
};

function arcTween(a) {
	  var i = d3.interpolate(this._current, a);
	  this._current = i(0);
	  return function(t) {
	    return arc(i(t));
	  };
}
