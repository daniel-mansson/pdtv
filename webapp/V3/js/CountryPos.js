var CountryPos = function(pathList, countryISO) {
	this.country = countryISO;
	this.radius = 10;

	if (pathList != null) {
		var avg = new PIXI.Point();
		var count = 0;
		
		var parts = [];
		var part = [];
		
		for (var j = 0; j < pathList.numberOfItems; ++j) {
			var item = pathList.getItem(j);

			if(item.pathSegTypeAsLetter == "M") {
				if(part.length > 0) {
					parts.push(part);
				}
				part = [];
			}
			
			if (item.pathSegTypeAsLetter == "M" || 
					item.pathSegTypeAsLetter == "L") {
				/*avg.x += item.x;
				avg.y += item.y;
				++count;*/
				part.push({x: item.x, y: item.y});
			}
		}
		if(part.length > 0) {
			parts.push(part);
		}
		
		var max = 0;
		var maxC = null;
		parts.forEach(function(p) {
			if(p.length > max) {
				max = p.length;
				maxC = p;
			}
		});
		
		var minx = 1000000, miny = 1000000, maxx = -1000000, maxy = -1000000;
		maxC.forEach(function(p){
			if(p.x < minx)
				minx = p.x;
			if(p.x > maxx)
				maxx = p.x;
			if(p.y < miny)
				miny = p.y;
			if(p.y > maxy)
				maxy = p.y;
			
			avg.x += p.x;
			avg.y += p.y;
		});
		count = maxC.length;
		
		if(maxx - minx < maxy - miny)
			this.radius = (maxx - minx) * 0.5;
		else
			this.radius = (maxy - miny) * 0.5;

		this.center = new PIXI.Point((minx + maxx) * 0.5, (miny + maxy) * 0.5);
	}
};

CountryPos.prototype.getCenter = function() {
	return this.center;
};

CountryPos.prototype.getRandom = function(t) {
	var d = Math.random() * 2 * Math.PI;
	var v = Math.random() * this.radius * 0.6;
	var x = v * Math.cos(d) + this.center.x;
	var y = v * Math.sin(d) + this.center.y;
	return new PIXI.Point(x, y);
};