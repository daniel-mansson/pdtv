function MapOverlay(map, model) {
	this.model = model;
	this.model.addListener(this);
	
	this.map = map;
	
	this.heatmap = new google.maps.visualization.HeatmapLayer({
		data : [],
		opacity : 1,
		map : map,
		maxIntensity: 500,
	});

	this.heatmap.setMap(this.map);
}

MapOverlay.prototype.update = function(model) {
	console.log("MapOverlay.prototype.update()");
	var array = [];
	model.data.data.forEach(function(entry) {
		var weightFactor_from = entry.from.City == "Unknown" ? 0 : 1;
		var weightFactor_to = entry.to.City == "Unknown" ? 0 : 1;
		var location_from =	{	location: new google.maps.LatLng(entry.from.Latitude,entry.from.Longitude),
			                    	weight: 1*weightFactor_from//Math.pow(entry.HitCount+1,0.1)
					};
		var location_to =	{	location: new google.maps.LatLng(entry.to.Latitude,entry.to.Longitude),
		                		weight: 1*weightFactor_to//Math.pow(entry.HitCount+1,0.1)
					};
		console.log(entry.from.City);
		if (entry.from.Country!="__")                   
			array.push(location_from);
		if (entry.to.Country!="__") 
			array.push(location_to);
	});
	console.log("Packets: "+array.length);
	this.heatmap.setData(array);
	//this.heatmap.map_changed();
};
