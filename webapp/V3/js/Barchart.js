var BarChart = function(color) {
		this.hitCount = 0;
		var hitCounts = [];	
		
		var divWidth = 600;
		var w = 12;
		var h = 80;
		var x = d3.scale.linear().domain([0, 1]).range([0, w]);
		var y = d3.scale.log().domain([1, 1500]).rangeRound([0, h]);

		var numBars = divWidth / w;
		console.log(numBars);
		for (var i=0;i<numBars;i++)
		{
			hitCounts.push({value:0});
		}


		this.interval = setInterval((function(self) {
			return function() {
				hitCounts.shift();
				hitCounts.push({value: self.hitCount});
				self.hitCount=0;
				self.redraw(hitCounts,x,y,w,h,color);
			}
		})(this), 500);
		
		$("#innerChartContainer").width(divWidth);

		this.chart = d3.select("#innerChartContainer")
			.append("svg").append("g")
			.attr("class", "chart")
			.attr("width", w * hitCounts.length)
			.attr("height", h);

		this.chart.append("line")
			.attr("x1", 0)
			.attr("x2", divWidth)
			.attr("y1", h - .5)
			.attr("y2", h - .5)
			.style("stroke", "#000");

		var yAxis = d3.svg.axis()
			.scale(d3.scale.log().domain([500, 1]).rangeRound([0, h]))
			.orient("right").ticks(3);
		
		var axis = d3.select("#chartAxisContainer")
			.append("svg").append("g");
		
		axis.attr("class","grid").call(yAxis);	
		
		
}
			
BarChart.prototype.onRealtimeUpdate = function(packets) {	
	var hitCount = 0;
	$.each(packets.data, function(index,element)
		{
			hitCount += element.HitCount;		
		});
	this.hitCount += hitCount;
}


BarChart.prototype.redraw = function(data,x,y,w,h,color) {
	var rect = this.chart.selectAll("rect")
		.data(data, function(d) { return data.indexOf(d); });
	
	rect.enter().insert("rect", "line")
	  .attr("x", function(d, i) { return x(i + 1) - .5; })
	  .attr("y", function(d) {return h - y(d.value+1) - .5; })
	  .attr("width", w)
	  .attr("height", function(d) { return y(d.value+1); })
	  .style("fill", function(d) { return color(d.value);})
	  .transition()
	  .duration(400)
	  .attr("x", function(d, i) { return x(i) - .5; });

	rect.transition()
	      .duration(400)
	      .attr("x", function(d, i) { return x(i) - .5; });
	
	rect.exit().transition()	
		.duration(400)
		.attr("x", function(d, i) { return x(i - 1) - .5; })
		.remove();
}

