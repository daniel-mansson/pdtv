var BarChart = function(color) {
		this.hitCount = 0;
		var hitCounts = [];	
		
		var divWidth = 600;
		var w = 12;
		var h = 100;
		var x = d3.scale.linear().domain([0, 1]).range([0, w]);
		var y = d3.scale.log().base(0.1).domain([1, 20000]).rangeRound([0, h]);

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
		})(this), 1000);
		
		$("#chartContainer").width(divWidth);

		this.chart = d3.select("#chartContainer")
			.append("svg").append("g")
			.attr("transform","translate(0,1)")
			.attr("class", "chart")
			.attr("width", w * hitCounts.length)
			.attr("height", h);

		/*this.chart.append("line")
			.attr("x1", 0)
			.attr("x2", divWidth)
			.attr("y1", h - .5)
			.attr("y2", h - .5)
			.style("stroke", "#000");		
		*/
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
	  .duration(800)
	  .attr("x", function(d, i) { return x(i) - .5; });

	rect.transition()
	      .duration(800)
	      .attr("x", function(d, i) { return x(i) - .5; });
	
	rect.exit().transition()	
		.duration(800)
		.attr("x", function(d, i) { return x(i - 1) - .5; })
		.remove();
}

