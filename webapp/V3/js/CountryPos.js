var CountryPos = function(pathList, countryISO) {
	this.country = countryISO;
	

	var avg = new PIXI.Point();
	var count = 0;
	for(var j = 0; j < pathList.numberOfItems; ++j) {
		var item = pathList.getItem(j);
		if(item.pathSegTypeAsLetter == "M" || item.pathSegTypeAsLetter == "L") {
			avg.x += item.x;
			avg.y += item.y;
			++count;
		}
	}
	
	this.center = new PIXI.Point(avg.x / count, avg.y / count) ;
};

CountryPos.prototype.getCenter = function() {
	return this.center;
};

CountryPos.prototype.getRandom = function(t) {
	return this.center;
};