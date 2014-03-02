function MapOverlay(map, model) {
	this.model = model;
	this.model.addListener(this);
	
	this.map = map;
	
	this.heatmapArray = [];
	
	this.heatmap = new google.maps.visualization.HeatmapLayer({
		data : this.heatmapArray,
		opacity : 0.8,
		map : map
	});

	this.heatmap.setMap(this.map);
}

MapOverlay.prototype.update = function(model) {
	
	//TODO: Convert model.data.data -> valid heatmap data
	var heatmapData = [ {
		name : "dn.se",
		ip : "216.206.30.40",
		country : "US",
		city : "Dallas",
		location : new google.maps.LatLng(32.780140, -96.800451),
		timestamp : 1000,
		weight : 1,
		path : []
	}, {
		name : "imgur.com",
		ip : "23.23.110.58",
		country : "US",
		city : "Ashburn",
		location : new google.maps.LatLng(39.0436, -77.4878),
		timestamp : 1800,
		weight : 1,
		path : []
	}, {
		name : "outlook.com",
		ip : "157.56.253.86",
		country : "US",
		city : "Redmond",
		location : new google.maps.LatLng(47.6742, -122.1206),
		timestamp : 1900,
		weight : 1,
		path : []
	} ];

	var array = this.heatmapArray;
	heatmapData.forEach(function(entry) {
		array.push(entry);
	});

	this.heatmap.map_changed();
}