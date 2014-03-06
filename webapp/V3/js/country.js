var CountryData = function() {
	this.isocode = "";
	this.data = [];
	
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
	
	var newData = [];
	for(var i = 0; i < this.data.length; ++i) {
		var diff = current - this.data[i].time;
		
		if(diff <= period)
			newData.push(this.data[i]);
	}
	console.log(this.data.length);
	this.data = newData;
	
};