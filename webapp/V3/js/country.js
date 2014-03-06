function CountryData() {
	this.isocode = ""
	this.data = []
	
}

//Returns a value depending on data and time
CountryData.prototype.getValue = function(time, period) {
	return 0;
}

//Add the data point to the list
CountryData.prototype.handleDataPoint = function(packet) {

}

//Update from the interval callback prior to map update
CountryData.prototype.update = function(time, period) {

}