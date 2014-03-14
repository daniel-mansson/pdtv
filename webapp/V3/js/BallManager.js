var BallManager = function(rendererContainer) {
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
	
	var countries = $("path.datamaps-subunit");
	
	for(var i = 0; i < countries.length; ++i) {
		var c = countries[i];
		
		var countryISO = c.classList[1];
		var cp = new CountryPos(c.pathSegList, countryISO);
		
		this.countryPos[countryISO] = cp;
	}

	var cp = new CountryPos(null, "__");
	cp.center = new PIXI.Point(0, 0);
	this.countryPos[cp.country] = cp;
	var cp = new CountryPos(null, "Unknown");
	cp.center = new PIXI.Point(600, 0);
	this.countryPos[cp.country] = cp;
};

BallManager.prototype.onFrameRender = function(timeStep) { 
	/*if(Math.random() > 0.9)
		this.newBall("SWE", "ARG", 0, 1);*/
	
	var self = this;
	this.container.children.forEach(function(ball) {
		ball.time += timeStep;
		
		var t = ball.time / ball.duration;

		var v0 = 30*4;
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
	
	var from = fromC.getCenter();
	var to = toC.getCenter();
	
	var texture = type == 0 ? this.textureTo : this.textureFrom;
	var ball = new PIXI.Sprite(texture);

	ball.position.x = from.x + Math.random() * 20 - 10;
	ball.position.y = from.y + Math.random() * 20 - 10;

	ball.anchor.x = 0.5;
	ball.anchor.y = 0.5;

	ball.time = 0;
	ball.duration = duration;
	ball.from = new PIXI.Point(ball.position.x, ball.position.y);
	ball.to = new PIXI.Point(to.x + Math.random() * 20 - 10, to.y + Math.random() * 20 - 10);
	
	
	ball.alpha = 0.7;
	

	var shadow = new PIXI.Sprite(this.textureShadow);
	shadow.position.x = 0.5;
	shadow.position.y = 0.5;
	shadow.alpha = 0.3;
	
	ball.shadow = shadow;
	
	this.shadowContainer.addChild(shadow);
	this.container.addChild(ball);
};

