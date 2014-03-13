var BarChart = function(model) {
		this.hitCount = 0;
		var hitCounts = [{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0}];	

		var w = 20;
		var h = 80;
		var x = d3.scale.linear().domain([0, 1]).range([0, w]);
		var y = d3.scale.linear().domain([0, 500]).rangeRound([0, h]);

		this.interval = setInterval((function(self) {
			return function() {
				hitCounts.shift();
				hitCounts.push({value: self.hitCount});
				self.hitCount=0;
				self.redraw(hitCounts,x,y,w,h);
			}
		})(this), 1500);


		this.chart = d3.select("#chartContainer")
			.append("svg").append("g")
			.attr("class", "chart")
			.attr("width", w * hitCounts.length - 1).attr("height", h)
			.attr("transform","translate(150,10)");

		this.chart.append("line")
			.attr("x1", 0)
			.attr("x2", w * hitCounts.length)
			.attr("y1", h - .5)
			.attr("y2", h - .5)
			.style("stroke", "#000");

		var xAxis = d3.svg.axis()
			.scale(d3.scale.linear().domain([500, 0]).rangeRound([0, h]))
			.orient("right").ticks(5);

		var yAxis = d3.svg.axis()
			.scale(y).orient("bottom").ticks(20);
			
		var axis = d3.select("#chartContainer svg").append("g");
		
		axis.attr("class", "grid")
			.call(xAxis)
			.attr("transform","translate(550,10)");
		//axis.attr("class","grid").call(yAxis);	
		
}
			
BarChart.prototype.onRealtimeUpdate = function(packets) {	
	var hitCount = 0;
	$.each(packets.data, function(element,index,array)
		{hitCount += element;});
	this.hitCount += hitCount;
}


BarChart.prototype.redraw = function(data,x,y,w,h) {
	//console.log(JSON.stringify(data));
	var rect = this.chart.selectAll("rect")
		.data(data, function(d) { return data.indexOf(d); });
	
	rect.enter().insert("rect", "line")
	  .attr("x", function(d, i) { return x(i + 1) - .5; })
	  .attr("y", function(d) { return h - y(d.value) - .5; })
	  .attr("width", w)
	  .attr("height", function(d) { return y(d.value); })
	  .transition()
	  .duration(1000)
	  .attr("x", function(d, i) { return x(i) - .5; });

	rect.transition()
	      .duration(1000)
	      .attr("x", function(d, i) { return x(i) - .5; });
	
	rect.exit().transition()
		.duration(1000)
		.attr("x", function(d, i) { return x(i - 1) - .5; })
		.remove();


}
