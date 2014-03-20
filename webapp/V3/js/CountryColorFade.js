var CountryColorFade = function(country, map) {
	this.country = country;
	this.baseColor = "#1C1C34";
	this.fadeColor = "#ffffff";
    this.svg = map.map.svg.selectAll('.' + country);
	
	this.fadeTime = 0;
	this.fadeDuration = 0.3;
};

CountryColorFade.prototype.update = function(timeStep) {
	this.fadeTime -= timeStep;
	
	if(this.fadeTime > 0) {
		this.svg.style({fill: d3.interpolateRgb(this.baseColor, this.fadeColor)(this.fadeTime / this.fadeDuration)});
	} else {
		this.svg.style({fill: this.baseColor});
	}
};

CountryColorFade.prototype.isFading = function() {
	return this.fadeTime > 0;
};

CountryColorFade.prototype.startFade = function(){
	this.fadeTime = this.fadeDuration;
};