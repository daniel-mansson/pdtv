var App = function() {
	
	this.model = new DataModel();
	
	this.renderer = new Renderer();
	
	
	this.map = new Map();
	this.model.addListener(this.map);
	this.model.addRealtimeListener(this.map);

	this.ballManager = new BallManager(this.renderer);
	this.map.ballManager = this.ballManager;

	this.barChart = new BarChart();
	this.model.addRealtimeListener(this.barChart);
	
	this.connection = new Connection("ws://localhost:8080/realtime", this.model);
	
};

