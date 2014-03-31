var BarChart = function(color) {
		this.hitCount = 0;
		var hitCounts = [];	

		
		var divWidth = $("#outerMapContainer").width();
		var w = divWidth / 60;
		var h = $(window).height() - $("#mapContainer").height() - 100;
		if(h < 70)
			h = 70;
		else if(h > 200)
			h = 200;

		this.w = w;
		this.h = h;
		
		this.x = d3.scale.linear().domain([0, 1]).range([0, w]);
		this.y = d3.scale.log().base(0.1).domain([1, 20000]).rangeRound([0, h]);

		var x = this.x;
		var y = this.y;

		var numBars = divWidth / w;
		for (var i=0;i<numBars;i++)	{
			hitCounts.push({value:0});
		}

		var self = this;
		this.interval = setInterval(function() {
			hitCounts.shift();
			hitCounts.push({value: self.hitCount});
			self.hitCount=0;
			self.redraw(hitCounts,x,y,w,h,color);
		}, 1000);

		$("#chartContainer").width(divWidth);
		$("#chartContainer").height(h);

		this.chart = d3.select("#chartContainer")
			.append("svg").append("g")
			.attr("transform","translate(0,1)")
			.attr("class", "chart")
			.attr("width", w * hitCounts.length)
			.attr("height", h);

};

BarChart.prototype.remove = function() {
	$("#chartContainer").empty();
	window.clearInterval(this.interval);
};
			
BarChart.prototype.onRealtimeUpdate = function(packets) {	
	var hitCount = 0;
	$.each(packets.data, function(index,element)
		{
			hitCount += element.HitCount;		
		});
	this.hitCount += hitCount;
};

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

