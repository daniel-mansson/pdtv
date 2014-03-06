var Map = function() {

	this.countries = {};
	var countries = this.countries;
	this.map = new Datamap({
		element: document.getElementById('container'),
		fills: {
			defaultFill: "#1C1C34"
		},
		geographyConfig: {
			borderColor: "#000000",
			highlightOnHover: true,
			highlightFillColor: function() {
				return "#ff0000";
			},
			popupTemplate: function(geography, data) { 
				console.log(countries);
				console.log(geography.id);
				console.log(countries[geography.id]);
              			return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
		        },
			highlightBorderColor: "#ffffff"
			
		}
	});
			
		

	this.colors = d3.scale.category10();
}

Map.prototype.update = function(model) {
	var app = this;
	console.log("Packets: " + model.data.data.length);
	model.data.data.forEach(function(packet){
		if(packet.from.Country != "__")
			app.onDataPoint(packet.from);
		if(packet.to.Country != "__")
			app.onDataPoint(packet.to);
	});
	
	var params = {};
	for(c in this.countries) {
		var country = this.countries[c];
		country.update(1,5000);
		if(country.data.length > 0)
			params[c] = d3.hsl(0, 1, 1).toString();
			//params[c] = this.colors(country.totalHits);
		else
			params[c] = "#ABDDA4";
	}
	
	this.map.updateChoropleth(params);
};

Map.prototype.onDataPoint = function(location) {
	var c = this.countries[location.Country];
	if(c === undefined) {
		c = new CountryData();
		c.isocode = location.Country;
		this.countries[location.Country] = c; 
	}
	
	c.handleDataPoint(location);
}
