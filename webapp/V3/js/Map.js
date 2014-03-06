var Map = function() {

	this.countries = {};
	var countries = this.countries;
	this.period = 30000;
	var period = this.period;
	this.map = new Datamap({
		element: document.getElementById('container'),
		fills: {
			defaultFill: "#1C1C34"
		},
		geographyConfig: {
			borderColor: "#000000",
			highlightOnHover: true,
			highlightBorderColor: "#ffffff",
			highlightFillColor: function(geography,data) {
				if (countries[geography.id]) {
					return countries[geography.id].color;
				} else {
					return "#1C1C34";
				}
			},
			popupTemplate: function(geography, data) { 
				if (countries[geography.id]) {
					var totalHits = countries[geography.id].totalHits;
				}
				else {
					var totalHits = 0;
				}
					return '<div class="hoverinfo"><strong>' + geography.properties.name + '</br>Packets during the last '+period/1000+' seconds: '+totalHits+' </div>';
		        }
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
		country.update(1,this.period);
		if(country.data.length > 0) {
			var cv = country.getValue(this.period) * 255;
			params[c] = d3.rgb(cv, cv, 0).toString();
		}
		else
			params[c] = "#1C1C34";
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
