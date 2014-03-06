var CountryData = function() {
	this.isocode = "";
	this.data = [];
	this.color = "#1c1c34";
	this.totalHits = 0;
	this.minDiff = 0;
};

//Returns a value depending on data and time
CountryData.prototype.getValue = function(time, period) {
	return 0;
};

//Add the data point to the list
CountryData.prototype.handleDataPoint = function(packet) {
	this.data.push({
		packet: packet,
		time: new Date(new Date() + 3600000)
	});
};

//Update from the interval callback prior to map update
CountryData.prototype.update = function(time, period) {
	var current = new Date(new Date() + 3600000);
	
	this.minDiff = period;
	var newData = [];
	for(var i = 0; i < this.data.length; ++i) {
		var diff = current - this.data[i].time;
		
		if(this.minDiff < period)
			this.minDiff = period;
		if(diff <= period)
			newData.push(this.data[i]);
	}
	this.data = newData;
	this.totalHits = this.data.length;
	
};