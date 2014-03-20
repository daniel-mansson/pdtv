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
	setInterval(function() {
		self.fadeUpdate(1000.0 / 1000.0);
	}, 1000);

	this.colors = d3.scale.category10();
	
	this.fadeCountries = {};
	this.activeFadeCountries = {};
	this.frameCount = 0;
	
	// LEGEND
	var color_domain = [50, 150, 350, 750, 1500, 3000];
	var color = d3.scale.threshold()
		.domain(color_domain)
		.range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300", "#ffffff"]);
	var ext_color_domain = [0, 50, 150, 350, 750, 1500, 3000];
	var legend_labels = ["< 50", "50+", "150+", "350+", "750+", "> 1500","LOL"];
	var ls_w = 20, ls_h = 20;
	
	console.log(color(966));
	
	var svg = d3.select("svg");
	var legend = svg.selectAll("g.legend")
		.data(ext_color_domain)
		.enter().append("g")
		.attr("class", "legend");
	
	legend.append("rect")
		.attr("x", 20)
		.attr("y", function(d, i){ return 400 - (i*ls_h) - 2*ls_h;})
		.attr("width", ls_w)
		.attr("height", ls_h)
		.style("fill", function(d, i) { return color(d); })
		.style("opacity", 0.8);

	legend.append("text")
		.attr("x", 50)
		.attr("y", function(d, i){ return 400 - (i*ls_h) - ls_h - 4;})
		.text(function(d, i){ return legend_labels[i]; });
		
	
};

Map.prototype.onFrameRender = function(timeStep) {
	if (this.frameCount % 4 == 0) {
		for ( var c in this.activeFadeCountries) {
			var fade = this.activeFadeCountries[c];
			fade.update(timeStep * 4);
			
			if(!fade.isFading()) {
				delete this.activeFadeCountries[c];
			}
		}
	}
	++this.frameCount;
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

Map.prototype.flashCountry = function(country, color) {
/*
    var elements = this.map.svg.selectAll('.' + country);
    var c = this.colors(Math.random() * this.colors.length);
    elements
		.style('fill', c) ;*/
	
	var c = this.fadeCountries[country];
	if(c === undefined) {
		c = new CountryColorFade(country, this);
		this.fadeCountries[country] = c;
	}
	
	c.startFade();
	this.activeFadeCountries[country] = c;
};

Map.prototype.onDataPoint = function(location, dir) {
	var c = this.countries[location.Country];
	if(c === undefined) {
		c = new CountryData();
		c.isocode = location.Country;
		this.countries[location.Country] = c; 
	}
	
	c.handleDataPoint(location);
};


Map.prototype.onRealtimeUpdate = function(data) {
	
	var self = this;
	params = {};
	
	var homeCountry = "SWE";
	
	data.data.forEach(function(packet){
		
		if(packet.from.Country != homeCountry) {
			var p = packet.from;
			p.hits = packet.HitCount;
			self.onDataPoint(p, 0);
			//params[p.Country] = self.colors(Math.random() * self.colors.length);
		}
		else {
			if(self.ballManager != null) {
				for(var i = 0; i < packet.HitCount; ++i)
					self.ballManager.newBall("SWE", packet.to.Country, 0, 1);
			}
		}
		
		if(packet.to.Country != homeCountry){
			var p = packet.to;
			p.hits = packet.HitCount;
			self.onDataPoint(p, 1);
			//params[p.Country] = self.colors(Math.random() * self.colors.length);	
		}
		else {
			if(self.ballManager != null) {
				for(var i = 0; i < packet.HitCount; ++i)
					self.ballManager.newBall(packet.from.Country, "SWE", 1, 1);
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
		/*
		if(country.data.length > 0) {
			var cv = country.getValue(this.period);
			cv = Math.pow(cv, 2);
			country.color = d3.interpolateRgb("#1C1C34", "#00ffff")(cv);
		}
		
		params[c] = country.color;
		*/
	}


};
