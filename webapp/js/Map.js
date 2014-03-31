var Map = function(model) {

	this.countries = {};
	this.model = model;
	
	this.fadeCountries = {};
	this.activeFadeCountries = {};
	this.frameCount = 0;
	this.period = 8000;
	var period = this.period;
	
	this.ballManager = null;
		
	var self = this;
	setInterval(function() {
		self.fadeUpdate(1000.0 / 1000.0);
	}, 1000);

	
	
	
	// LEGEND
	var color_domain = [1,10, 50, 150, 350, 750, 1500];
	var color = d3.scale.threshold()
		.domain(color_domain)
		.range(["#4C5C74", "#337297","#69D2E7", "#A7DBD8", "#E0E4CC", "#f4B57E",  "#F38630", "#FC5900"]);

	this.color = color;
	

	this.recreateMap();
};

Map.prototype.recreateMap = function() {
	 $("#mapContainer").empty();

	var countries = this.fadeCountries;
	
	var ext_color_domain = [0,1,10, 50, 150, 350, 750, 1500];
	var legend_labels = ["0","1+", "10+", "50+", "150+", "350+", "750+", "1500+"];
	var ls_w = 20, ls_h = 20;
	var color = this.color;
	

	$("#mapContainer").append("<button id=\"resetButton\">Reset</button>");
	
	this.map = new Datamap({
		element: document.getElementById('mapContainer'),
		fills: {
			defaultFill: "#4C5C74"
		},
		geographyConfig: {
			borderColor: "#000000",
			highlightOnHover: true,
			highlightBorderColor: "#8af",
			popupTemplate: function(geography, data) { 
				var totalHits;
				var rec = 0;
				var sent = 0;
				var c = countries[geography.id]; 
				if (c !== undefined) {
					totalHits = c.hitsReceived + c.hitsSent;
					sent = c.hitsSent;
					rec = c.hitsReceived;
				}
				else {
					totalHits = 0;
				}
					return '<div class="hoverinfo"><strong>' + geography.properties.name + "</strong>"
					+ '</br>Packets received: '+ rec 
					+ '</br>Packets sent: '+ sent 
					+ '</br>Packets total: '+ totalHits
					+' </div>';
		        }
		}
		//,projection: 'mercator'
	});
	
	var svg = d3.select("svg");
	var legend = svg.selectAll("g.legend")
		.data(ext_color_domain)
		.enter().append("g")
		.attr("class", "legend");
	
	var bottomPos = $("#mapContainer").height();
	
	legend.append("rect")
		.attr("x", 10)
		.attr("y", function(d, i){ return bottomPos - (i*ls_h) - 2*ls_h;})
		.attr("width", ls_w)
		.attr("height", ls_h)
		.style("fill", function(d, i) { return color(d); })
		.style("stroke", "black");

	legend.append("text")
		.attr("x", 35)
		.attr("y", function(d, i){ return bottomPos - (i*ls_h) - ls_h - 4;})
		.text(function(d, i){ return legend_labels[i]; });
	
	
	var fadeCountries = this.fadeCountries;
	$("#resetButton").on("click",	function() {
		for ( var c in fadeCountries) {
		//	console.log(fadeCountries[c]);
			fadeCountries[c].reset(color);
		}
	});
	
	for(var c in this.fadeCountries) {
		var country = this.fadeCountries[c];
		country.onRecreate(this);
		country.update(0);
	}
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
	
	c.startFade(this.color);
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
	var local = this.model.localIP;
	params = {};
	
	data.data.forEach(function(packet){
		
		if(packet.from.Addr == local) {
			var country = packet.to.Country;
			var c = self.fadeCountries[country];
			if(c === undefined) {
				c = new CountryColorFade(country, self);
				self.fadeCountries[country] = c;
			}

			var hits = packet.HitCount;
			c.addHits(hits, 0);
			

			if(self.ballManager != null) {
				for(var i = 0; i < packet.HitCount; ++i)
					self.ballManager.newBall("SWE", packet.to.Country, 0, 1);
			}
		}
		
		if(packet.to.Addr == local){
			var country = packet.from.Country;
				
			var c = self.fadeCountries[country];
			if(c === undefined) {
				c = new CountryColorFade(country, self);
				self.fadeCountries[country] = c;
			}
			var hits = packet.HitCount;
			c.addHits(0, hits);
			
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
