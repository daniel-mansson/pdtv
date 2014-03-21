var BarChart = function(model) {
		this.hitCount = 0;
		var hitCounts = [{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0},{value:0}];	

		var w = 10;
		var h = 80;
		var x = d3.scale.linear().domain([0, 1]).range([0, w]);
		var y = d3.scale.log().domain([1, 500]).rangeRound([0, h]);
		
		console.log("y(0): "+y(0));
		console.log("y(0.1): "+y(0.1));
		console.log("y(1): "+y(1));
		console.log("y(10): "+y(10));
		console.log("y(100): "+y(100));
		console.log("y(150): "+y(150));

		this.interval = setInterval((function(self) {
			return function() {
				hitCounts.shift();
				hitCounts.push({value: self.hitCount});
				self.hitCount=0;
				self.redraw(hitCounts,x,y,w,h);
			}
		})(this), 500);


		this.chart = d3.select("#chartContainer")
			.append("svg").attr("id","Barchart").append("g")
			.attr("class", "chart")
			.attr("width", w * hitCounts.length - 1).attr("height", h)
			.attr("transform","translate(0,10)");

		this.chart.append("line")
			.attr("x1", 0)
			.attr("x2", w * hitCounts.length)
			.attr("y1", h - .5)
			.attr("y2", h - .5)
			.style("stroke", "#000");

		var yAxis = d3.svg.axis()
			.scale(d3.scale.log().domain([500, 1]).rangeRound([0, h]))
			.orient("right").ticks(3);
		/*
		var xAxis = d3.svg.axis()
			.scale(x).orient("bottom").ticks(20);
		*/	
		var axis = d3.select("#chartContainer svg").append("g");
		/*
		axis.attr("class", "grid")
			.call(xAxis)
			.attr("transform","translate(0,10)");*/
		axis.attr("class","grid").call(yAxis);	
		
		//this.test([12,51,61,80,90,150,200,432,125,155]);
		
}
			
BarChart.prototype.onRealtimeUpdate = function(packets) {	
	var hitCount = 0;
	$.each(packets.data, function(index,element)
		{
			hitCount += element.HitCount;		
		});
	this.hitCount += hitCount;
}


BarChart.prototype.redraw = function(data,x,y,w,h) {
	var rect = this.chart.selectAll("rect")
		.data(data, function(d) { return data.indexOf(d); });
	
	rect.enter().insert("rect", "line")
	  .attr("x", function(d, i) { return x(i + 1) - .5; })
	  .attr("y", function(d) {return h - y(d.value+1) - .5; })
	  .attr("width", w)
	  .attr("height", function(d) { return y(d.value+1); })
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

BarChart.prototype.test= function(data) {
	var x = d3.scale.linear().domain([0, data.length]).range([0, 400]);
	var y = d3.scale.linear().domain([0, 500]).range([80, 0]);
	
	var line = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d,i) {
			// verbose logging to show what's actually being done
			console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
			// return the X coordinate where we want to plot this datapoint
			return x(i);
		})
		.y(function(d) {
			// verbose logging to show what's actually being done
			console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
			// return the Y coordinate where we want to plot this datapoint
			return y(d);
		})
	
	var axis = d3.select("#chartContainer svg").append("g").append("svg:path").attr("d", line(data));
	
}
