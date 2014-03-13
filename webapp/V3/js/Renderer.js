var Renderer = function() {
	
	this.stage = new PIXI.Stage();
	var mapCont = document.getElementById("outerMapContainer");
	this.renderer = PIXI.autoDetectRenderer(mapCont.scrollWidth, mapCont.scrollHeight, null, true);

	this.renderer.view.style.position = "absolute";
	this.renderer.view.style.pointerEvents = "none";
	mapCont.appendChild(this.renderer.view);

	requestAnimFrame(animate);

	var self = this;
	function animate() {
		requestAnimFrame(animate);
		
		self.frameListeners.forEach(function(listener ){
			listener.onFrameRender(0.01666);//TODO: real timestep
		});
		
		self.renderer.render(self.stage);
	}
	
	this.frameListeners = [];
};

Renderer.prototype.addFrameListener = function(listener) {
	this.frameListeners.push(listener);
};
