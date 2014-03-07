var CountryData = function() {
	this.isocode = "";
	this.data = [];
	this.color = "#1c1c34";
	this.totalHits = 0;
	this.minDiff = 0;
};

//Returns a value depending on data and time
CountryData.prototype.getValue = function(period) {
	var v = this.minDiff / period;
	if(v < 0)
		v = 0;
	else if(v > 1)
		v = 1;
	return 1 - v;
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
	this.totalHits = 0;
	for(var i = 0; i < this.data.length; ++i) {
		var diff = current - this.data[i].time;
		
		if(diff < this.minDiff)
			this.minDiff = diff;
		if(diff <= period){
			this.totalHits += this.data[i].packet.hits;	
			newData.push(this.data[i]);
		}
	}
	this.data = newData;
	
};