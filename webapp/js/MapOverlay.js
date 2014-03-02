function MapOverlay(map, model) {
	this.model = model;
	this.model.addListener(this);
	
	this.map = map;
	
	this.heatmapData = [];
	
	this.heatmap = new google.maps.visualization.HeatmapLayer({
		data : this.heatmapData,
		opacity : 0.8,
		map : map
	});

	this.heatmap.setMap(this.map);
}

MapOverlay.prototype.update = function(model) {
	

	var array = this.heatmapData;

	model.data.data.forEach(function(entry) {
		var location_from =	{	location: new google.maps.LatLng(entry.from.Latitude,entry.from.Longitude),
		                    	weight: entry.HitCount/100};
		var location_to =	{	location: new google.maps.LatLng(entry.to.Latitude,entry.to.Longitude),
		                		weight: entry.HitCount/100};
		                  
		array.push(location_from);
		array.push(location_to);
	});

	this.heatmap.map_changed();
};