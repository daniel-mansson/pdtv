function MapOverlay(map, model) {
	this.model = model;
	this.model.addListener(this);
	
	this.map = map;
	
	this.heatmap = new google.maps.visualization.HeatmapLayer({
		data : [],
		opacity : 0.8,
		map : map
	});

	this.heatmap.setMap(this.map);
}

MapOverlay.prototype.update = function(model) {
	console.log("MapOverlay.prototype.update()");
	var array = [];
	model.data.data.forEach(function(entry) {
		var location_from =	{	location: new google.maps.LatLng(entry.from.Latitude,entry.from.Longitude),
			                    	weight: Math.log(entry.HitCount+1)/Math.log(2)};
		var location_to =	{	location: new google.maps.LatLng(entry.to.Latitude,entry.to.Longitude),
		                		weight: Math.log(entry.HitCount+1)/Math.log(2)};
		                  
		array.push(location_from);
		array.push(location_to);
	});
	console.log("Packets: "+array.length/2);
	this.heatmap.setData(array);
	//this.heatmap.map_changed();
};
