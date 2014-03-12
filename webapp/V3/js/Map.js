var Map = function() {

	this.countries = {};
	var countries = this.countries;
	this.period = 20000;
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
				var totalHits;
				if (countries[geography.id]) {
					totalHits = countries[geography.id].totalHits;
				}
				else {
					totalHits = 0;
				}
					return '<div class="hoverinfo"><strong>' + geography.properties.name + '</br>Packets during the last '+period/1000+' seconds: '+totalHits+' </div>';
		        }
		}
	});
	
		
	var m = this;
	setInterval(function() {
		m.update({
			data:{data:[]}
		});
	}, 1300);

	this.colors = d3.scale.category10();
};

Map.prototype.update = function(model) {
	var app = this;
	//console.log("Packets: " + model.data.data.length);
	model.data.data.forEach(function(packet){
		if(packet.from.Country != "__") {
			var p = packet.from;
			p.hits = packet.HitCount;
			app.onDataPoint(p);
		}
		if(packet.to.Country != "__"){
			var p = packet.to;
			p.hits = packet.HitCount;
			app.onDataPoint(p);
		}
	});
	
	var params = {};
	for(c in this.countries) {
		var country = this.countries[c];
		country.update(1,this.period);
		
		if(country.data.length > 0) {
			var cv = country.getValue(this.period);
			cv = Math.pow(cv, 2);
			country.color = d3.interpolateRgb("#1C1C34", "#00ffff")(cv);
		}
		else
			country.color = "#1C1C34";
			
		params[c] = country.color;
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
};
