var BallManager = function(rendererContainer, map) {
	this.rendererContainer = rendererContainer;
	this.container = new PIXI.SpriteBatch();
	this.shadowContainer = new PIXI.SpriteBatch();
	this.textureTo = new PIXI.Texture.fromImage("images/small_blue.png");
	this.textureFrom = new PIXI.Texture.fromImage("images/small_red.png");
	this.textureShadow = new PIXI.Texture.fromImage("images/shadow.png");
	this.countryPos = {};

	rendererContainer.stage.addChild(this.shadowContainer);
	rendererContainer.stage.addChild(this.container);
	rendererContainer.addFrameListener(this);
	
	
	/*var cp = new CountryPos(null, "__");
	cp.center = new PIXI.Point(390, 50);
	this.countryPos[cp.country] = cp;
	var cp = new CountryPos(null, "Unknown");
	cp.center = new PIXI.Point(390, 50);
	this.countryPos[cp.country] = cp;*/
	
	this.delayContainer = [];
	this.delayTime = 1;
	
	this.map = map;
	this.flashList = [];
	
	this.t = 0;
	this.adsf = 0;

	this.resize();
	
	this.ballV0 = 50 * 4;
};

BallManager.prototype.resize = function() {
	this.countryPos = {};
	
	var countries = $("path.datamaps-subunit");	
	for(var i = 0; i < countries.length; ++i) {
		var c = countries[i];
		
		var countryISO = c.classList[1];
		var cp = new CountryPos(c.pathSegList, countryISO);
		
		this.countryPos[countryISO] = cp;
	}

	this.delayContainer = [];
	for (var i = this.container.children.length - 1; i >= 0; i--) {
		this.container.removeChild(this.container.children[i]);
	};
	for (var i = this.shadowContainer.children.length - 1; i >= 0; i--) {
		this.shadowContainer.removeChild(this.shadowContainer.children[i]);
	};
	
	this.ballV0 = 4 * $("#mapContainer").height() / 10;

};

BallManager.prototype.onFrameRender = function(timeStep) { 
/*	if(Math.random() > 0.96) {
		for(var i = 0; i < 4; ++i) {
			this.newBall("SWE", "ARG", 0, 1);
			this.newBall("SWE", "NAM", 0, 1);
			this.newBall("SWE", "MEX", 1, 1);
			this.newBall("SWE", "JPN", 0, 1);
		}
	}
*/
	var self = this;
	var remainingFlash = [];
	this.flashList.forEach(function(v) {
		v.time -= timeStep;
		
		if(v.time <= 0) {
			self.map.flashCountry(v.country);
		}
		else {
			remainingFlash.push(v);
		}
	});
	this.flashList = remainingFlash;
	
	var remainingDelay = [];
	this.delayContainer.forEach(function(v) {
		v.time += timeStep;
		
		if(v.time > self.delayTime) {
			self.shadowContainer.addChild(v.shadow);
			self.container.addChild(v.ball);
		}
		else {
			remainingDelay.push(v);
		}
	});
	this.delayContainer = remainingDelay;
	
	var self = this;
	this.container.children.forEach(function(ball) {
		ball.time += timeStep;
		
		var t = ball.time / ball.duration;

		var v0 = self.ballV0;
		var z = v0 * t - v0 * t * t;

		ball.position.x = ball.from.x * (1 - t) + ball.to.x * t;
		ball.position.y = ball.from.y * (1 - t) + ball.to.y * t;

		ball.shadow.position.x = ball.position.x;
		ball.shadow.position.y = ball.position.y;
		
		ball.position.y -= z;
		
		if(ball.time > ball.duration) {
			self.shadowContainer.removeChild(ball.shadow);
			self.container.removeChild(ball);
		}
	});
};

BallManager.prototype.newBall = function(fromCountry, toCountry, type, duration) {
	var fromC = this.countryPos[fromCountry];
	var toC = this.countryPos[toCountry];

	if(fromC === undefined || toC === undefined)
		return;
	
	var from = fromC.getRandom();
	var to = toC.getRandom();
	
	var texture = type == 0 ? this.textureTo : this.textureFrom;
	if(fromCountry === "__" || toCountry === "__")
		texture = this.textureShadow;
	
	var ball = new PIXI.Sprite(texture);
	
	ball.position.x = from.x;
	ball.position.y = from.y;

	ball.anchor.x = 0.5;
	ball.anchor.y = 0.5;

	ball.time = 0;
	ball.duration = duration;
	ball.from = new PIXI.Point(ball.position.x, ball.position.y);
	ball.to = new PIXI.Point(to.x, to.y);
	
	ball.alpha = 0.7;

	var shadow = new PIXI.Sprite(this.textureShadow);
	shadow.position.x = 0.5;
	shadow.position.y = 0.5;
	shadow.alpha = 0.3;
	
	ball.shadow = shadow;
	
	if(type == 0) {
		this.shadowContainer.addChild(shadow);
		this.container.addChild(ball);
		this.flashList.push({time: duration, country: toCountry});
	}
	else {
		this.delayContainer.push({time: 0, ball: ball, shadow: shadow});
		this.flashList.push({time: duration, country: fromCountry});
	}
	
	
};

