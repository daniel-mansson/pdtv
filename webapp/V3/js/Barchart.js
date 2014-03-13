var BarChart = function(model) {
		this.hitCount = 0;
		var hitCounts = [{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0}];	

		var w = 20;
		var h = 100;
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
			.attr("transform","translate(50,50)");

		this.chart.append("line")
			.attr("x1", 0)
			.attr("x2", w * hitCounts.length)
			.attr("y1", h - .5)
			.attr("y2", h - .5)
			.style("stroke", "#000");

		d3.select("#chartContainer svg").append("g")
			.attr("class", "grid")
			.style("stroke-width",0)
			.call(d3.svg.axis()
			.scale(d3.scale.linear().domain([500, 0]).rangeRound([0, h]))
			.orient("left").ticks(5))
			.attr("transform","translate(50,50)");
}
			
BarChart.prototype.onRealtimeUpdate = function(packets) {	
	var hitCount = 0;
	$.each(packets.data, function(element,index,array)
		{hitCount += element;});
	this.hitCount += hitCount;
}


BarChart.prototype.redraw = function(data,x,y,w,h) {
	console.log(JSON.stringify(data));
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
