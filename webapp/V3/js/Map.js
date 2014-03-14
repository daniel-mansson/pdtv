var Map = function() {

	this.countries = {};
	var countries = this.countries;
	this.period = 8000;
	var period = this.period;
	this.map = new Datamap({
		element: document.getElementById('mapContainer'),
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
		,projection: 'mercator'
	});
	
	this.ballManager = null;
		
	var self = this;
	/*setInterval(function() {
		self.fadeUpdate(1000.0 / 100.0);
	}, 100);*/

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

Map.prototype.onDataPoint = function(location, dir) {
	var c = this.countries[location.Country];
	if(c === undefined) {
		c = new CountryData();
		c.isocode = location.Country;
		this.countries[location.Country] = c; 
	}
	
	c.handleDataPoint(location);
	

	var color = dir == 0 ? "#ff0000" : "#00ffff";
	
    this.map.svg.selectAll('.' + location.Country)
		.style('fill', color);
    
    this.map.svg.selectAll('.' + location.Country)
      	.transition()
      	.duration(2000)
      	.style('fill', "#1C1C34");
};


Map.prototype.onRealtimeUpdate = function(data) {
	
	var self = this;
	params = {};
	
	data.data.forEach(function(packet){
		if(packet.from.Country != "__") {
			var p = packet.from;
			p.hits = packet.HitCount;
			self.onDataPoint(p, 0);
			//params[p.Country] = self.colors(Math.random() * self.colors.length);

			if(self.ballManager != null) {
				for(var i = 0; i < p.hits; ++i)
					self.ballManager.newBall(packet.from.Country, "SWE", 1, 1);
			}
		}
		if(packet.to.Country != "__"){
			var p = packet.to;
			p.hits = packet.HitCount;
			self.onDataPoint(p, 1);
			//params[p.Country] = self.colors(Math.random() * self.colors.length);		
			if(self.ballManager != null) {
				for(var i = 0; i < p.hits; ++i)
					self.ballManager.newBall("SWE", packet.to.Country, 0, 1);
			}
		}
		
	});

	//this.map.updateChoropleth(params);
};


Map.prototype.fadeUpdate = function(timeStep) {

	params = {};
	
	for(c in this.countries) {
		var country = this.countries[c];
		country.update(1,this.period);
		
		if(country.data.length > 0) {
			var cv = country.getValue(this.period);
			cv = Math.pow(cv, 2);
			country.color = d3.interpolateRgb("#1C1C34", "#00ffff")(cv);
		}
		
		params[c] = country.color;

	}


};
