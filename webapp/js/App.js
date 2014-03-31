var App = function() {

	this.model = new DataModel();

	this.renderer = new Renderer();

	this.map = new Map(this.model);
	this.model.addListener(this.map);
	this.model.addRealtimeListener(this.map);
	this.renderer.addFrameListener(this.map);

	this.ballManager = new BallManager(this.renderer, this.map);
	this.map.ballManager = this.ballManager;

	// this.pieChart = new Pie();
	// this.model.addRealtimeListener(this.pieChart);

	this.barChart = new BarChart(this.map.color);
	this.model.addRealtimeListener(this.barChart);

	this.connection = new Connection("ws://localhost:8080/realtime", this.model);

	var self = this;
	$(window).resize(function() {

		var width = $(window).width() - 50;	
		var height = width * 350 / 850;
		
		$(".resizeWidth").width(width);
		$(".resizeHeight").height(height);
		// resize.css("height", "700px");

		self.map.recreateMap();
		self.barChart.remove();
		self.model.removeRealtimeListener(self.barChart);
		self.barChart = new BarChart(self.map.color);
		self.model.addRealtimeListener(self.barChart);
		self.renderer.resize(width, height);
		self.ballManager.resize();

		if(width < 360)
			width = 360;
		$("#header").width(width);
	});
};
